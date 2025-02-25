import { db } from "../db.js";

// Função para centralizar erros
const handleError = (err, res, message = "Erro interno do servidor") => {
  console.error(message, err);
  return res.status(500).json({ error: message });
};

// Validação dos campos obrigatórios
const validate = (body) => {
  const { mes, ano, valor, descricao } = body;
  if (!mes || !ano || !valor || !descricao) {
    return false;
  }

  return true;
};

// Obtém todas as comissões
export const getComissoes = (req, res) => {
  const q = `SELECT * FROM "SuperShop"."Comissao"`;

  db.query(q, (err, data) => {
    if (err) return handleError(err, res, "Erro ao buscar comissões.");
    return res.status(200).json(data.rows);
  });
};

// Obtém todas as comissões de um mês e ano específicos
export const getComissaoByDate = (req, res) => {
  const { mes, ano } = req.params;
  const q = `SELECT * FROM "SuperShop"."Comissao" WHERE "mes" = $1 AND "ano" = $2`;

  db.query(q, [mes, ano], (err, data) => {
    if (err) return handleError(err, res, "Erro ao buscar comissões.");
    return res.status(200).json(data.rows);
  });
};

// Obtém uma comissão específica pela descrição
export const getComissaoByDescription = (req, res) => {
  const { descricao } = req.body;
  const q = `SELECT * FROM "SuperShop"."Comissao" WHERE LOWER("descricao") = LOWER($1)`;

  db.query(q, [descricao], (err, data) => {
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
export const createComissao = async (req, res) => {
  const { mes, ano, valor, descricao } = req.body;

  if (!validate(req.body)) {
    return res.status(400).json({
      error: "Os campos mês, ano, valor e descrição são obrigatórios.",
    });
  }

  try {
    // Verifica se já existe uma comissão com a mesma descricao
    const checkQuery = `
      SELECT * FROM "SuperShop"."Comissao" 
      WHERE "descricao" = $1
    `;
    const checkResult = await db.query(checkQuery, [descricao]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({
        error: "Já existe uma comissão cadastrada com a mesma descricao.",
      });
    }

    // Insere a nova comissão
    const insertQuery = `
      INSERT INTO "SuperShop"."Comissao" ("mes", "ano", "valor", "descricao")
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [mes, ano, valor, descricao];

    const insertResult = await db.query(insertQuery, values);

    return res.status(201).json(insertResult.rows[0]);
  } catch (err) {
    console.error("Erro ao criar comissão:", err);
    return res.status(500).json({ error: "Erro ao criar comissão." });
  }
};

// Atualiza uma comissão existente
export const updateComissao = (req, res) => {
  const { idComissao } = req.params;
  const { mes, ano, valor, descricao } = req.body;

  if (!validate(req.body)) {
    return res.status(400).json({
      error: "Os campos mês, ano, valor e descrição são obrigatórios.",
    });
  }

  const q = `
    UPDATE "SuperShop"."Comissao"
    SET "mes" = $1, "ano" = $2, "valor" = $3, "descricao" = $4
    WHERE "idComissao" = $5
    RETURNING *
  `;

  const values = [mes, ano, valor, descricao, idComissao];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error("Erro ao atualizar comissão:", err);
      return res.status(500).json({ error: "Erro ao atualizar comissão." });
    }
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
      return res.status(404).json({ error: "Comissão não encontrada." });
    }
    return res.status(200).json({ message: "Comissão deletada com sucesso!" });
  });
};
