// backend/controllers/despesa.js
import { db } from "../db.js";

// Obtém todas as despesas
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

// Obtém uma despesa específica pelo ID com o nome do tipo de despesa
export const getDespesaById = async (req, res) => {
  const idDespesa = req.params.idDespesa;
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
    WHERE 
      d."idDespesa" = $1
  `;

  db.query(q, [idDespesa], (err, data) => {
    if (err) {
      console.error("Erro ao buscar despesa:", err);
      return res.status(500).json({ error: "Erro ao buscar despesa." });
    }
    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Despesa não encontrada." });
    }
    return res.status(200).json(data.rows[0]); // Retorna a despesa específica
  });
};

// Adiciona uma nova despesa
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

  // Validações básicas
  if (!descricao || !Tipo_idTipo || !valor || !dt_despesa) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios estão faltando." });
  }

  const q = `
    INSERT INTO "SuperShop"."Despesa" 
    (
      "descricao", 
      "Tipo_idTipo", 
      "valor", 
      "dt_despesa", 
      "dt_vencimento", 
      "metodo_pgmto", 
      "status"
    )
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const values = [
    descricao,
    Tipo_idTipo,
    valor,
    dt_despesa,
    dt_vencimento,
    metodo_pgmto,
    status || "Ativo",
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error("Erro ao inserir despesa:", err);
      return res.status(500).json({ error: "Erro ao inserir despesa." });
    }
    return res
      .status(201)
      .json({ message: "Despesa criada com sucesso!", despesa: data.rows[0] });
  });
};

// Atualiza uma despesa existente
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
    return res
      .status(200)
      .json({
        message: "Despesa atualizada com sucesso!",
        despesa: data.rows[0],
      });
  });
};

// Deleta uma despesa
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
    return res
      .status(200)
      .json({
        message: "Despesa deletada com sucesso!",
        despesa: data.rows[0],
      });
  });
};
