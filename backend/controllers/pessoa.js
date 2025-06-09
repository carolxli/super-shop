import { db } from "../db.js";

export const getPessoa = async (req, res) => {
  const { nome } = req.query;
  let query = `SELECT * FROM "SuperShop"."Pessoa" ORDER BY "nome" ASC`;
  let values = [];

  if (nome) {
    query = `SELECT * FROM "SuperShop"."Pessoa" WHERE "nome" ILIKE $1 ORDER BY "nome" ASC`;
    values = [`%${nome}%`];
  }

  try {
    const result = await db.query(query, values);
    return res.status(200).json(result.rows);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Erro ao buscar pessoas", details: err });
  }
};

export const getPessoaById = async (req, res) => {
  const { idPessoa } = req.params;

  const q = `SELECT * FROM "SuperShop"."Pessoa" WHERE "idPessoa" = $1`;

  try {
    const result = await db.query(q, [idPessoa]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pessoa não encontrada" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao buscar pessoa por ID:", err);
    return res.status(500).json({ error: "Erro ao buscar pessoa por ID", details: err });
  }
};



export const getPessoaByNome = async (req, res) => {
  const nome = req.params.nome || "";
  const q = ` SELECT p."idPessoa", p."nome", p."email", u."idUsuario"
    FROM "SuperShop"."Pessoa" p
    LEFT JOIN "SuperShop"."Usuario" u ON p."idPessoa" = u."Pessoa_idPessoa"
    WHERE p."nome" ILIKE $1 LIMIT 10`;

  db.query(q, [`%${nome}%`], (err, data) => {
    if (err) {
      console.error("Erro ao buscar pessoa:", err);
      return res.status(500).json(err);
    }
    return res.status(200).json(data.rows);
  });
};

export const postPessoa = (req, res) => {
  const dataNasc = new Date(req.body.data_nasc);
  const hoje = new Date();

  const idade = hoje.getFullYear() - dataNasc.getFullYear();
  const mes = hoje.getMonth() - dataNasc.getMonth();
  const dia = hoje.getDate() - dataNasc.getDate();

  // Ajuste de idade se a data de aniversário ainda não chegou no ano atual
  const idadeFinal = mes < 0 || (mes === 0 && dia < 0) ? idade - 1 : idade;

  if (idadeFinal < 16 || idadeFinal > 60) {
    return res.status(400).json("Insira uma data de nascimento válida!.");
  }

  const q = `INSERT INTO "SuperShop"."Pessoa" (
      "email",
      "nome",
      "end_rua",
      "end_numero",
      "end_bairro",
      "end_complemento",
      "cidade",
      "estado",
      "cep",
      "telefone_1",
      "telefone_2",
      "data_nasc"
  ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`;

  const values = [
    req.body.email,
    req.body.nome,
    req.body.end_rua,
    req.body.end_numero,
    req.body.end_bairro,
    req.body.end_complemento,
    req.body.cidade,
    req.body.estado,
    req.body.cep,
    req.body.telefone_1,
    req.body.telefone_2,
    req.body.data_nasc,
  ];

  db.query(q, values, (insertErr) => {
    if (insertErr) {
      console.error("Erro ao inserir Pessoa", insertErr);
      return res.status(500).json("Erro ao inserir pessoa");
    }
    return res.status(200).json("Pessoa inserida com sucesso");
  });
};


export const updatePessoa = (req, res) => {
  const q = `UPDATE "SuperShop"."Pessoa" SET
        "email" = $1,
        "nome" = $2,
        "end_rua" = $3,
        "end_numero" = $4,
        "end_bairro" = $5,
        "end_complemento" = $6,
        "cidade" = $7,
        "estado" = $8,
        "cep" = $9,
        "telefone_1" = $10,
        "telefone_2" = $11,
        "data_nasc" = $12
    WHERE "idPessoa" = $13`;

  const values = [
    req.body.email,
    req.body.nome,
    req.body.end_rua,
    req.body.end_numero,
    req.body.end_bairro,
    req.body.end_complemento,
    req.body.cidade,
    req.body.estado,
    req.body.cep,
    req.body.telefone_1,
    req.body.telefone_2,
    req.body.data_nasc,
  ];

  db.query(q, [...values, req.params.idPessoa], (err) => {
    if (err) {
      return res.json(err);
    }
    return res.status(200).json("Pessoa atualizada com sucesso");
  });
};

export const deletePessoa = (req, res) => {
  const q = `DELETE FROM "SuperShop"."Pessoa" WHERE \"idPessoa\" = $1`;

  db.query(q, [req.params.idPessoa], (err) => {
    if (err) {
      return res.json(err);
    }
    return res.status(200).json("Pessoa deletada com sucesso");
  });
};