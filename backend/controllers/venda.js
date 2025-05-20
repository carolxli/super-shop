import { db } from "../db.js";

export const getClienteVenda2 = async (req, res) => {

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

export const getVendasByCliente = (req, res) => {
    const { idCliente } = req.params;
    const q = `SELECT "idVenda", data, valor_total AS total FROM "SuperShop"."Venda" WHERE "Cliente_idCliente" = $1`;
  
    db.query(q, [idCliente], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.rows);
    });
  };
  
  export const getItensVenda = (req, res) => {
    const { idVenda } = req.params;
    const q = `
      SELECT 
      iv."Produto_idProduto", 
      iv.qtde AS quantidade, 
      iv.valor_vendido, 
      iv.valor_unitario,
      p.descricao
      FROM "SuperShop"."Itens_Vendas" iv
      JOIN "SuperShop"."Produto" p ON iv."Produto_idProduto" = p."idProduto"
      WHERE iv."Venda_idVenda" = $1
    `;
  
    db.query(q, [idVenda], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.rows);
    });
  };

export const getClienteVenda = async (req, res) => {
    const nome = req.query.nome;
    const query = `
        SELECT c."idCliente", p."nome", c."voucher", c."Pessoa_idPessoa"
        FROM "SuperShop"."Cliente" c
        JOIN "SuperShop"."Pessoa" p ON c."Pessoa_idPessoa" = p."idPessoa"
        WHERE p."nome" ILIKE $1; 
    `;
    db.query(query, [`%${nome}%`], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro no servidor.");
        }
        res.json(result.rows);
    });
};

export const getUsuarioVenda = async (req, res) => {
    const nome = req.params.nome;
    const query = `
    SELECT u."idUsuario", p."nome", u."Pessoa_idPessoa"
    FROM "SuperShop"."Usuario" u
    JOIN "SuperShop"."Pessoa" p ON u."Pessoa_idPessoa" = p."idPessoa"
    WHERE p."nome" ILIKE $1
  `;

    db.query(query, [`%${nome}%`], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro no servidor.");
        }
        res.json(result.rows);
    });
};

export const postRegistrarVenda = async (req, res) => {
    let {
        data,
        desconto,
        valor_total,
        metodo_pgmto,
        Usuario_idUsuario,
        Cliente_idCliente,
        itens,
        pagamentos
    } = req.body;

    desconto = parseFloat(desconto);
    if (isNaN(desconto)) desconto = 0;


    if (!itens || itens.length === 0) {
        return res.status(400).json({ message: "A venda deve conter ao menos um item." });
    }

    // Se não houver desconto e pagamentos não forem enviados, calcular o valor total com base nos itens
    if ((!pagamentos || pagamentos.length === 0) && desconto === 0) {
        const totalSemDesconto = itens.reduce((acc, item) => {
            return acc + (item.valor_unitario * item.qtde);
        }, 0);

        pagamentos = [{
            metodo: metodo_pgmto,
            valor: totalSemDesconto
        }];

        valor_total = totalSemDesconto; // atualiza o valor_total com base nos itens
    }

    try {
        // 1. Buscar Pessoa_idPessoa do cliente e o saldo do voucher
        const buscarClienteQuery = `
            SELECT "Pessoa_idPessoa", "voucher"
            FROM "SuperShop"."Cliente"
            WHERE "idCliente" = $1
        `;
        const clienteResult = await db.query(buscarClienteQuery, [Cliente_idCliente]);

        if (clienteResult.rows.length === 0) {
            return res.status(404).json({ message: "Cliente não encontrado." });
        }

        const Cliente_Pessoa_idPessoa = clienteResult.rows[0].Pessoa_idPessoa;
        const saldoVoucher = parseFloat(clienteResult.rows[0].voucher);

        // 2. Buscar Pessoa_idPessoa do usuário
        const buscarPessoaUsuarioQuery = `
            SELECT "Pessoa_idPessoa" 
            FROM "SuperShop"."Usuario" 
            WHERE "idUsuario" = $1
        `;
        const usuarioResult = await db.query(buscarPessoaUsuarioQuery, [Usuario_idUsuario]);

        if (usuarioResult.rows.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        const Usuario_Pessoa_idPessoa = usuarioResult.rows[0].Pessoa_idPessoa;

        // 3. Se método de pagamento for voucher, debitar do saldo
        if (metodo_pgmto === 'voucher') {
            if (saldoVoucher < valor_total) {
                return res.status(400).json({ message: "Saldo de voucher insuficiente para esta venda." });
            }

            const atualizarVoucherQuery = `
                UPDATE "SuperShop"."Cliente"
                SET "voucher" = "voucher" - $1
                WHERE "idCliente" = $2
            `;
            await db.query(atualizarVoucherQuery, [valor_total, Cliente_idCliente]);
        }

        // 4. Inserir a venda
        const insertVendaQuery = `
            INSERT INTO "SuperShop"."Venda" 
            ("data", "desconto", "valor_total", "Usuario_idUsuario", "Usuario_Pessoa_idPessoa", "Cliente_idCliente", "Cliente_Pessoa_idPessoa")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING "idVenda"
        `;
        const vendaResult = await db.query(insertVendaQuery, [
            data,
            desconto,
            valor_total,
            Usuario_idUsuario,
            Usuario_Pessoa_idPessoa,
            Cliente_idCliente,
            Cliente_Pessoa_idPessoa
        ]);

        const idVenda = vendaResult.rows[0].idVenda;

        // 5. Inserir itens e atualizar estoque
        const insertItemQuery = `
            INSERT INTO "SuperShop"."Itens_Vendas" 
            ("Venda_idVenda", "Produto_idProduto", "qtde", "valor_unitario", "valor_vendido")
            VALUES ($1, $2, $3, $4, $5)
        `;

        for (const item of itens) {
            const valorDesconto = (desconto / 100) * item.valor_unitario;
            const valorVendido = item.valor_unitario - valorDesconto;

            await db.query(insertItemQuery, [
                idVenda,
                item.Produto_idProduto,
                item.qtde,
                item.valor_unitario,
                valorVendido
            ]);

            const atualizarEstoqueQuery = `
                UPDATE "SuperShop"."Produto"
                SET "estoque_atual" = "estoque_atual" - $1
                WHERE "idProduto" = $2
            `;
            await db.query(atualizarEstoqueQuery, [item.qtde, item.Produto_idProduto]);
        }

        // 6. Inserir os pagamentos na tabela de recebimentos
        for (const pagamento of pagamentos) {
            const insertRecebimentoQuery = `
                INSERT INTO "SuperShop"."Recebimentos" 
                ("Venda_idVenda", "metodo_pagamento", "valor_pago")
                VALUES ($1, $2, $3)
            `;
            await db.query(insertRecebimentoQuery, [
                idVenda,
                pagamento.metodo,
                pagamento.valor
            ]);
        }

        return res.status(201).json({ message: "Venda registrada com sucesso." });
    } catch (error) {
        console.error("Erro ao registrar venda:", error);
        return res.status(500).json({ message: "Erro ao registrar venda." });
    }
};


export const getListarComprasCliente = async (req, res) => {
    const { idCliente } = req.params;

    try {
        const query = `
          SELECT 
    v."idVenda",
    v."data",
    p_vendedor."nome" AS vendedor,
    iv."qtde",
    prod."descricao" AS produto,
    m."nome" AS marca,
    cat."nome" AS categoria,
    iv."valor_unitario",
    iv."valor_vendido"
FROM "SuperShop"."Venda" v
JOIN "SuperShop"."Cliente" c ON v."Cliente_idCliente" = c."idCliente"
JOIN "SuperShop"."Pessoa" p_cliente ON c."Pessoa_idPessoa" = p_cliente."idPessoa"
JOIN "SuperShop"."Usuario" u ON v."Usuario_idUsuario" = u."idUsuario"
JOIN "SuperShop"."Pessoa" p_vendedor ON u."Pessoa_idPessoa" = p_vendedor."idPessoa"
JOIN "SuperShop"."Itens_Vendas" iv ON iv."Venda_idVenda" = v."idVenda"
JOIN "SuperShop"."Produto" prod ON iv."Produto_idProduto" = prod."idProduto"
JOIN "SuperShop"."Marca" m ON prod."Marca_idMarca" = m."idMarca"
JOIN "SuperShop"."Categoria" cat ON prod."Categoria_idCategoria" = cat."idCategoria"
WHERE c."idCliente" = $1
ORDER BY v."data" DESC;
        `;

        const { rows } = await db.query(query, [idCliente]);

        const vendasAgrupadas = [];

        rows.forEach(row => {
            let venda = vendasAgrupadas.find(v => v.idVenda === row.idVenda);
            if (!venda) {
                venda = {
                    idVenda: row.idVenda,
                    data: row.data,
                    vendedor: row.vendedor,
                    itens: []
                };
                vendasAgrupadas.push(venda);
            }

            venda.itens.push({
                qtde: row.qtde,
                produto: row.produto,
                marca: row.marca,
                categoria: row.categoria,
                valor_unitario: parseFloat(row.valor_unitario),
                valor_vendido: parseFloat(row.valor_vendido)
            });

        });

        res.status(200).json(vendasAgrupadas);
    } catch (error) {
        console.error("Erro ao listar compras do cliente:", error);
        res.status(500).json({ erro: "Erro ao buscar compras." });
    }
};

export const getListarVendasUsuario = async (req, res) => {
    const { idUsuario } = req.params;

    try {
        const query = `
            SELECT 
                v."idVenda",
                v."data",
                p_cliente."nome" AS cliente,
                p_vendedor."nome" AS vendedor,
                prod."descricao" AS produto,
                iv."valor_unitario",
                iv."valor_vendido"
            FROM "SuperShop"."Venda" v
            JOIN "SuperShop"."Cliente" c ON v."Cliente_idCliente" = c."idCliente"
            JOIN "SuperShop"."Pessoa" p_cliente ON c."Pessoa_idPessoa" = p_cliente."idPessoa"
            JOIN "SuperShop"."Usuario" u ON v."Usuario_idUsuario" = u."idUsuario"
            JOIN "SuperShop"."Pessoa" p_vendedor ON u."Pessoa_idPessoa" = p_vendedor."idPessoa"
            JOIN "SuperShop"."Itens_Vendas" iv ON iv."Venda_idVenda" = v."idVenda"
            JOIN "SuperShop"."Produto" prod ON iv."Produto_idProduto" = prod."idProduto"
            WHERE u."idUsuario" = $1
            ORDER BY v."data" DESC;
        `;

        const { rows } = await db.query(query, [idUsuario]);

        const vendasAgrupadas = [];

        rows.forEach(row => {
            let venda = vendasAgrupadas.find(v => v.idVenda === row.idVenda);
            if (!venda) {
                venda = {
                    idVenda: row.idVenda,
                    data: row.data,
                    cliente: row.cliente,
                    vendedor: row.vendedor,
                    itens: []
                };
                vendasAgrupadas.push(venda);
            }

            venda.itens.push({
                produto: row.produto,
                valor_unitario: parseFloat(row.valor_unitario),
                valor_vendido: parseFloat(row.valor_vendido)
            });
        });

        res.status(200).json(vendasAgrupadas);
    } catch (error) {
        console.error("Erro ao listar vendas do usuário:", error);
        res.status(500).json({ erro: "Erro ao buscar compras." });
    }
};

export const getRelatorioVendas = async (req, res) => {
    try {
        const query = `
            SELECT
    v."idVenda",
    v."data" AS data_venda,
    iv."qtde",
    p."sku",
    p."descricao",
    iv."qtde",
    iv."valor_unitario",
    iv."valor_vendido",
    cli_p."nome" AS cliente,
    usr_p."nome" AS vendedor,
    r."metodo_pagamento",
    r."valor_pago",
    cat."nome" AS categoria,
    m."nome" AS marca
FROM "SuperShop"."Venda" v
JOIN "SuperShop"."Itens_Vendas" iv ON iv."Venda_idVenda" = v."idVenda"
JOIN "SuperShop"."Produto" p ON iv."Produto_idProduto" = p."idProduto"
JOIN "SuperShop"."Categoria" cat ON p."Categoria_idCategoria" = cat."idCategoria"
JOIN "SuperShop"."Marca" m ON p."Marca_idMarca" = m."idMarca"
JOIN "SuperShop"."Cliente" c ON v."Cliente_idCliente" = c."idCliente"
JOIN "SuperShop"."Pessoa" cli_p ON c."Pessoa_idPessoa" = cli_p."idPessoa"
JOIN "SuperShop"."Usuario" u ON v."Usuario_idUsuario" = u."idUsuario"
JOIN "SuperShop"."Pessoa" usr_p ON u."Pessoa_idPessoa" = usr_p."idPessoa"
JOIN "SuperShop"."Recebimentos" r ON r."Venda_idVenda" = v."idVenda"
ORDER BY v."data" DESC;

        `;

        const { rows } = await db.query(query);

        const relatorioAgrupado = [];

        rows.forEach(row => {
            let venda = relatorioAgrupado.find(v => v.idVenda === row.idVenda);
            if (!venda) {
                venda = {
                    idVenda: row.idVenda,
                    data_venda: row.data_venda,
                    cliente: row.cliente,
                    vendedor: row.vendedor,
                    pagamentos: [],
                    itens: []
                };
                relatorioAgrupado.push(venda);
            }

            // Evita duplicar itens
            const itemJaAdicionado = venda.itens.find(i =>
                i.sku === row.sku &&
                i.valor_unitario === parseFloat(row.valor_unitario) &&
                i.valor_vendido === parseFloat(row.valor_vendido)
            );

            if (!itemJaAdicionado) {
                venda.itens.push({
                    sku: row.sku,
                    descricao: row.descricao,
                    qtde: row.qtde,
                    valor_unitario: parseFloat(row.valor_unitario),
                    valor_vendido: parseFloat(row.valor_vendido)
                });
            }

            // Evita duplicar pagamentos
            const pagamentoExistente = venda.pagamentos.find(p => p.metodo_pagamento === row.metodo_pagamento);
            if (!pagamentoExistente) {
                venda.pagamentos.push({
                    metodo_pagamento: row.metodo_pagamento,
                    valor_pago: parseFloat(row.valor_pago)
                });
            }
        });


        res.status(200).json(relatorioAgrupado);
    } catch (error) {
        console.error("Erro ao gerar relatório de vendas:", error);
        res.status(500).json({ message: "Erro ao gerar relatório de vendas." });
    }
};