import {db} from "../db.js";

export const getPessoa = async (req, res) => {
    const { nome } = req.query;
    let query = `SELECT * FROM "SuperShop"."Pessoa" ORDER BY "nome" ASC`;
    let values = [];

    if (nome) {
        query = `SELECT * FROM "SuperShop"."Pessoa" WHERE "nome" ILIKE $1 ORDER BY "nome" ASC`;
        values = [`%${nome}%`];
    }

    try {
        const result = await db.query(query, values);
        return res.status(200).json(result.rows);
    } catch (err) {
        return res.status(500).json({ error: "Erro ao buscar pessoas", details: err });
    }
};


export const postPessoa = (req,res) =>{
    const q = `INSERT INTO "SuperShop"."Pessoa" (
        "email",
        "nome",
        "end_rua",
        "end_numero",
        "end_bairro",
        "end_complemento",
        "cidade",
        "estado",
        "cep",
        "telefone_1",
        "telefone_2",
        "data_nasc"
    ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`;

    const values = [
        req.body.email,
        req.body.nome,
        req.body.end_rua,
        req.body.end_numero,
        req.body.end_bairro,
        req.body.end_complemento,
        req.body.cidade,
        req.body.estado,
        req.body.cep,
        req.body.telefone_1,
        req.body.telefone_2,
        req.body.data_nasc,
    ];

    db.query(q,values,(insertErr) => {
        if(insertErr){
            console.error("Erro ao inserir Pessoa", insertErr);
            return res.status(500).json("Erro ao inserir pessoa");
        }
        return res.status(200).json("Pessoa inserida com sucesso");
    });
};

export const updatePessoa = (req,res) => {
    const q = `UPDATE "SuperShop"."Pessoa" SET
        "email" = $1,
        "nome" = $2,
        "end_rua" = $3,
        "end_numero" = $4,
        "end_bairro" = $5,
        "end_complemento" = $6,
        "cidade" = $7,
        "estado" = $8,
        "cep" = $9,
        "telefone_1" = $10,
        "telefone_2" = $11,
        "data_nasc" = $12
    WHERE "idPessoa" = $13`;

    const values = [
        req.body.email,
        req.body.nome,
        req.body.end_rua,
        req.body.end_numero,
        req.body.end_bairro,
        req.body.end_complemento,
        req.body.cidade,
        req.body.estado,
        req.body.cep,
        req.body.telefone_1,
        req.body.telefone_2,
        req.body.data_nasc,
    ];

    db.query(q,[...values, req.params.idPessoa], (err) => {
        if (err) {
            return res.json(err);
        }
        return res.status(200).json("Pessoa atualizada com sucesso");
    });
}

export const deletePessoa = (req, res) => {
    const q = `DELETE FROM "SuperShop"."Pessoa" WHERE \"idPessoa\" = $1`;

    db.query(q, [req.params.idPessoa], (err) => {
        if (err) {
            return res.json(err);
        }
        return res.status(200).json("Pessoa deletada com sucesso");
    });
};

export const getPessoaById = (req, res) => {
    const q = `SELECT * FROM "SuperShop"."Pessoa" WHERE "idPessoa" = $1`;
    db.query(q, [req.params.idPessoa], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data.rows[0]);
    });
};