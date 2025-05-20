import { db } from "../db.js";
export const postDevolucao = async (req, res) => {
  try {
    const { clienteId, pessoaId, vendaId, produtos, motivo, usuarioNome } = req.body;

    if (!motivo || !motivo.trim()) {
      return res.status(400).json({ error: "Motivo da devolução é obrigatório." });
    }

    if (!usuarioNome || !usuarioNome.trim()) {
      return res.status(400).json({ error: "Nome do vendedor é obrigatório." });
    }

    let totalDevolucao = 0;

    for (const item of produtos) {
      const { produtoId, quantidade, valorUnitario } = item;

      const devolvidoRes = await db.query(
        `SELECT COALESCE(SUM(quantidade), 0) AS devolvido
         FROM "SuperShop"."Devolucao"
         WHERE "Itens_Vendas_Venda_idVenda" = $1 AND "Itens_Vendas_Produto_idProduto" = $2`,
        [vendaId, produtoId]
      );
      const totalJaDevolvido = parseInt(devolvidoRes.rows[0].devolvido);

      const vendidoRes = await db.query(
        `SELECT qtde, valor_vendido FROM "SuperShop"."Itens_Vendas"
         WHERE "Venda_idVenda" = $1 AND "Produto_idProduto" = $2`,
        [vendaId, produtoId]
      );

      const quantidadeVendida = vendidoRes.rows[0]?.qtde || 0;
      const valorVendido = parseFloat(vendidoRes.rows[0]?.valor_vendido || 0);
      const valorVoucher = quantidade * valorVendido;

      if ((quantidade + totalJaDevolvido) > quantidadeVendida) {
        return res.status(400).json({
          error: `Não é possível devolver mais do que a quantidade vendida para o produto ${produtoId}`
        });
      }

      const insertQuery = `INSERT INTO "SuperShop"."Devolucao" (
        dt_devolucao,
        motivo,
        "Itens_Vendas_Venda_idVenda",
        "Itens_Vendas_Produto_idProduto",
        "Cliente_idCliente",
        "Cliente_Pessoa_idPessoa",
        quantidade,
        valor_voucher,
        vendedor_nome
      ) VALUES (CURRENT_DATE, $1, $2, $3, $4, $5, $6, $7, $8)`;

      await db.query(insertQuery, [
        motivo,
        vendaId,
        produtoId,
        clienteId,
        pessoaId,
        quantidade,
        valorVoucher,
        usuarioNome
      ]);

      const updateEstoque = `UPDATE "SuperShop"."Produto" SET "estoque_atual" = "estoque_atual" + $1 WHERE "idProduto" = $2`;
      await db.query(updateEstoque, [quantidade, produtoId]);

      totalDevolucao += valorVoucher;
    }

    const updateVoucher = `UPDATE "SuperShop"."Cliente" SET voucher = COALESCE(voucher, 0) + $1 WHERE "idCliente" = $2`;
    await db.query(updateVoucher, [totalDevolucao, clienteId]);

    return res.status(200).json({ message: "Devolução registrada com sucesso." });
  } catch (err) {
    console.error("Erro ao registrar devolução:", err.message || err);
    return res.status(500).json({ error: err.detail || err.message || "Erro interno ao registrar devolução." });
  }
};

export const getDevolucoesByCliente = (req, res) => {
  const { idCliente } = req.params;
  const q = `
    SELECT 
      "idDevolucao",
      dt_devolucao,
      motivo,
      "Itens_Vendas_Venda_idVenda" AS "Itens_Vendas_Venda_idVenda",
      "Itens_Vendas_Produto_idProduto" AS "Itens_Vendas_Produto_idProduto",
      "Cliente_idCliente",
      "Cliente_Pessoa_idPessoa",
      quantidade,
      valor_voucher,
      vendedor_nome
    FROM "SuperShop"."Devolucao"
    WHERE "Cliente_idCliente" = $1
  `;

  db.query(q, [idCliente], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.rows);
  });
};

export const deleteDevolucao = async (req, res) => {
  const { id } = req.params;
  try {
    const devolucaoRes = await db.query(
      `SELECT * FROM "SuperShop"."Devolucao" WHERE "idDevolucao" = $1`,
      [id]
    );
    const devolucao = devolucaoRes.rows[0];
    if (!devolucao) return res.status(404).json({ error: "Devolução não encontrada." });

    await db.query(
      `UPDATE "SuperShop"."Produto" SET "estoque_atual" = "estoque_atual" - $1 WHERE "idProduto" = $2`,
      [devolucao.quantidade, devolucao.Itens_Vendas_Produto_idProduto]
    );

    await db.query(
      `UPDATE "SuperShop"."Cliente" SET voucher = COALESCE(voucher, 0) - $1 WHERE "idCliente" = $2`,
      [devolucao.valor_voucher, devolucao.Cliente_idCliente]
    );

    await db.query(`DELETE FROM "SuperShop"."Devolucao" WHERE "idDevolucao" = $1`, [id]);

    return res.status(200).json({ message: "Devolução excluída com sucesso." });
  } catch (err) {
    console.error("Erro ao excluir devolução:", err.message || err);
    return res.status(500).json({ error: err.detail || err.message || "Erro interno." });
  }
};

export const getDevolucoesPorCliente = async (req, res) => {
  const { idCliente } = req.params;
  try {
    const result = await db.query(`
      SELECT * FROM "SuperShop"."Devolucao"
      WHERE "Cliente_idCliente" = $1
      ORDER BY dt_devolucao DESC
    `, [idCliente]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar devoluções por cliente." });
  }
};

export const getDevolucoesPorPeriodo = async (req, res) => {
  const { inicio, fim } = req.query;

  try {
    if (!inicio || !fim) {
      return res.status(400).json({ error: "Datas de início e fim são obrigatórias." });
    }

    console.log("🔎 Período direto do frontend:", inicio, fim); // Verifique se as datas estão chegando corretamente

    const result = await db.query(`
      SELECT * FROM "SuperShop"."Devolucao"
      WHERE dt_devolucao BETWEEN $1 AND $2
      ORDER BY dt_devolucao DESC
    `, [inicio, fim]);

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Erro ao buscar devoluções por período:", err); // Log do erro para verificar o que está acontecendo
    return res.status(500).json({
      error: err.message,
      stack: err.stack // Exibe o stack do erro para ajudar no diagnóstico
    });
  }
};


export const getDevolucoesPorProduto = async (req, res) => {
  const { idProduto } = req.params;
  try {
    const result = await db.query(`
      SELECT * FROM "SuperShop"."Devolucao"
      WHERE "Itens_Vendas_Produto_idProduto" = $1
      ORDER BY dt_devolucao DESC
    `, [idProduto]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar devoluções por produto." });
  }
};

export const getDetalheDevolucao = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT d.*, p.descricao AS produto_nome, v.data AS data_venda, ps.nome AS cliente_nome
      FROM "SuperShop"."Devolucao" d
      JOIN "SuperShop"."Produto" p ON d."Itens_Vendas_Produto_idProduto" = p."idProduto"
      JOIN "SuperShop"."Venda" v ON d."Itens_Vendas_Venda_idVenda" = v."idVenda"
      JOIN "SuperShop"."Cliente" c ON d."Cliente_idCliente" = c."idCliente"
      JOIN "SuperShop"."Pessoa" ps ON c."Pessoa_idPessoa" = ps."idPessoa"
      WHERE d."idDevolucao" = $1
    `, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Devolução não encontrada." });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar detalhes da devolução." });
  }
};