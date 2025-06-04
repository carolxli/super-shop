import { db } from "../db.js";

export const postAcerto = async (req, res) => {
    const {
        Produto_idProduto,
        estoqueAnterior,
        estoqueNovo,
        motivo,
        login,
        senha,
        confirmado
    } = req.body;

    // Validação básica dos campos obrigatórios
    if (!Produto_idProduto || estoqueNovo === undefined || !motivo || !login || !senha) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    const client = await db.connect();

    try {
        await client.query("BEGIN");

        // Buscar usuário pelo login
        const userQuery = `SELECT * FROM "SuperShop"."Usuario" WHERE "login" = $1`;
        const userResult = await client.query(userQuery, [login]);

        if (userResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(401).json({ message: "Usuário não encontrado" });
        }

        const user = userResult.rows[0];

        // Validar senha em texto plano (sem hash)
        if (senha !== user.senha) {
            await client.query("ROLLBACK");
            return res.status(401).json({ message: "Senha incorreta" });
        }

        const usuario_id = user.idUsuario; // ajuste conforme nome correto da coluna de id

        // Consultar estoque mínimo do produto
        const estoqueMinQuery = `
            SELECT "estoque_min" FROM "SuperShop"."Produto" WHERE "idProduto" = $1;
        `;
        const estoqueMinResult = await client.query(estoqueMinQuery, [Produto_idProduto]);

        if (estoqueMinResult.rows.length === 0) {
            throw new Error("Produto não encontrado");
        }

        const estoqueMin = estoqueMinResult.rows[0].estoque_min;

        // Verificar se estoque ficará abaixo do mínimo e se não foi confirmado
        if (estoqueNovo < estoqueMin && !confirmado) {
            await client.query("ROLLBACK");
            return res.status(200).json({
                message: "O estoque ficará abaixo do mínimo. Deseja continuar?",
                warning: true
            });
        }

        // Inserir o ajuste de estoque
        const insertAcertoQuery = `
            INSERT INTO "SuperShop"."Acerto_Estoque" 
            ("Produto_idProduto", "estoqueAnterior", "estoqueNovo", "motivo", "usuario", "dataAcerto") 
            VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *;
        `;
        const acertoValues = [Produto_idProduto, estoqueAnterior, estoqueNovo, motivo, usuario_id];
        await client.query(insertAcertoQuery, acertoValues);

        // Atualizar estoque do produto
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
        res.status(500).json({ message: "Erro ao ajustar estoque", error: error.message });
    } finally {
        client.release();
    }
};


export const getAcertosEstoque = async (req, res) => {
  const { motivo, usuario, dataInicio, dataFim } = req.query;

  let query = `
    SELECT 
      ae."idAcertoEst",
      p."descricao" AS "produtoDescricao",
      ae."estoqueAnterior",
      ae."estoqueNovo",
      ae."motivo",
      ae."dataAcerto",
      u."login" 
    FROM 
      "SuperShop"."Acerto_Estoque" ae
    JOIN 
      "SuperShop"."Produto" p ON ae."Produto_idProduto" = p."idProduto"
    JOIN 
      "SuperShop"."Usuario" u ON ae."usuario" = u."idUsuario"
    WHERE 1=1
  `;

  let values = [];

  if (motivo) {
    values.push(motivo);
    query += ` AND ae."motivo" = $${values.length}`;
  }

  if (usuario) {
    values.push(`%${usuario}%`);
    query += ` AND u."login" ILIKE $${values.length}`;
  }

  if (dataInicio) {
    values.push(dataInicio);
    query += ` AND ae."dataAcerto"::date >= $${values.length}`;
  }

  if (dataFim) {
    values.push(dataFim);
    query += ` AND ae."dataAcerto"::date <= $${values.length}`;
  }

  try {
    const result = await db.query(query, values);
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar acertos", details: err });
  }
};
