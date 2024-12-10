import { db } from "../db.js";

export const getVendasPorCliente = async (req, res) => {
    const { idCliente } = req.params;
    console.log('Buscando vendas para o cliente:', idCliente);
    const query = `
        SELECT *
        FROM "SuperShop"."Venda" v
        WHERE v."Cliente_idCliente" = $1
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


export const getCliente = async (req, res) => {
    const { nome } = req.query;
    const query = `
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
        c."idCliente", p."nome", c."Pessoa_idPessoa"  -- Incluindo a coluna Pessoa_idPessoa
    ORDER BY 
        p."nome" ASC
`;

let values = [];


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
                c."idCliente", p."nome"
            ORDER BY 
                p."nome" ASC
        `;
        values = [`%${nome}%`];
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

