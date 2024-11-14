import { db } from "../db.js";

export const getMarca = async (_, res) => {

    const q = `SELECT * FROM "SuperShop"."Marca"`;
    db.query(q, (err, data) => {
        if (err) {
            console.error("Erro ao buscar marcas:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json(data.rows);
    });
};

export const getMarcaById = async (_, res) => {

    const q = `SELECT * FROM "SuperShop"."Marca" WHERE "idMarca" = $1`;
    db.query(q, (err, data) => {
        if (err) {
            console.error("Erro ao buscar marcas:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json(data.rows);
    });
};
