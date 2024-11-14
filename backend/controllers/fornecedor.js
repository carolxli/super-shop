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

export const getFornecedorById = async (req, res) => {
    const idFornecedor = req.params.idFornecedor;
    const q = `SELECT * FROM "SuperShop"."Fornecedor" WHERE "idFornecedor" = $1`;
    
    db.query(q, [idFornecedor], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data.rows[0]);
    });
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

export const updateFornecedor = (req, res) => {
    const q = `UPDATE "SuperShop"."Fornecedor" SET
        "cnpj" = $1,
        "razao_social" = $2,
        "qtd_min_pedido" = $3,
        "prazo_entrega" = $4,
        "dt_inicio_fornecimento" = $5,
        "observacao" = $6,
        "Pessoa_idPessoa" = $7,
        "marcas_fornecedor" = $8
    WHERE "idFornecedor" = $9`;

    const values = [
        req.body.cnpj,
        req.body.razao_social,
        req.body.qtd_min_pedido,
        req.body.prazo_entrega,
        req.body.dt_inicio_fornecimento,
        req.body.observacao,
        req.body.Pessoa_idPessoa,
        req.body.marcas_fornecedor
    ];

    db.query(q, [...values, req.params.idFornecedor], (err) => {
        if (err) {
            console.error("Erro ao alterar Fornecedor:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json("Fornecedor atualizado com sucesso");
    });
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