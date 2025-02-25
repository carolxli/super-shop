import { db } from "../db.js";

// Função para centralizar erros
const handleError = (err, res, message = "Erro interno do servidor") => {
  console.error(message, err);
  return res.status(500).json({ error: message });
};

// Verifica se um tipo de despesa está sendo utilizado
const despesaInUse = (idTipo) => {
  return new Promise((resolve, reject) => {
    const q = `SELECT * FROM "SuperShop"."Despesa" WHERE "Tipo_idTipo" = $1`;
    db.query(q, [idTipo], (err, data) => {
      if (err) return reject(err);
      if (data.rows.length > 0) {
        return resolve(true);
      }
      return resolve(false);
    });
  });
};

// Obtém todos os tipos de despesa
export const getTiposDespesa = (req, res) => {
  const q = `SELECT * FROM "SuperShop"."TipoDespesa"`;
  db.query(q, (err, data) => {
    if (err) return handleError(err, res, "Erro ao buscar tipos de despesa.");
    return res.status(200).json(data.rows);
  });
};

// Obtém um tipo de despesa específico pelo ID
export const getTipoDespesaById = (req, res) => {
  const { idTipo } = req.params;
  const q = `SELECT * FROM "SuperShop"."TipoDespesa" WHERE "idTipo" = $1`;

  db.query(q, [idTipo], (err, data) => {
    if (err) return handleError(err, res, "Erro ao buscar tipo de despesa.");
    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Tipo de despesa não encontrado." });
    }
    return res.status(200).json(data.rows[0]);
  });
};

// Obtém um tipo de despesa específico pelo nome
export const getTiposDespesaByName = (req, res) => {
  const { nome_tipo } = req.params;
  const q = `SELECT * FROM "SuperShop"."TipoDespesa" WHERE LOWER("nome_tipo") = LOWER($1)`;

  db.query(q, [nome_tipo], (err, data) => {
    if (err) return handleError(err, res, "Erro ao buscar tipo de despesa.");
    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Tipo de despesa não encontrado." });
    }
    return res.status(200).json(data.rows[0]);
  });
};

// Cria um novo tipo de despesa
export const createTipoDespesa = (req, res) => {
  const { nome_tipo, descricao_tipo } = req.body;

  if (!nome_tipo) {
    return res
      .status(400)
      .json({ error: "O nome do tipo de despesa é obrigatório." });
  }

  const checkQuery = `SELECT * FROM "SuperShop"."TipoDespesa" WHERE LOWER("nome_tipo") = LOWER($1)`;
  db.query(checkQuery, [nome_tipo], (err, result) => {
    if (err) return handleError(err, res, "Erro ao verificar duplicidade.");
    if (result.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Já existe um tipo de despesa com este nome." });
    }

    const q = `
      INSERT INTO "SuperShop"."TipoDespesa" ("nome_tipo", "descricao_tipo")
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [nome_tipo, descricao_tipo || null];

    db.query(q, values, (err, data) => {
      if (err) return handleError(err, res, "Erro ao criar tipo de despesa.");
      return res.status(201).json(data.rows[0]);
    });
  });
};

// Atualiza um tipo de despesa
export const updateTipoDespesa = async (req, res) => {
  const { idTipo } = req.params;
  const { nome_tipo, descricao_tipo } = req.body;

  if (!nome_tipo) {
    return res
      .status(400)
      .json({ error: "O nome do tipo de despesa é obrigatório." });
  }

  if (!idTipo) {
    return res
      .status(400)
      .json({ error: "ID do tipo de despesa é obrigatório." });
  }

  try {
    const isUsed = await despesaInUse(idTipo);
    if (isUsed) {
      return res.status(400).json({
        error:
          "Não é possível atualizar este tipo de despesa, pois está associado a uma ou mais despesas.",
      });
    }

    const checkQuery = `
          SELECT * FROM "SuperShop"."TipoDespesa" 
          WHERE LOWER("nome_tipo") = LOWER($1) AND "idTipo" != $2`;

    db.query(checkQuery, [nome_tipo, idTipo], (err, result) => {
      if (err) return handleError(err, res, "Erro ao verificar duplicidade.");
      if (result.rows.length > 0) {
        return res
          .status(400)
          .json({ error: "Já existe um tipo de despesa com este nome." });
      }

      const q = `
            UPDATE "SuperShop"."TipoDespesa"
            SET "nome_tipo" = $1, "descricao_tipo" = $2
            WHERE "idTipo" = $3
            RETURNING *`;
      const values = [nome_tipo, descricao_tipo || null, idTipo];

      db.query(q, values, (err, data) => {
        if (err)
          return handleError(err, res, "Erro ao atualizar tipo de despesa.");
        if (data.rows.length === 0) {
          return res
            .status(404)
            .json({ error: "Tipo de despesa não encontrado." });
        }
        return res.status(200).json(data.rows[0]);
      });
    });
  } catch (err) {
    console.error("Erro ao atualizar tipo de despesa:", err);
    return res
      .status(500)
      .json({ error: "Erro ao atualizar tipo de despesa." });
  }
};

// Deleta um tipo de despesa
export const deleteTipoDespesa = async (req, res) => {
  const { idTipo } = req.params;

  try {
    const isUsed = await despesaInUse(idTipo);
    if (isUsed) {
      return res.status(400).json({
        error:
          "Não é possível deletar este tipo de despesa, pois está associado a uma ou mais despesas.",
      });
    }

    const q = `DELETE FROM "SuperShop"."TipoDespesa" WHERE "idTipo" = $1 RETURNING *`;
    db.query(q, [idTipo], (err, data) => {
      if (err) return handleError(err, res, "Erro ao deletar tipo de despesa.");
      if (data.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Tipo de despesa não encontrado." });
      }
      return res
        .status(200)
        .json({ message: "Tipo de despesa deletado com sucesso!" });
    });
  } catch (err) {
    console.error("Erro ao deletar tipo de despesa:", err);
    return res.status(500).json({ error: "Erro ao deletar tipo de despesa." });
  }
};
