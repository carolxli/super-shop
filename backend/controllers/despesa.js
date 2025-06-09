import { db } from "../db.js";

// Validação de campos obrigatórios
const validate = (body) => {
  if (
    !body.descricao ||
    !body.Tipo_idTipo ||
    !body.valor ||
    !body.dt_despesa ||
    !body.metodo_pgmto ||
    !body.status
  ) {
    return false;
  }

  return true;
};

// Validação de campos obrigatórios para atualização
const validateUpdate = (body) => {
  if (!body.descricao || !body.Tipo_idTipo || !body.valor || !body.dt_despesa) {
    return false;
  }

  return true;
};

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

// Obtém uma despesa específica pelo ID
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
      "status",
      "valor_pgmto"
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

// Obtém todas as despesas de um determinado status
export const getDespesaByStatus = (req, res) => {
  const status = req.params.status;

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
      d."status" = $1
  `;

  db.query(q, [status], (err, data) => {
    if (err) {
      console.error("Erro ao buscar despesas:", err);
      return res.status(500).json({ error: "Erro ao buscar despesas." });
    }

    return res.status(200).json(data.rows);
  });
};

// Cria uma nova despesa
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

  if (!validate(req.body)) {
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
    ("descricao", "Tipo_idTipo", "valor", "dt_despesa", "dt_vencimento", "metodo_pgmto", "status", "valor_pgmto")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const values = [
    descricao,
    Tipo_idTipo,
    parseFloat(valor),
    dt_despesa,
    dt_vencimento || null,
    metodo_pgmto,
    status,
    0.0, // valor_pgmto inicial é 0
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

  if (!validateUpdate(req.body)) {
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

// Quita uma despesa existente
export const updateQuitarDespesa = (req, res) => {
  const { idDespesa } = req.params;
  const { valor, data_pagamento } = req.body;

  if (!data_pagamento) {
    return res.status(400).json({ error: "Data de pagamento é obrigatória." });
  }

  // Buscar dados atuais da despesa
  const query = `
    SELECT "valor", "metodo_pgmto", "valor_pgmto"
    FROM "SuperShop"."Despesa"
    WHERE "idDespesa" = $1  
  `;

  db.query(query, [idDespesa], (err, data) => {
    if (err) {
      console.error("Erro ao obter dados da despesa:", err);
      return res.status(500).json({ error: "Erro ao obter dados da despesa" });
    }

    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Despesa não encontrada." });
    }

    const despesaValor = parseFloat(data.rows[0].valor);
    const despesaMetodo = data.rows[0].metodo_pgmto;
    const valorPgmtoAtual = parseFloat(data.rows[0].valor_pgmto) || 0;

    let valorPagamento;
    let novoValorPgmto;
    let novoStatus;

    // Se valor for "valor_total", quitar completamente
    if (valor === "valor_total") {
      valorPagamento = despesaValor;
      novoValorPgmto = despesaValor;
      novoStatus = "Pago";
    } else {
      valorPagamento = parseFloat(valor);

      if (isNaN(valorPagamento) || valorPagamento <= 0) {
        return res.status(400).json({ error: "Valor de pagamento inválido." });
      }

      // Somar ao valor já pago
      novoValorPgmto = valorPgmtoAtual + valorPagamento;

      if (novoValorPgmto > despesaValor) {
        return res.status(400).json({
          error: "O valor total pago excede o valor da despesa.",
        });
      }

      // Determinar status baseado no valor pago
      if (novoValorPgmto >= despesaValor) {
        novoStatus = "Pago";
      } else if (novoValorPgmto > 0) {
        novoStatus = "Parcialmente Pago";
      } else {
        novoStatus = "Pendente";
      }
    }

    updateDespesaValor(
      idDespesa,
      novoValorPgmto,
      data_pagamento,
      despesaMetodo,
      novoStatus,
      res
    );
  });
};

const updateDespesaValor = (
  idDespesa,
  novoValorPgmto,
  data_pagamento,
  metodo_pgmto,
  novoStatus,
  res
) => {
  const q = `
    UPDATE "SuperShop"."Despesa"
    SET "valor_pgmto" = $1::DECIMAL(10,2),
        "status" = $2,
        "data_pagamento" = $3,
        "metodo_pgmto" = $4
    WHERE "idDespesa" = $5
    RETURNING *
  `;

  const values = [
    parseFloat(novoValorPgmto).toFixed(2),
    novoStatus,
    data_pagamento,
    metodo_pgmto,
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
      message: "Despesa quitada com sucesso!",
      despesa: data.rows[0],
    });
  });
};

// Deleta uma despesa existente
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
