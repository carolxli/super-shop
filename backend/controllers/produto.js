import {db} from "../db.js";

export const getProdutos = async (_, res) => {
    const q = `SELECT * FROM "SuperShop"."Produto"`;
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
}

export const postProdutos = (req, res) => {
    console.log("Dados recebidos:", req.body); // Adicione este log
    const q = `INSERT INTO "SuperShop"."Produto" (
        "sku",
        "descricao",
        "valor_custo",
        "valor_venda",
        "estoque_min",
        "estoque_atual",
        "status",
        "Fornecedor_idFornecedor",
        "Fornecedor_Pessoa_idPessoa",
        "Marca_idMarca",
        "Categoria_idCategoria"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;

    const values = [
        req.body.sku,
        req.body.descricao,
        req.body.valor_custo,
        req.body.valor_venda,
        req.body.estoque_min,
        req.body.estoque_atual,
        req.body.status,
        req.body.Fornecedor_idFornecedor,
        req.body.Fornecedor_Pessoa_idPessoa,
        req.body.Marca_idMarca,
        req.body.Categoria_idCategoria,
    ];

    db.query(q, values, (insertErr) => {
        if (insertErr) {
            console.error("Erro ao inserir Produto", insertErr);
            return res.status(500).json("Erro ao inserir produto");
        }

        return res.status(200).json("Produto inserido com sucesso");
    });
};

export const updateProdutos = (req, res) => {
    const q = `UPDATE "SuperShop"."Produto" SET 
        "sku" = $1,
        "descricao" = $2,
        "valor_custo" = $3,
        "valor_venda" = $4,
        "estoque_min" = $5,
        "estoque_atual" = $6,
        "status" = $7,
        "Fornecedor_idFornecedor" = $8,
        "Fornecedor_Pessoa_idPessoa" = $9,
        "Marca_idMarca" = $10,
        "Categoria_idCategoria" = $11
    WHERE "idProduto" = $12`;

    const values = [
        req.body.sku,
        req.body.descricao,
        req.body.valor_custo,
        req.body.valor_venda,
        req.body.estoque_min,
        req.body.estoque_atual,
        req.body.status,
        req.body.Fornecedor_idFornecedor,
        req.body.Fornecedor_Pessoa_idPessoa,
        req.body.Marca_idMarca,
        req.body.Categoria_idCategoria,
    ];

    db.query(q,[...values, req.params.idProduto], (err) => {
        if (err) {
            return res.json(err);
        }
        return res.status(200).json("Produto atualizado com sucesso");
    });
};

export const deleteProdutos = (req, res) => {
    const q = `DELETE FROM "SuperShop"."Produto" WHERE \"idProduto\" = $1`;

    db.query(q, [req.params.idProduto], (err) => {
        if (err) {
            return res.json(err);
        }
        return res.status(200).json("Produto deletado com sucesso");
    });
};

export const getProduto = (req, res) => {
    const { idProduto } = req.params;
    const query = 'SELECT * FROM "SuperShop"."Produto" WHERE "idProduto" = $1';

    db.query(query, [idProduto], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        return res.status(200).json(result.rows[0]);
    });
};

// GET /produtos/buscar?nome=calca
export const buscarProdutoPorNome = (req, res) => {
    const { nome } = req.query;
    const q = `
        SELECT "idProduto", "descricao"
        FROM "SuperShop"."Produto"
        WHERE "descricao" ILIKE $1
        ORDER BY "descricao" ASC
        LIMIT 10
    `;
    db.query(q, [`%${nome}%`], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(result.rows);
    });
};

// GET /relatorios/estoque
export const relatorioEstoque = (_, res) => {
    const q = `
        SELECT 
            p."idProduto",
            p."descricao",
            p."estoque_atual",
            p."estoque_min",
            p."valor_venda",
            p."valor_custo",
            p."status",
            c.nome as categoria,
            m.nome as marca
        FROM "SuperShop"."Produto" p
        LEFT JOIN "SuperShop"."Categoria" c ON p."Categoria_idCategoria" = c."idCategoria"
        LEFT JOIN "SuperShop"."Marca" m ON p."Marca_idMarca" = m."idMarca"
        ORDER BY p."descricao" ASC
    `;
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data.rows);
    });
};

export const relatorioGiroEstoque = (req, res) => {
  const { produtoId, dataInicio, dataFim } = req.query;

  const filtros = [];
  const valores = [];

  if (dataInicio && dataFim) {
    filtros.push(`v."data" BETWEEN $${valores.length + 1} AND $${valores.length + 2}`);
    valores.push(dataInicio, dataFim);
  }

  if (produtoId) {
    filtros.push(`p."idProduto" = $${valores.length + 1}`);
    valores.push(produtoId);
  }

  const whereClause = filtros.length ? `WHERE ${filtros.join(" AND ")}` : "";

  const q = `
    SELECT 
        p."idProduto",
        p."descricao",
        p."sku",
        p."estoque_atual",
        SUM(iv.qtde) AS quantidade_vendida
    FROM "SuperShop"."Itens_Vendas" iv
    JOIN "SuperShop"."Produto" p ON iv."Produto_idProduto" = p."idProduto"
    JOIN "SuperShop"."Venda" v ON iv."Venda_idVenda" = v."idVenda"
    ${whereClause}
    GROUP BY p."idProduto"
    ORDER BY quantidade_vendida DESC
  `;

  db.query(q, valores, (err, data) => {
    if (err) return res.status(500).json(err);

    const relatorio = data.rows.map(row => ({
      idProduto: row.idProduto,
      descricao: row.descricao,
      sku: row.sku,
      estoque_atual: row.estoque_atual,
      quantidade_vendida: row.quantidade_vendida,
      giro_estoque: row.quantidade_vendida / (row.estoque_atual > 0 ? row.estoque_atual : 1),
    }));

    return res.status(200).json(relatorio);
  });
};