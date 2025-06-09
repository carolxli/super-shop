import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const loginUsuario = async (req, res) => {
  const { login, senha } = req.body;

  try {
    const result = await db.query(
      `SELECT u.*, p.nome, u.cargo 
       FROM "SuperShop"."Usuario" u
       JOIN "SuperShop"."Pessoa" p ON u."Pessoa_idPessoa" = p."idPessoa"
       WHERE u."login" = $1`,
      [login]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }

    const usuario = result.rows[0];

    if (senha !== usuario.senha) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    const token = jwt.sign(
      { id: usuario.idUsuario, cargo: usuario.cargo },
      "seuSegredoJWT",
      { expiresIn: "1h" }
    );

    return res
      .status(200)
      .json({ token, nome: usuario.nome, cargo: usuario.cargo });
  } catch (error) {
    return res.status(500).json({ message: "Erro no servidor.", error });
  }
};

export const getUsuario = async (req, res) => {
  const { nome } = req.query;
  let query = `
        SELECT 
            u.*,
            p."nome" AS "pessoa_nome",
            COALESCE(MAX(v."data"), NULL) AS "ultima_venda"
        FROM 
            "SuperShop"."Usuario" u
        JOIN 
            "SuperShop"."Pessoa" p ON u."Pessoa_idPessoa" = p."idPessoa"
        LEFT JOIN 
            "SuperShop"."Venda" v ON u."idUsuario" = v."Usuario_idUsuario"
        GROUP BY 
            u."idUsuario", p."nome", u."Pessoa_idPessoa"
        ORDER BY 
            p."nome" ASC
    `;

  const values = [];

  if (nome) {
    query = `
            SELECT 
                u.*,
                p."nome" AS "pessoa_nome",
                COALESCE(MAX(v."data"), NULL) AS "ultima_venda"
            FROM 
                "SuperShop"."Usuario" u
            JOIN 
                "SuperShop"."Pessoa" p ON u."Pessoa_idPessoa" = p."idPessoa"
            LEFT JOIN 
                "SuperShop"."Venda" v ON u."idUsuario" = v."Usuario_idUsuario"
            WHERE 
                p."nome" ILIKE $1
            GROUP BY 
                u."idUsuario", p."nome", u."Pessoa_idPessoa"
            ORDER BY 
                p."nome" ASC
        `;
    values.push(`%${nome}%`);
  }

  try {
    const result = await db.query(query, values);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    return res
      .status(500)
      .json({ error: "Erro ao buscar usuários", details: err });
  }
};

export const postUsuario = (req, res) => {
  const { dt_contratacao } = req.body;

  const dataContratacao = new Date(dt_contratacao);
  const dataMinima = new Date('2024-01-01');
  const hoje = new Date();
  const dataMaxima = new Date();
  dataMaxima.setDate(hoje.getDate() + 7);

  // Zerando hora para comparar apenas datas
  dataContratacao.setHours(0, 0, 0, 0);
  dataMinima.setHours(0, 0, 0, 0);
  dataMaxima.setHours(0, 0, 0, 0);

  if (dataContratacao < dataMinima || dataContratacao > dataMaxima) {
    return res.status(400).json({
      error: 'Insira uma data de contratação válida.'
    });
  }

  const q = `INSERT INTO "SuperShop"."Usuario" (
        "Pessoa_idPessoa",
        "senha",
        "cargo",
        "cpf",
        "rg",
        "login",
        "dt_contratacao",
        "Comissao_idComissao"
    ) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`;

  const values = [
    req.body.Pessoa_idPessoa,
    req.body.senha,
    req.body.cargo,
    req.body.cpf,
    req.body.rg,
    req.body.login,
    req.body.dt_contratacao,
    req.body.Comissao_idComissao,
  ];

  db.query(q, values, (insertErr) => {
    if (insertErr) {
      console.error("Erro ao inserir usuário", insertErr);
      return res.status(500).json("Erro ao inserir usuário");
    }
    return res.status(200).json("Usuário inserido com sucesso");
  });
};


export const updateUsuario = (req, res) => {
  const q = `UPDATE "SuperShop"."Usuario" SET
        "Pessoa_idPessoa" = $1,
        "senha" = $2,
        "cargo" = $3,
        "cpf" = $4,
        "rg" = $5,
        "login" = $6,
        "dt_contratacao" = $7,
        "Comissao_idComissao" = $8
    WHERE "idUsuario" = $9`;

  const values = [
    req.body.Pessoa_idPessoa,
    req.body.senha,
    req.body.cargo,
    req.body.cpf,
    req.body.rg,
    req.body.login,
    req.body.dt_contratacao,
    req.body.Comissao_idComissao,
  ];

  db.query(q, [...values, req.params.idUsuario], (err) => {
    if (err) {
      return res.json(err);
    }
    return res.status(200).json("Usuario atualizado com sucesso");
  });
};

export const deleteUsuario = (req, res) => {
  const idUsuario = req.params.idUsuario;

  const checkAdminQuery = `
    SELECT "cargo" FROM "SuperShop"."Usuario" WHERE "idUsuario" = $1
  `;

  db.query(checkAdminQuery, [idUsuario], (err, result) => {
    if (err) {
      console.error("Erro ao verificar cargo:", err);
      return res.status(500).json({ error: "Erro ao verificar o cargo do usuário." });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const cargo = result.rows[0].cargo;

    if (cargo === "Admin") {
      const countAdminsQuery = `
        SELECT COUNT(*) FROM "SuperShop"."Usuario" WHERE "cargo" = 'Admin'
      `;

      db.query(countAdminsQuery, (err, countResult) => {
        if (err) {
          console.error("Erro ao contar Admins:", err);
          return res.status(500).json({ error: "Erro ao contar usuários Admin." });
        }

        const totalAdmins = parseInt(countResult.rows[0].count);

        if (totalAdmins <= 1) {
          return res.status(403).json({ error: "Não é possível excluir o último usuário Admin." });
        }

        // OK para deletar
        const deleteQuery = `DELETE FROM "SuperShop"."Usuario" WHERE "idUsuario" = $1`;
        db.query(deleteQuery, [idUsuario], (err) => {
          if (err) {
            console.error("Erro ao deletar:", err);
            return res.status(500).json({ error: "Erro ao deletar o usuário." });
          }

          return res.status(200).json({ message: "Usuário deletado com sucesso." });
        });
      });
    } else {
      // Não é admin, pode excluir direto
      const deleteQuery = `DELETE FROM "SuperShop"."Usuario" WHERE "idUsuario" = $1`;
      db.query(deleteQuery, [idUsuario], (err) => {
        if (err) {
          console.error("Erro ao deletar:", err);
          return res.status(500).json({ error: "Erro ao deletar o usuário." });
        }

        return res.status(200).json({ message: "Usuário deletado com sucesso." });
      });
    }
  });
};


export const updateUserPassword = (req, res) => {
  const { login, senha } = req.body;

  const query = `
        UPDATE 
            "SuperShop"."Usuario"
        SET 
            "senha" = $1
        WHERE 
            "login" = $2
    `;

  try {
    db.query(query, [senha, login], (err) => {
      if (err) {
        console.error("Erro ao atualizar senha do usuário:", err);
        return res
          .status(400)
          .json({ error: "Erro ao atualizar senha do usuário", details: err });
      }
    });

    return res.status(200).json({ message: "Senha atualizada com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar senha do usuário:", err);

    return res
      .status(400)
      .json({ error: "Erro ao atualizar senha do usuário", details: err });
  }
};

export const getUsuarioById = async (req, res) => {
  const { idUsuario } = req.params;

  const query = `
        SELECT 
            u.*,
            p."nome" AS "nome_pessoa"
        FROM 
            "SuperShop"."Usuario" u
        JOIN 
            "SuperShop"."Pessoa" p
        ON 
            u."Pessoa_idPessoa" = p."idPessoa"
        WHERE 
            u."idUsuario" = $1
    `;

  try {
    const result = await db.query(query, [idUsuario]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "usuário não encontrado" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao buscar usuário por ID:", err);
    return res
      .status(500)
      .json({ error: "Erro ao buscar usuário por ID", details: err });
  }
};
