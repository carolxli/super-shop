// controllers/reserva.js
import { db } from "../db.js";

// Criar uma nova reserva
export const postReserva = async (req, res) => {
  try {
    const {
      clienteId,
      pessoaId,
      produtoId,
      dataReserva,
      dataExpiracao,
      quantidade,
      usuarioNome,
      motivo
    } = req.body;

    if (!dataReserva || !dataExpiracao || !usuarioNome || !quantidade || !motivo) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const estoqueRes = await db.query(
      `SELECT estoque_atual, status FROM "SuperShop"."Produto" WHERE "idProduto" = $1`,
      [produtoId]
    );

    if (estoqueRes.rowCount === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    const { estoque_atual: estoqueAtual, status } = estoqueRes.rows[0];

    if (quantidade > estoqueAtual) {
      return res.status(400).json({ error: "Estoque insuficiente para reserva." });
    }

    await db.query(
      `INSERT INTO "SuperShop"."Reserva" (
        data_reserva, data_expiracao,
        "Cliente_idCliente", "Cliente_Pessoa_idPessoa",
        "Produto_idProduto", quantidade, usuario_nome, motivo, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'ativa')`,
      [dataReserva, dataExpiracao, clienteId, pessoaId, produtoId, quantidade, usuarioNome, motivo]
    );

    await db.query(
      `UPDATE "SuperShop"."Produto" SET estoque_atual = estoque_atual - $1 WHERE "idProduto" = $2`,
      [quantidade, produtoId]
    );

    const novoEstoqueRes = await db.query(
      `SELECT estoque_atual FROM "SuperShop"."Produto" WHERE "idProduto" = $1`,
      [produtoId]
    );

    if (novoEstoqueRes.rows[0].estoque_atual === 0) {
      await db.query(
        `UPDATE "SuperShop"."Produto" SET status = 'indisponivel' WHERE "idProduto" = $1`,
        [produtoId]
      );
    }

    res.status(200).json({ message: "Reserva criada com sucesso." });
  } catch (err) {
    console.error("Erro ao criar reserva:", err);
    res.status(500).json({ error: "Erro interno ao criar reserva." });
  }
};

// Listar reservas
export const getReservas = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT r.*, p.descricao as produto_nome, c.nome as cliente_nome
      FROM "SuperShop"."Reserva" r
      JOIN "SuperShop"."Produto" p ON r."Produto_idProduto" = p."idProduto"
      JOIN "SuperShop"."Pessoa" c ON r."Cliente_Pessoa_idPessoa" = c."idPessoa"
      ORDER BY r."data_reserva" DESC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar reservas:", err);
    res.status(500).json({ error: "Erro ao buscar reservas." });
  }
};

// Excluir reserva
export const deleteReserva = async (req, res) => {
    const id = req.params.id;
  
    try {
      const { rows } = await db.query(
        'SELECT * FROM "SuperShop"."Reserva" WHERE "idReserva" = $1',
        [id]
      );
  
      const reserva = rows[0];
      if (!reserva) return res.status(404).json({ error: "Reserva não encontrada." });
  
      if (reserva.status === "ativa") {
        // Devolve ao estoque se for ativa
        await db.query(
          'UPDATE "SuperShop"."Produto" SET estoque_atual = estoque_atual + $1 WHERE "idProduto" = $2',
          [reserva.quantidade, reserva.Produto_idProduto]
        );
      }
  
      await db.query(
        'DELETE FROM "SuperShop"."Reserva" WHERE "idReserva" = $1',
        [id]
      );
  
      res.status(200).json({ message: "Reserva excluída com sucesso." });
    } catch (err) {
      console.error("Erro ao excluir reserva:", err);
      res.status(500).json({ error: "Erro ao excluir reserva." });
    }
  };
  
// Concluir reserva
export const concluirReserva = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await db.query(
      `SELECT quantidade, "Produto_idProduto" FROM "SuperShop"."Reserva" WHERE "idReserva" = $1`,
      [id]
    );

    if (reserva.rowCount === 0) {
      return res.status(404).json({ error: "Reserva não encontrada." });
    }

    const { quantidade, Produto_idProduto } = reserva.rows[0];

    await db.query(
      `UPDATE "SuperShop"."Produto" SET estoque_atual = estoque_atual + $1 WHERE "idProduto" = $2`,
      [quantidade, Produto_idProduto]
    );

    await db.query(
      `UPDATE "SuperShop"."Produto" SET status = 'disponivel' WHERE "idProduto" = $1 AND estoque_atual > 0`,
      [Produto_idProduto]
    );

    await db.query(
      `UPDATE "SuperShop"."Reserva" SET status = 'concluida' WHERE "idReserva" = $1`,
      [id]
    );

    res.status(200).json({ message: "Reserva concluída com sucesso." });
  } catch (err) {
    console.error("Erro ao concluir reserva:", err);
    res.status(500).json({ error: "Erro ao concluir reserva." });
  }
};

// Cancelar reserva
export const cancelarReserva = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await db.query(
      `SELECT quantidade, "Produto_idProduto" FROM "SuperShop"."Reserva" WHERE "idReserva" = $1`,
      [id]
    );

    if (reserva.rowCount === 0) {
      return res.status(404).json({ error: "Reserva não encontrada." });
    }

    const { quantidade, Produto_idProduto } = reserva.rows[0];

    await db.query(
      `UPDATE "SuperShop"."Produto" SET estoque_atual = estoque_atual + $1 WHERE "idProduto" = $2`,
      [quantidade, Produto_idProduto]
    );

    await db.query(
      `UPDATE "SuperShop"."Produto" SET status = 'disponivel' WHERE "idProduto" = $1 AND estoque_atual > 0`,
      [Produto_idProduto]
    );

    await db.query(
      `UPDATE "SuperShop"."Reserva" SET status = 'cancelada' WHERE "idReserva" = $1`,
      [id]
    );

    res.status(200).json({ message: "Reserva cancelada com sucesso." });
  } catch (err) {
    console.error("Erro ao cancelar reserva:", err);
    res.status(500).json({ error: "Erro ao cancelar reserva." });
  }
};
