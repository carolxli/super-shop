import { db } from "../db.js";

export const getFornecedor = async (req, res) => {
    const { razao_social } = req.query;
    let query = `
        SELECT 
            f."idFornecedor",
            f."cnpj",
            f."razao_social",
            f."qtd_min_pedido",
            f."prazo_entrega",
            f."dt_inicio_fornecimento",
            f."observacao",
            p."nome" AS pessoa_nome,
            string_agg(m."nome", ', ') AS marcas_nome
        FROM "SuperShop"."Fornecedor" f
        JOIN "SuperShop"."Pessoa" p ON f."Pessoa_idPessoa" = p."idPessoa"
        LEFT JOIN "SuperShop"."Marca" m ON m."idMarca" = ANY(f."marcas_fornecedor")
        GROUP BY f."idFornecedor", f."cnpj", f."razao_social", f."qtd_min_pedido", f."prazo_entrega", f."dt_inicio_fornecimento", f."observacao", p."nome"
        ORDER BY f."razao_social" ASC
    `;
    let values = [];

    if (razao_social) {
        query = `
            SELECT 
                f."idFornecedor",
                f."cnpj",
                f."razao_social",
                f."qtd_min_pedido",
                f."prazo_entrega",
                f."dt_inicio_fornecimento",
                f."observacao",
                p."nome" AS pessoa_nome,
                string_agg(m."nome", ', ') AS marcas_nome
            FROM "SuperShop"."Fornecedor" f
            JOIN "SuperShop"."Pessoa" p ON f."Pessoa_idPessoa" = p."idPessoa"
            LEFT JOIN "SuperShop"."Marca" m ON m."idMarca" = ANY(f."marcas_fornecedor")
            WHERE f."razao_social" ILIKE $1
            GROUP BY f."idFornecedor", f."cnpj", f."razao_social", f."qtd_min_pedido", f."prazo_entrega", f."dt_inicio_fornecimento", f."observacao", p."nome"
            ORDER BY f."razao_social" ASC
        `;
        values = [`%${razao_social}%`];
    }

    try {
        const result = await db.query(query, values);
        return res.status(200).json(result.rows);
    } catch (err) {
        return res.status(500).json({ error: "Erro ao buscar Fornecedor", details: err });
    }
};

export const postFornecedor = (req, res) => {
    const q = `INSERT INTO "SuperShop"."Fornecedor" (
        "cnpj",
        "razao_social",
        "qtd_min_pedido",
        "prazo_entrega",
        "dt_inicio_fornecimento",
        "observacao",
        "Pessoa_idPessoa",
        "marcas_fornecedor"
    ) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`;

    const values = [
        req.body.cnpj,
        req.body.razao_social,
        req.body.qtd_min_pedido,
        req.body.prazo_entrega,
        req.body.dt_inicio_fornecimento,
        req.body.observacao,
        req.body.Pessoa_idPessoa,
        req.body.marcas_fornecedor,
    ];

    db.query(q, values, (insertErr) => {
        if (insertErr) {
            console.error("Erro ao inserir Fornecedor:", insertErr);
            return res.status(500).json("Erro ao inserir fornecedor");
        }

        return res.status(200).json("Fornecedor inserido com sucesso");
    });
};

export const getFornecedorById = async (req, res) => {
    const idFornecedor = req.params.idFornecedor;
    const q = `
        SELECT 
            f."idFornecedor",
            f."cnpj",
            f."razao_social",
            f."qtd_min_pedido",
            f."prazo_entrega",
            f."dt_inicio_fornecimento",
            f."observacao",
            p."nome" AS pessoa_nome,
            string_agg(m."nome", ', ') AS marcas_nome
        FROM "SuperShop"."Fornecedor" f
        JOIN "SuperShop"."Pessoa" p ON f."Pessoa_idPessoa" = p."idPessoa"
        LEFT JOIN "SuperShop"."Marca" m ON m."idMarca" = ANY(f."marcas_fornecedor")
        WHERE f."idFornecedor" = $1
        GROUP BY f."idFornecedor", f."cnpj", f."razao_social", f."qtd_min_pedido", f."prazo_entrega", f."dt_inicio_fornecimento", f."observacao", p."nome";
    `;

    try {
        const result = await db.query(q, [idFornecedor]);
        return res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Erro ao buscar fornecedor:", err);
        return res.status(500).json({ error: "Erro ao buscar fornecedor", details: err });
    }
};

export const updateFornecedor = async (req, res) => {
    const q = `
        UPDATE "SuperShop"."Fornecedor" SET
        "cnpj" = $1,
        "razao_social" = $2,
        "qtd_min_pedido" = $3,
        "prazo_entrega" = $4,
        "dt_inicio_fornecimento" = $5,
        "observacao" = $6,
        "Pessoa_idPessoa" = $7,
        "marcas_fornecedor" = $8
        WHERE "idFornecedor" = $9;
    `;

    const values = [
        req.body.cnpj,
        req.body.razao_social,
        req.body.qtd_min_pedido,
        req.body.prazo_entrega,
        req.body.dt_inicio_fornecimento,
        req.body.observacao,
        req.body.Pessoa_idPessoa,
        req.body.marcas,
        req.params.idFornecedor
    ];

    try {
        await db.query(q, values);
        return res.status(200).json("Fornecedor atualizado com sucesso.");
    } catch (err) {
        console.error("Erro ao atualizar fornecedor:", err);
        return res.status(500).json({ error: "Erro ao atualizar fornecedor", details: err });
    }
};


export const deleteFornecedor = (req, res) => {
    const q = `DELETE FROM "SuperShop"."Fornecedor" WHERE "idFornecedor" = $1`;

    db.query(q, [req.params.idFornecedor], (err) => {
        if (err) {
            console.error("Erro ao deletar fornecedor:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json("Fornecedor deletado com sucesso");
    });
};

export const getFornecedores = (req, res) => {
    const razao_social = req.query.razao_social || '';
    const q = `SELECT "idFornecedor", "Pessoa_idPessoa", "razao_social" FROM "SuperShop"."Fornecedor" WHERE "razao_social" ILIKE $1 LIMIT 10`;

    db.query(q, [`%${razao_social}%`], (err, data) => {
        if (err) {
            console.error("Erro ao buscar fornecedor:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json(data.rows);
    });
};

export const getRelatorioPerfilFornecedor = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      WITH produto_top1 AS (
        SELECT
          p."descricao" AS produto_nome,
          cat."nome" AS categoria_nome,
          m."nome" AS marca_nome,
          SUM(cp."quantidade") AS total_vendido
        FROM "SuperShop"."Compra_Produto" cp
        JOIN "SuperShop"."Produto" p ON cp."id_produto" = p."idProduto"
        JOIN "SuperShop"."Categoria" cat ON p."Categoria_idCategoria" = cat."idCategoria"
        JOIN "SuperShop"."Marca" m ON p."Marca_idMarca" = m."idMarca"
        WHERE p."Fornecedor_idFornecedor" = $1
        GROUP BY p."descricao", cat."nome", m."nome"
        ORDER BY total_vendido DESC
        LIMIT 1
      ),
      compras_distintas AS (
        SELECT DISTINCT c."id_compra", c."dt_compra", c."total_compra"
        FROM "SuperShop"."Compra" c
        JOIN "SuperShop"."Compra_Produto" cp ON c."id_compra" = cp."id_compra"
        JOIN "SuperShop"."Produto" p ON cp."id_produto" = p."idProduto"
        WHERE p."Fornecedor_idFornecedor" = $1
      ),
      resumo AS (
        SELECT 
          f."idFornecedor",
          p."nome" AS nome_fornecedor,
          p."telefone_1",
          p."email",
          f."observacao",
          COUNT(DISTINCT cd."id_compra") AS total_compras,
          COALESCE(SUM(cd."total_compra"), 0) AS valor_total_comprado,
          MAX(cd."dt_compra") AS data_ultima_compra,
          MIN(cd."dt_compra") AS data_primeira_compra,
          COALESCE(SUM(cp."quantidade"), 0) AS total_produtos_comprados,
          CASE WHEN COUNT(DISTINCT cd."id_compra") > 0 
            THEN ROUND(SUM(cd."total_compra")::numeric / COUNT(DISTINCT cd."id_compra"), 2) 
            ELSE 0 
          END AS ticket_medio
        FROM "SuperShop"."Fornecedor" f
        JOIN "SuperShop"."Pessoa" p ON f."Pessoa_idPessoa" = p."idPessoa"
        LEFT JOIN compras_distintas cd ON TRUE
        LEFT JOIN "SuperShop"."Compra_Produto" cp ON cp."id_compra" = cd."id_compra"
        LEFT JOIN "SuperShop"."Produto" pr ON cp."id_produto" = pr."idProduto" AND pr."Fornecedor_idFornecedor" = f."idFornecedor"
        WHERE f."idFornecedor" = $1
        GROUP BY f."idFornecedor", p."nome", p."telefone_1", p."email", f."observacao"
      ),
      historico AS (
        SELECT 
          c."id_compra",
          c."dt_compra",
          c."total_compra",
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'produto', p."descricao",
              'quantidade', cp."quantidade",
              'marca', m."nome",
              'categoria', cat."nome"
            )
          ) AS itens
        FROM "SuperShop"."Compra" c
        JOIN "SuperShop"."Compra_Produto" cp ON cp."id_compra" = c."id_compra"
        JOIN "SuperShop"."Produto" p ON cp."id_produto" = p."idProduto"
        JOIN "SuperShop"."Marca" m ON p."Marca_idMarca" = m."idMarca"
        JOIN "SuperShop"."Categoria" cat ON p."Categoria_idCategoria" = cat."idCategoria"
        WHERE p."Fornecedor_idFornecedor" = $1
        GROUP BY c."id_compra", c."dt_compra", c."total_compra"
        ORDER BY c."dt_compra" DESC
      )
      SELECT 
        r.*,
        pt.produto_nome AS produto_mais_vendido,
        pt.categoria_nome AS categoria_mais_vendida,
        pt.marca_nome AS marca_mais_vendida,
        (SELECT JSON_AGG(h) FROM historico h) AS historico_compras
      FROM resumo r
      LEFT JOIN produto_top1 pt ON TRUE;
    `;

    const { rows } = await db.query(query, [id]);
    res.status(200).json(rows[0] || {});
  } catch (error) {
    console.error("Erro ao buscar perfil do fornecedor:", error);
    res.status(500).json({ message: "Erro ao buscar perfil do fornecedor." });
  }
};
