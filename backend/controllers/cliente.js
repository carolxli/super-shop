import { db } from "../db.js";

export const getCliente = async (req, res) => {
    const { nome } = req.query;
    let query = `
        SELECT 
            c.*,
            p."nome" AS "pessoa_nome",
            COALESCE(MAX(v."data"), NULL) AS "ultima_compra"
        FROM 
            "SuperShop"."Cliente" c
        JOIN 
            "SuperShop"."Pessoa" p ON c."Pessoa_idPessoa" = p."idPessoa"
        LEFT JOIN 
            "SuperShop"."Venda" v ON c."idCliente" = v."Cliente_idCliente"
        GROUP BY 
            c."idCliente", p."nome", c."Pessoa_idPessoa"
        ORDER BY 
            p."nome" ASC
    `;

    const values = [];

    if (nome) {
        query = `
            SELECT 
                c.*,
                p."nome" AS "pessoa_nome",
                COALESCE(MAX(v."data"), NULL) AS "ultima_compra"
            FROM 
                "SuperShop"."Cliente" c
            JOIN 
                "SuperShop"."Pessoa" p ON c."Pessoa_idPessoa" = p."idPessoa"
            LEFT JOIN 
                "SuperShop"."Venda" v ON c."idCliente" = v."Cliente_idCliente"
            WHERE 
                p."nome" ILIKE $1
            GROUP BY 
                c."idCliente", p."nome", c."Pessoa_idPessoa"
            ORDER BY 
                p."nome" ASC
        `;
        values.push(`%${nome}%`);
    }

    try {
        const result = await db.query(query, values);
        return res.status(200).json(result.rows);
    } catch (err) {
        console.error("Erro ao buscar clientes:", err);
        return res.status(500).json({ error: "Erro ao buscar clientes", details: err });
    }
};

export const postCliente = (req, res) => {
    const q = `INSERT INTO "SuperShop"."Cliente" (
        "Pessoa_idPessoa",
        "cpf",
        "rg",
        "voucher"
    ) VALUES($1,$2,$3,$4)`;

    const values = [
        req.body.Pessoa_idPessoa,
        req.body.cpf,
        req.body.rg,
        req.body.voucher,
    ];

    db.query(q, values, (insertErr) => {
        if (insertErr) {
            console.error("Erro ao inserir Cliente", insertErr);
            return res.status(500).json("Erro ao inserir cliente");
        }
        return res.status(200).json("Cliente inserida com sucesso");
    });
};

export const updateCliente = (req, res) => {
    const q = `UPDATE "SuperShop"."Cliente" SET
    "Pessoa_idPessoa" = $1,
    "cpf" = $2,
    "rg" = $3,
    "voucher" = $4
WHERE "idCliente" = $5`;


    const values = [
        req.body.Pessoa_idPessoa,
        req.body.cpf,
        req.body.rg,
        req.body.voucher,
    ];

    db.query(q, [...values, req.params.idCliente], (err) => {
        if (err) {
            return res.json(err);
        }
        return res.status(200).json("Cliente atualizada com sucesso");
    });
}

export const deleteCliente = (req, res) => {
    const q = `DELETE FROM "SuperShop"."Cliente" WHERE \"idCliente\" = $1`;

    db.query(q, [req.params.idCliente], (err) => {
        if (err) {
            return res.json(err);
        }
        return res.status(200).json("Cliente deletada com sucesso");
    });
};

export const getClienteById = async (req, res) => {
    const { idCliente } = req.params;

    const query = `
        SELECT 
            c.*,
            p."nome" AS "nome_pessoa"
        FROM 
            "SuperShop"."Cliente" c
        JOIN 
            "SuperShop"."Pessoa" p
        ON 
            c."Pessoa_idPessoa" = p."idPessoa"
        WHERE 
            c."idCliente" = $1
    `;

    try {
        const result = await db.query(query, [idCliente]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Cliente não encontrado" });
        }
        return res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Erro ao buscar cliente por ID:", err);
        return res.status(500).json({ error: "Erro ao buscar cliente por ID", details: err });
    }
};

export const getRelatorioPerfilCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
     WITH vendas_cliente AS (
    SELECT 
      v."idVenda",
      v."data",
      v."valor_total",
      r."metodo_pagamento"
    FROM "SuperShop"."Venda" v
    JOIN "SuperShop"."Recebimentos" r ON r."Venda_idVenda" = v."idVenda"
    WHERE v."Cliente_idCliente" = $1
),
itens_cliente AS (
    SELECT 
      iv."Produto_idProduto",
      pr."descricao" AS produto_nome,
      cat."nome" AS categoria_nome,
      m."nome" AS marca_nome,
      SUM(iv."qtde") AS total_comprado
    FROM "SuperShop"."Itens_Vendas" iv
    JOIN "SuperShop"."Venda" v ON iv."Venda_idVenda" = v."idVenda"
    JOIN "SuperShop"."Produto" pr ON iv."Produto_idProduto" = pr."idProduto"
    JOIN "SuperShop"."Categoria" cat ON pr."Categoria_idCategoria" = cat."idCategoria"
    JOIN "SuperShop"."Marca" m ON pr."Marca_idMarca" = m."idMarca"
    WHERE v."Cliente_idCliente" = $1
    GROUP BY iv."Produto_idProduto", pr."descricao", cat."nome", m."nome"
    ORDER BY total_comprado DESC
    LIMIT 1
),
forma_pagto AS (
    SELECT 
      r."metodo_pagamento",
      COUNT(*) AS total
    FROM "SuperShop"."Recebimentos" r
    JOIN "SuperShop"."Venda" v ON r."Venda_idVenda" = v."idVenda"
    WHERE v."Cliente_idCliente" = $1
    GROUP BY r."metodo_pagamento"
    ORDER BY total DESC
    LIMIT 1
),
devolucoes_cliente AS (
    SELECT COUNT(*) AS total_devolucoes
    FROM "SuperShop"."Devolucao" d
    WHERE d."Cliente_idCliente" = $1
),
resumo AS (
    SELECT 
      c."idCliente",
      p."nome",
      p."telefone_1",
      p."email",
      p."data_nasc",
      c."cpf",
      c."rg",
      c."voucher",
      COUNT(v."idVenda") AS total_vendas,
      COALESCE(SUM(v."valor_total"), 0) AS valor_total_gasto,
      MAX(v."data") AS data_ultima_compra,
      MIN(v."data") AS data_primeira_compra,
      COALESCE(SUM(iv."qtde"), 0) AS total_produtos_comprados,
      CASE WHEN COUNT(v."idVenda") > 0 THEN ROUND(SUM(v."valor_total")::numeric / COUNT(v."idVenda"), 2) ELSE 0 END AS ticket_medio
    FROM "SuperShop"."Cliente" c
    JOIN "SuperShop"."Pessoa" p ON c."Pessoa_idPessoa" = p."idPessoa"
    LEFT JOIN "SuperShop"."Venda" v ON c."idCliente" = v."Cliente_idCliente"
    LEFT JOIN "SuperShop"."Itens_Vendas" iv ON v."idVenda" = iv."Venda_idVenda"
    WHERE c."idCliente" = $1
    GROUP BY c."idCliente", p."nome", p."telefone_1", p."email", p."data_nasc", c."cpf", c."rg", c."voucher"
)

SELECT 
  r.*,
  ic.produto_nome AS produto_mais_comprado,
  ic.categoria_nome AS categoria_mais_comprada,
  ic.marca_nome AS marca_mais_comprada,
  fp.metodo_pagamento AS forma_pagamento_mais_usada,
  dc.total_devolucoes
FROM resumo r
LEFT JOIN itens_cliente ic ON TRUE
LEFT JOIN forma_pagto fp ON TRUE
LEFT JOIN devolucoes_cliente dc ON TRUE;

    `;

    const { rows } = await db.query(query, [id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar perfil do cliente:", error);
    res.status(500).json({ message: "Erro ao buscar perfil do cliente." });
  }
};

export const getHistoricoComprasCliente = async (req, res) => {
  const { id } = req.params;

  const query = `
  SELECT 
      v."idVenda",
      v."data",
      v."valor_total",
      r."metodo_pagamento",
      iv."qtde",
      pr."descricao" AS produto,
      cat."nome" AS categoria,
      m."nome" AS marca,
      iv."valor_unitario"
    FROM 
      "SuperShop"."Venda" v
    JOIN 
      "SuperShop"."Itens_Vendas" iv ON v."idVenda" = iv."Venda_idVenda"
    JOIN 
      "SuperShop"."Produto" pr ON iv."Produto_idProduto" = pr."idProduto"
    JOIN 
      "SuperShop"."Categoria" cat ON pr."Categoria_idCategoria" = cat."idCategoria"
    JOIN 
      "SuperShop"."Marca" m ON pr."Marca_idMarca" = m."idMarca"
    LEFT JOIN 
      "SuperShop"."Recebimentos" r ON v."idVenda" = r."Venda_idVenda"
    WHERE 
      v."Cliente_idCliente" = $1
    ORDER BY 
      v."data" DESC, v."idVenda" ASC
  `;

  try {
    const { rows } = await db.query(query, [id]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar histórico de compras do cliente:", error);
    res.status(500).json({ message: "Erro ao buscar histórico de compras do cliente." });
  }
};
