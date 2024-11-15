// backend/controllers/tipoDespesa.js
import { db } from "../db.js";

// Obtém todos os tipos de despesa
export const getTiposDespesa = (req, res) => {
  const q = `SELECT * FROM "SuperShop"."TipoDespesa"`;
  db.query(q, (err, data) => {
    if (err) {
      console.error("Erro ao buscar tipos de despesa:", err);
      return res.status(500).json({ error: "Erro ao buscar tipos de despesa" });
    }
    return res.status(200).json(data.rows);
  });
};

// Obtém um tipo de despesa específico pelo ID
export const getTipoDespesaById = (req, res) => {
  const idTipo = req.params.idTipo;
  const q = `SELECT * FROM "SuperShop"."TipoDespesa" WHERE "idTipo" = $1`;

  db.query(q, [idTipo], (err, data) => {
    if (err) {
      console.error("Erro ao buscar tipo de despesa:", err);
      return res.status(500).json({ error: "Erro ao buscar tipo de despesa" });
    }
    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Tipo de despesa não encontrado" });
    }
    return res.status(200).json(data.rows[0]);
  });
};

// Adiciona um novo tipo de despesa
export const createTipoDespesa = (req, res) => {
  const q = `
    INSERT INTO "SuperShop"."TipoDespesa" (
      "nome_tipo",
      "descricao_tipo"
    ) VALUES ($1, $2)
    RETURNING *
  `;

  const values = [req.body.nome_tipo, req.body.descricao_tipo];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error("Erro ao criar tipo de despesa:", err);
      return res.status(500).json({ error: "Erro ao criar tipo de despesa" });
    }
    return res.status(201).json(data.rows[0]);
  });
};

// Atualiza um tipo de despesa existente
export const updateTipoDespesa = (req, res) => {
  const idTipo = req.params.idTipo;
  const q = `
    UPDATE "SuperShop"."TipoDespesa" SET
      "nome_tipo" = $1,
      "descricao_tipo" = $2
    WHERE "idTipo" = $3
    RETURNING *
  `;

  const values = [req.body.nome_tipo, req.body.descricao_tipo, idTipo];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error("Erro ao atualizar tipo de despesa:", err);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar tipo de despesa" });
    }
    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Tipo de despesa não encontrado" });
    }
    return res.status(200).json(data.rows[0]);
  });
};

// Deleta um tipo de despesa
export const deleteTipoDespesa = (req, res) => {
  const idTipo = req.params.idTipo;
  const q = `
    DELETE FROM "SuperShop"."TipoDespesa"
    WHERE "idTipo" = $1
    RETURNING *
  `;

  db.query(q, [idTipo], (err, data) => {
    if (err) {
      console.error("Erro ao deletar tipo de despesa:", err);
      return res.status(500).json({ error: "Erro ao deletar tipo de despesa" });
    }
    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Tipo de despesa não encontrado" });
    }
    return res
      .status(200)
      .json({
        message: "Tipo de despesa deletado com sucesso",
        tipoDespesa: data.rows[0],
      });
  });
};
