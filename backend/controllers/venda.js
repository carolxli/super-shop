import { db } from "../db.js";

export const getClienteVenda = async (req, res) => {

    const nome = req.query.nome;
    const query = `SELECT idCliente, nome, voucher FROM Clientes WHERE nome LIKE ?`;
    db.query(query, [`%${nome}%`], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro no servidor.");
        }
        res.json(result);
    });
};