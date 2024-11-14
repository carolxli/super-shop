import {db} from "../db.js";

export const getProdutos = async (_, res) => {
    const q = `SELECT * FROM "SuperShop"."Produto"`;
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
}

export const postProdutos = (req, res) => {
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Novo controlador para buscar todas as marcas de um fornecedor específico
export const getMarcasByFornecedor = (req, res) => {
    const { idFornecedor } = req.params;
    const query = `SELECT "idMarca", "nome" FROM "SuperShop"."Marca" WHERE "idMarca" IN 
                   (SELECT "Marca_idMarca" FROM "SuperShop"."Fornecedor" WHERE "idFornecedor" = $1)`;
    db.query(query, [idFornecedor], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(result.rows);
    });
};

// Novo controlador para buscar todas as categorias
export const getCategorias = (req, res) => {
    const query = 'SELECT "idCategoria", "nome" FROM "SuperShop"."Categoria"';
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(result.rows);
    });
};
