import { db } from "../db.js";

// Obtém todas as despesas
export const getDespesa = async (_, res) => {
  const q = `SELECT * FROM "SuperShop"."Despesa"`;
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
  const q = `SELECT * FROM "SuperShop"."Despesa" WHERE "idDespesa" = $1`;

  db.query(q, [idDespesa], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data.rows[0]); // Retorna apenas a despesa específica
  });
};

// Adiciona uma nova despesa
export const postDespesa = (req, res) => {
  const q = `INSERT INTO "SuperShop"."Despesa" (
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
  const q = `UPDATE "SuperShop"."Despesa" SET
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
  const idDespesa = req.params.idDespesa;

  // Iniciar uma transação
  db.query("BEGIN", (err) => {
    if (err) {
      console.error("Erro ao iniciar transação:", err);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }

    // 1. Deletar todas as referências em Contas_a_Pagar
    const deleteContasAPagarQuery = `
      DELETE FROM "SuperShop"."Contas_a_Pagar"
      WHERE "Despesa_idDespesa" = $1
    `;
    db.query(deleteContasAPagarQuery, [idDespesa], (err) => {
      if (err) {
        console.error("Erro ao deletar Contas_a_Pagar:", err);
        return db.query("ROLLBACK", () => {
          res.status(500).json({ error: "Erro ao deletar contas a pagar" });
        });
      }

      // 2. Deletar a Despesa
      const deleteDespesaQuery = `
        DELETE FROM "SuperShop"."Despesa"
        WHERE "idDespesa" = $1
        RETURNING *
      `;
      db.query(deleteDespesaQuery, [idDespesa], (err, result) => {
        if (err) {
          console.error("Erro ao deletar Despesa:", err);
          return db.query("ROLLBACK", () => {
            res.status(500).json({ error: "Erro ao deletar despesa" });
          });
        }

        if (result.rows.length === 0) {
          // Se nenhuma despesa foi encontrada para deletar, reverter a transação
          return db.query("ROLLBACK", () => {
            res.status(404).json({ error: "Despesa não encontrada" });
          });
        }

        // 3. Confirmar a transação
        db.query("COMMIT", (err) => {
          if (err) {
            console.error("Erro ao confirmar transação:", err);
            return db.query("ROLLBACK", () => {
              res.status(500).json({ error: "Erro interno do servidor" });
            });
          }

          res
            .status(200)
            .json({
              message: "Despesa deletada com sucesso",
              despesa: result.rows[0],
            });
        });
      });
    });
  });
};
