import { db } from "../db.js";

// Obtém todos os fornecedores
export const getFornecedor = async (_, res) => {
    const q = `SELECT * FROM "SuperShop"."Fornecedor"`;
    db.query(q, (err, data) => {
        if (err) {
            console.error("Erro ao buscar fornecedores:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json(data);
    });
};

export const getFornecedorById = async (req, res) => {
    const idFornecedor = req.params.idFornecedor;
    const q = `SELECT * FROM "SuperShop"."Fornecedor" WHERE "idFornecedor" = $1`;
    
    db.query(q, [idFornecedor], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data.rows[0]); // Retornando apenas o fornecedor
    });
};

// Adiciona um novo fornecedor
export const postFornecedor = (req, res) => {
    const q = `INSERT INTO "SuperShop"."Fornecedor" (
        "cnpj",
        "razao_social",
        "qtd_min_pedido",
        "prazo_entrega",
        "dt_inicio_fornecimento",
        "observacao",
        "Pessoa_idPessoa"
    ) VALUES($1,$2,$3,$4,$5,$6,$7)`;

    const values = [
        req.body.cnpj,
        req.body.razao_social,
        req.body.qtd_min_pedido,
        req.body.prazo_entrega,
        req.body.dt_inicio_fornecimento,
        req.body.observacao,
        req.body.Pessoa_idPessoa,
    ];

    db.query(q, values, (insertErr) => {
        if (insertErr) {
            console.error("Erro ao inserir Fornecedor:", insertErr);
            return res.status(500).json("Erro ao inserir fornecedor");
        }

        return res.status(200).json("Fornecedor inserido com sucesso");
    });
};

// Atualiza um fornecedor existente
export const updateFornecedor = (req, res) => {
    const q = `UPDATE "SuperShop"."Fornecedor" SET
        "cnpj" = $1,
        "razao_social" = $2,
        "qtd_min_pedido" = $3,
        "prazo_entrega" = $4,
        "dt_inicio_fornecimento" = $5,
        "observacao" = $6,
        "Pessoa_idPessoa" = $7
    WHERE "idFornecedor" = $8`;

    const values = [
        req.body.cnpj,
        req.body.razao_social,
        req.body.qtd_min_pedido,
        req.body.prazo_entrega,
        req.body.dt_inicio_fornecimento,
        req.body.observacao,
        req.body.Pessoa_idPessoa,
    ];

    db.query(q, [...values, req.params.idFornecedor], (err) => {
        if (err) {
            console.error("Erro ao alterar Fornecedor:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json("Fornecedor atualizado com sucesso");
    });
};

// Deleta um fornecedor
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
