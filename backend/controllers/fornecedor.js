import {db} from "../db.js";

export const getFornecedor = async (_,res) => {
    const q = `SELECT * FROM "Fornecedor"`;
    db.query(q,(err,data) => {
        if(err) return res.json(err);
        return res.status(200).json(data);
    });
}

export const getFornecedorPessoa = async (_,res) => {
    const q = `SELECT *
                FROM "Pessoa" p
                JOIN "Fornecedor" f ON f."Pessoa_idPessoa" = p."idPessoa"`;
    db.query(q,(err,data) => {
        if(err) return res.json(err);
        return res.status(200).json(data);
    });
}

export const postFornecedor = (req,res) => {
    const q = `INSERT INTO "Fornecedor" (
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
            console.error("Erro ao inserir Fornecedor", insertErr);
            return res.status(500).json("Erro ao inserir fornecedor");
        }

        return res.status(200).json("Fornecedor inserido com sucesso");
    });
};

export const updateFornecedor = (req,res) => {
    const q = `UPDATE "Fornecedor" SET
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

    db.query(q,[...values, req.params.idFornecedor], (err) => {
        if (err) {
            console.error("Erro ao alterar Fornecedor", err);
            return res.json(err);
        }
        return res.status(200).json("Fornecedor atualizado com sucesso");
    });
};

export const deleteFornecedor = (req, res) => {
    const q = `DELETE FROM "Fornecedor" WHERE \"idFornecedor\" = $1`;

    db.query(q, [req.params.idFornecedor], (err) => {
        if (err) {
            return res.json(err);
        }
        return res.status(200).json("Fornecedor deletado com sucesso");
    });
};
