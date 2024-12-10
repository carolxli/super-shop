import { db } from "../db.js";

export const getDespesa = async (_, res) => {
  const q = `
    SELECT 
      d.*, 
      td.nome_tipo 
    FROM 
      "SuperShop"."Despesa" d
    LEFT JOIN 
      "SuperShop"."TipoDespesa" td 
    ON 
      d."Tipo_idTipo" = td."idTipo"
  `;
  db.query(q, (err, data) => {
    if (err) {
      console.error("Erro ao buscar despesas:", err);
      return res.status(500).json({ error: "Erro ao buscar despesas." });
    }

    return res.status(200).json(data.rows);
  });
};

export const getDespesaById = async (req, res) => {
  const idDespesa = req.params.idDespesa;
  const q = `
    SELECT 
      "idDespesa", 
      "descricao", 
      "Tipo_idTipo", 
      "valor", 
      "dt_despesa", 
      "dt_vencimento", 
      "metodo_pgmto", 
      "status"
    FROM 
      "SuperShop"."Despesa"
    WHERE 
      "idDespesa" = $1
  `;

  db.query(q, [idDespesa], (err, data) => {
    if (err) {
      console.error("Erro ao buscar despesa:", err);
      return res.status(500).json({ error: "Erro ao buscar despesa." });
    }
    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Despesa não encontrada." });
    }
    return res.status(200).json(data.rows[0]);
  });
};

export const postDespesa = (req, res) => {
  const {
    descricao,
    Tipo_idTipo,
    valor,
    dt_despesa,
    dt_vencimento,
    metodo_pgmto,
    status,
  } = req.body;

  console.log("Dados recebidos no backend:", req.body); 

  if (
    !descricao ||
    !Tipo_idTipo ||
    !valor ||
    !dt_despesa ||
    !metodo_pgmto ||
    !status
  ) {
    console.error("Erro: Campos obrigatórios faltando.");
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  if (isNaN(Tipo_idTipo) || isNaN(valor)) {
    console.error("Erro: Tipo_idTipo e valor devem ser números.");
    return res
      .status(400)
      .json({ error: "Tipo_idTipo e valor devem ser números." });
  }

  const q = `
    INSERT INTO "SuperShop"."Despesa" 
    ("descricao", "Tipo_idTipo", "valor", "dt_despesa", "dt_vencimento", "metodo_pgmto", "status")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const values = [
    descricao,
    Tipo_idTipo,
    parseFloat(valor), 
    dt_despesa,
    dt_vencimento || null, 
    status,
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error("Erro ao inserir despesa:", err); 
      if (err.code === "23503") {
        return res.status(400).json({
          error: "Tipo_idTipo não encontrado. Verifique se o ID é válido.",
        });
      }
      return res.status(500).json({ error: "Erro ao inserir despesa." });
    }

    console.log("Despesa criada com sucesso:", data.rows[0]);
    return res.status(201).json(data.rows[0]);
  });
};

export const updateDespesa = (req, res) => {
  const { idDespesa } = req.params;
  const {
    descricao,
    Tipo_idTipo,
    valor,
    dt_despesa,
    dt_vencimento,
    metodo_pgmto,
    status,
  } = req.body;

  if (!descricao || !Tipo_idTipo || !valor || !dt_despesa) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios estão faltando." });
  }

  const q = `
  UPDATE "SuperShop"."Despesa"
  SET 
    "descricao" = $1, 
    "Tipo_idTipo" = $2, 
    "valor" = $3, 
    "dt_despesa" = $4,
    "dt_vencimento" = $5,
    "metodo_pgmto" = $6,
    "status" = $7
  WHERE 
    "idDespesa" = $8
  RETURNING *
`;
  const values = [
    descricao, 
    Tipo_idTipo, 
    valor,
    dt_despesa,
    dt_vencimento,
    metodo_pgmto,
    status,
    idDespesa,
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error("Erro ao atualizar despesa:", err);
      return res.status(500).json({ error: "Erro ao atualizar despesa." });
    }
    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Despesa não encontrada." });
    }
    return res.status(200).json({
      message: "Despesa atualizada com sucesso!",
      despesa: data.rows[0],
    });
  });
};

export const deleteDespesa = (req, res) => {
  const idDespesa = req.params.idDespesa;

  const q = `
    DELETE FROM "SuperShop"."Despesa"
    WHERE "idDespesa" = $1
    RETURNING *
  `;

  db.query(q, [idDespesa], (err, data) => {
    if (err) {
      console.error("Erro ao deletar despesa:", err);
      return res.status(500).json({ error: "Erro ao deletar despesa." });
    }
    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Despesa não encontrada." });
    }
    return res.status(200).json({
      message: "Despesa deletada com sucesso!",
      despesa: data.rows[0],
    });
  });
};
