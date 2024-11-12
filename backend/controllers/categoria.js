import { db } from "../db.js";

// Obtém todas as categorias
export const getCategorias = async (_, res) => {
    const q = `SELECT * FROM "Categoria"`;
    db.query(q, (err, data) => {
        if (err) {
            console.error("Erro ao buscar categorias:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json(data.rows); // Retorna todas as categorias
    });
};

// Obtém uma categoria específica por ID
export const getCategoriaById = async (req, res) => {
    const idCategoria = req.params.idCategoria;
    const q = `SELECT * FROM "Categoria" WHERE "idCategoria" = $1`;
    
    db.query(q, [idCategoria], (err, data) => {
        if (err) return res.json(err);
        if (data.rows.length === 0) {
            return res.status(404).json({ message: "Categoria não encontrada" });
        }
        return res.status(200).json(data.rows[0]); // Retorna a categoria específica
    });
};

// Adiciona uma nova categoria
export const postCategoria = (req, res) => {
    const q = `INSERT INTO "Categoria" ("nome") VALUES($1)`;

    const values = [req.body.nome];

    db.query(q, values, (insertErr) => {
        if (insertErr) {
            console.error("Erro ao inserir categoria:", insertErr);
            return res.status(500).json("Erro ao inserir categoria");
        }

        return res.status(200).json("Categoria inserida com sucesso");
    });
};

// Atualiza uma categoria existente
export const updateCategoria = (req, res) => {
    const q = `UPDATE "Categoria" SET "nome" = $1 WHERE "idCategoria" = $2`;

    const values = [req.body.nome];

    db.query(q, [...values, req.params.idCategoria], (err) => {
        if (err) {
            console.error("Erro ao alterar categoria:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json("Categoria atualizada com sucesso");
    });
};

// Deleta uma categoria
export const deleteCategoria = (req, res) => {
    const q = `DELETE FROM "Categoria" WHERE "idCategoria" = $1`;

    db.query(q, [req.params.idCategoria], (err) => {
        if (err) {
            console.error("Erro ao deletar categoria:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json("Categoria deletada com sucesso");
    });
};
