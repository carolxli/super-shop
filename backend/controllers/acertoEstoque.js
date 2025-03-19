import { db } from "../db.js";

export const postAcerto = async (req, res) => {
    const { Produto_idProduto, estoqueAnterior, estoqueNovo, motivo, usuario, confirmado } = req.body;

    if (!Produto_idProduto || estoqueNovo === undefined || !motivo || !usuario) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    const client = await db.connect();
    try {
        await client.query("BEGIN");

        const estoqueMinQuery = `
            SELECT "estoque_min" FROM "SuperShop"."Produto" WHERE "idProduto" = $1;
        `;
        const estoqueMinResult = await client.query(estoqueMinQuery, [Produto_idProduto]);

        if (estoqueMinResult.rows.length === 0) {
            throw new Error("Produto não encontrado");
        }

        const estoqueMin = estoqueMinResult.rows[0].estoque_min;

        if (estoqueNovo < estoqueMin && !confirmado) {
            return res.status(200).json({
                message: "O estoque ficará abaixo do mínimo. Deseja continuar?",
                warning: true
            });
        }

        const insertAcertoQuery = `
            INSERT INTO "SuperShop"."Acerto_Estoque" 
            ("Produto_idProduto", "estoqueAnterior", "estoqueNovo", "motivo", "usuario") 
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        const acertoValues = [Produto_idProduto, estoqueAnterior, estoqueNovo, motivo, usuario];
        await client.query(insertAcertoQuery, acertoValues);

        const updateProdutoQuery = `
            UPDATE "SuperShop"."Produto" 
            SET "estoque_atual" = $1 
            WHERE "idProduto" = $2;
        `;
        await client.query(updateProdutoQuery, [estoqueNovo, Produto_idProduto]);

        await client.query("COMMIT");

        res.status(200).json({ message: "Acerto de estoque realizado com sucesso" });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Erro ao ajustar estoque:", error);
        res.status(500).json({ message: "Erro ao ajustar estoque" });
    } finally {
        client.release();
    }
};