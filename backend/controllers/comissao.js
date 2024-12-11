   
import { db } from "../db.js";

// Função para centralizar erros
const handleError = (err, res, message = "Erro interno do servidor") => {
  console.error(message, err);
  return res.status(500).json({ error: message });
};

// Obtém todas as comissões
export const getComissoes = (req, res) => {
  const q = `SELECT * FROM "SuperShop"."Comissao"`;
  db.query(q, (err, data) => {
    if (err) return handleError(err, res, "Erro ao buscar comissões.");
    return res.status(200).json(data.rows);
  });
};

// Obtém uma comissão específica pelo ID
export const getComissaoById = (req, res) => {
  const { idComissao } = req.params;
  const q = `SELECT * FROM "SuperShop"."Comissao" WHERE "idComissao" = $1`;

  db.query(q, [idComissao], (err, data) => {
    if (err) return handleError(err, res, "Erro ao buscar comissão.");
    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Comissão não encontrada." });
    }
    return res.status(200).json(data.rows[0]);
  });
};

// Cria uma nova comissão
export const createComissao = (req, res) => {
  const { mes, ano, valor } = req.body;

  if (!mes || !ano || !valor) {
    return res
      .status(400)
      .json({ error: "Os campos mês, ano e valor são obrigatórios." });
  }

  const q = `
    INSERT INTO "SuperShop"."Comissao" ("mes", "ano", "valor")
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [mes, ano, valor];

  db.query(q, values, (err, data) => {
    if (err) return handleError(err, res, "Erro ao criar comissão.");
    return res.status(201).json(data.rows[0]);
  });
};

// Atualiza uma comissão existente
export const updateComissao = (req, res) => {
  const { idComissao } = req.params;
  const { mes, ano, valor } = req.body;

  if (!mes || !ano || !valor) {
    return res
      .status(400)
      .json({ error: "Os campos mês, ano e valor são obrigatórios." });
  }

  const q = `
    UPDATE "SuperShop"."Comissao"
    SET "mes" = $1, "ano" = $2, "valor" = $3
    WHERE "idComissao" = $4
    RETURNING *
  `;
  const values = [mes, ano, valor, idComissao];

  db.query(q, values, (err, data) => {
    if (err) return handleError(err, res, "Erro ao atualizar comissão.");
    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Comissão não encontrada." });
    }
    return res.status(200).json(data.rows[0]);
  });
};

// Deleta uma comissão existente
export const deleteComissao = (req, res) => {
  const { idComissao } = req.params;

  const q = `DELETE FROM "SuperShop"."Comissao" WHERE "idComissao" = $1 RETURNING *`;
  db.query(q, [idComissao], (err, data) => {
    if (err) return handleError(err, res, "Erro ao deletar comissão.");
    if (data.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Comissão não encontrada." });
    }
    return res
      .status(200)
      .json({ message: "Comissão deletada com sucesso!" });
  });
};