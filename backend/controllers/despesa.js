import { db } from "../db.js";

// Obtém todas as despesas
export const getDespesa = async (_, res) => {
  const q = `SELECT * FROM "Despesa"`;
  db.query(q, (err, data) => {
    if (err) {
      console.error("Erro ao buscar despesas:", err);
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
};

// Obtém uma despesa específica pelo ID
export const getDespesaById = async (req, res) => {
  const idDespesa = req.params.idDespesa;
  const q = `SELECT * FROM "Despesa" WHERE "idDespesa" = $1`;

  db.query(q, [idDespesa], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data.rows[0]); // Retorna apenas a despesa específica
  });
};

// Adiciona uma nova despesa
export const postDespesa = (req, res) => {
  const q = `INSERT INTO "Despesa" (
    "dt_despesa",
    "dt_vencimento",
    "valor",
    "metodo_pgmto",
    "descricao",
    "status",
    "idTipo"
  ) VALUES($1, $2, $3, $4, $5, $6, $7)`;

  const values = [
    req.body.dt_despesa,
    req.body.dt_vencimento,
    req.body.valor,
    req.body.metodo_pgmto,
    req.body.descricao,
    req.body.status,
    req.body.idTipo,
  ];

  db.query(q, values, (insertErr) => {
    if (insertErr) {
      console.error("Erro ao inserir despesa:", insertErr);
      return res.status(500).json("Erro ao inserir despesa");
    }

    return res.status(200).json("Despesa inserida com sucesso");
  });
};

// Atualiza uma despesa existente
export const updateDespesa = (req, res) => {
  const q = `UPDATE "Despesa" SET
    "dt_despesa" = $1,
    "dt_vencimento" = $2,
    "valor" = $3,
    "metodo_pgmto" = $4,
    "descricao" = $5,
    "status" = $6,
    "idTipo" = $7
  WHERE "idDespesa" = $8`;

  const values = [
    req.body.dt_despesa,
    req.body.dt_vencimento,
    req.body.valor,
    req.body.metodo_pgmto,
    req.body.descricao,
    req.body.status,
    req.body.idTipo,
    req.params.idDespesa,
  ];

  db.query(q, values, (err) => {
    if (err) {
      console.error("Erro ao atualizar despesa:", err);
      return res.status(500).json(err);
    }
    return res.status(200).json("Despesa atualizada com sucesso");
  });
};

// Deleta uma despesa
export const deleteDespesa = (req, res) => {
  const q = `DELETE FROM "Despesa" WHERE "idDespesa" = $1`;

  db.query(q, [req.params.idDespesa], (err) => {
    if (err) {
      console.error("Erro ao deletar despesa:", err);
      return res.status(500).json(err);
    }
    return res.status(200).json("Despesa deletada com sucesso");
  });
};
