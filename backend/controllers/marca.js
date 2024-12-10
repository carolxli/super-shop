import { db } from "../db.js";

// GET - Recupera todas as marcas associadas a um fornecedor específico
export const getMarca = async (req, res) => {
    const { idFornecedor } = req.params;

    const q = `
        SELECT * 
        FROM "SuperShop"."Marca"
        WHERE "idMarca" IN (
            SELECT UNNEST("marcas_fornecedor")
            FROM "SuperShop"."Fornecedor"
            WHERE "idFornecedor" = $1
        )
    `;

    db.query(q, [idFornecedor], (err, data) => {
        if (err) {
            console.error("Erro ao buscar marcas:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json(data.rows);
    });
};

// GET - Recupera todas as marcas
export const getMarcaFornecedor = async (_, res) => {
    const q = `SELECT * FROM "SuperShop"."Marca"`;
    db.query(q, (err, data) => {
        if (err) {
            console.error("Erro ao buscar marcas:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json(data.rows);
    });
};

// GET - Recupera uma marca específica pelo ID
export const getMarcaById = async (req, res) => {
    const { idMarca } = req.params;

    const q = `SELECT * FROM "SuperShop"."Marca" WHERE "idMarca" = $1`;
    db.query(q, [idMarca], (err, data) => {
        if (err) {
            console.error("Erro ao buscar marca:", err);
            return res.status(500).json(err);
        }
        if (data.rows.length === 0) {
            return res.status(404).json({ message: "Marca não encontrada" });
        }
        return res.status(200).json(data.rows[0]);
    });
};

// POST - Cria uma nova marca
export const createMarca = async (req, res) => {
    const { nome, descricao } = req.body;

    if (!nome) {
        return res.status(400).json({ message: "Nome da marca é obrigatório" });
    }

    const q = `
        INSERT INTO "SuperShop"."Marca" ("nome", "descricao")
        VALUES ($1, $2)
        RETURNING *;
    `;
    db.query(q, [nome, descricao], (err, data) => {
        if (err) {
            console.error("Erro ao criar marca:", err);
            return res.status(500).json(err);
        }
        return res.status(201).json(data.rows[0]);
    });
};

// PUT - Atualiza uma marca existente
export const updateMarca = async (req, res) => {
    const { idMarca } = req.params;
    const { nome, descricao } = req.body;

    if (!nome) {
        return res.status(400).json({ message: "Nome da marca é obrigatório" });
    }

    const q = `
        UPDATE "SuperShop"."Marca"
        SET "nome" = $1, "descricao" = $2
        WHERE "idMarca" = $3
        RETURNING *;
    `;
    db.query(q, [nome, descricao, idMarca], (err, data) => {
        if (err) {
            console.error("Erro ao atualizar marca:", err);
            return res.status(500).json(err);
        }
        if (data.rows.length === 0) {
            return res.status(404).json({ message: "Marca não encontrada" });
        }
        return res.status(200).json(data.rows[0]);
    });
};

// DELETE - Exclui uma marca
export const deleteMarca = async (req, res) => {
    const { idMarca } = req.params;

    const q = `DELETE FROM "SuperShop"."Marca" WHERE "idMarca" = $1 RETURNING *`;
    db.query(q, [idMarca], (err, data) => {
        if (err) {
            console.error("Erro ao excluir marca:", err);
            return res.status(500).json(err);
        }
        if (data.rows.length === 0) {
            return res.status(404).json({ message: "Marca não encontrada" });
        }
        return res.status(200).json({ message: "Marca excluída com sucesso" });
    });
};
