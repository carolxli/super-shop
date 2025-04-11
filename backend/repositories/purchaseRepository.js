import { db } from "../db.js";

export const createPurchaseRepository = async (data) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Insert into "Compra" table
    const queryPurchase = `
                INSERT INTO "SuperShop"."Compra" (
                        "dt_compra",
                        "total_compra",
                        "desconto",
                        "metodo_pgmto"
                ) VALUES ($1, $2, $3, $4)
                RETURNING "id_compra"
        `;
    const valuesPurchase = [
      data.purchaseDate,
      data.totalValue,
      data.discount,
      data.paymentMethod,
    ];
    const { rows } = await client.query(queryPurchase, valuesPurchase);
    const compraId = rows[0].id_compra;

    // Insert into "Compra_Produto" table
    const purchaseProductQuery = `
                INSERT INTO "SuperShop"."Compra_Produto" (
                        "id_compra",
                        "id_produto",
                        "quantidade"
                ) VALUES ($1, $2, $3)
        `;
    for (const product of data.products) {
      const purchaseProductValues = [
        compraId,
        product.productId,
        product.quantity,
      ];

      await client.query(purchaseProductQuery, purchaseProductValues);
    }

    await client.query("COMMIT");

    return true;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao criar compra e inserir produtos:", err);

    return false;
  } finally {
    client.release();
  }
};

export const getAllPurchasesRepository = async () => {
  const query = `
                SELECT DISTINCT 
                        c.id_compra AS "purchaseId",
                        c.dt_compra AS "purchaseDate",
                        c.total_compra AS "totalValue",
                        c.desconto AS "discount",
                        c.metodo_pgmto AS "paymentMethod"
                FROM 
                        "SuperShop"."Compra" c
                INNER JOIN
                    "SuperShop"."Compra_Produto" cp ON c.id_compra = cp.id_compra
                `;

  try {
    const { rows } = await db.query(query);

    return rows.map((purchase) => ({
      purchaseId: purchase.purchaseId,
      purchaseDate: purchase.purchaseDate,
      totalValue: purchase.totalValue,
      discount: purchase.discount,
      paymentMethod: purchase.paymentMethod,
    }));
  } catch (err) {
    console.error("Erro ao buscar todas as compras:", err);
    return [];
  }
};

export const getPurchaseByIdRepository = async (purchaseId) => {
  const query = `
                SELECT 
                        c.id_compra AS "purchaseId",
                        c.dt_compra AS "purchaseDate",
                        c.total_compra AS "totalValue",
                        c.desconto AS "discount",
                        c.metodo_pgmto AS "paymentMethod"
                FROM 
                        "SuperShop"."Compra" c
                WHERE 
                        c.id_compra = $1
        `;

  try {
    const { rows } = await db.query(query, [purchaseId]);

    if (rows.length === 0) {
      return null; // No purchase found
    }

    const purchase = rows[0];
    return {
      purchaseId: purchase.purchaseId,
      purchaseDate: purchase.purchaseDate,
      totalValue: purchase.totalValue,
      discount: purchase.discount,
      paymentMethod: purchase.paymentMethod,
    };
  } catch (err) {
    console.error("Erro ao buscar dados da compra:", err);
    return null;
  }
};

export const getProductsByPurchaseIdRepository = async (param) => {
  const query = `
                select distinct
                        c.id_compra as "purchaseId",
                        c.dt_compra as "purchaseDate",
                        c.total_compra as "totalValue",
                        c.desconto as "discount",
                        c.metodo_pgmto as "paymentMethod",
                        p."idProduto" as "productId",
                        p."descricao" as "productDescription",
                        p.valor_venda as "saleValue",
                        cp.quantidade as "quantity"
                from
                        "SuperShop"."Compra" c 
                inner join 
                        "SuperShop"."Compra_Produto" cp on c.id_compra = cp.id_compra
                inner join 
                        "SuperShop"."Produto" p on p."idProduto" = cp.id_produto
                where c.id_compra = $1
        `;

  try {
    const { rows } = await db.query(query, [param]);

    const purchases = rows.reduce((acc, row) => {
      let purchase = acc.find((p) => p.purchaseId === row.purchaseId);

      if (!purchase) {
        purchase = {
          purchaseId: row.purchaseId,
          purchaseDate: row.purchaseDate,
          totalValue: row.totalValue,
          discount: row.discount,
          paymentMethod: row.paymentMethod,
          products: [],
        };
        acc.push(purchase);
      }

      purchase.products.push({
        productId: row.productId,
        productDescription: row.productDescription,
        saleValue: row.saleValue,
        quantity: row.quantity,
      });

      return acc;
    }, []);

    return purchases;
  } catch (err) {
    console.log("Erro ao buscar produtos da compra");
    console.error("Erro ao buscar compras:", err);

    return [];
  }
};

// TODO: Implement this function
export const getTotalValueByPurchaseIdRepository = async (products) => {
  try {
    let totalValue = 0;

    for (const product of products) {
      const query = `
                SELECT 
                        p."valor_venda" AS "saleValue"
                FROM 
                        "SuperShop"."Produto" p
                WHERE 
                        p."idProduto" = $1
            `;

      const { rows } = await db.query(query, [product.productId]);

      if (rows.length > 0) {
        const saleValue = rows[0].saleValue;
        totalValue += saleValue * product.quantity;
      }
    }

    return totalValue;
  } catch (err) {
    console.error("Erro ao calcular o valor total da compra:", err);
    return 0;
  }
};

export const getAllProductsWithSuppliersRepository = async () => {
  const query = `
                SELECT 
                        p."idProduto" AS "productId",
                        p."descricao" AS "productDescription",
                        p."valor_venda" AS "saleValue",
                        f."idFornecedor" AS "supplierId",
                        f."razao_social" AS "supplierName"
                FROM 
                        "SuperShop"."Produto" p
                INNER JOIN 
                        "SuperShop"."Fornecedor" f ON p."Fornecedor_idFornecedor" = f."idFornecedor"
        `;

  try {
    const { rows } = await db.query(query);

    return rows.map((product) => ({
      productId: product.productId,
      productDescription: product.productDescription,
      saleValue: product.saleValue,
      supplierId: product.supplierId,
      supplierName: product.supplierName,
    }));
  } catch (err) {
    console.error("Erro ao buscar todos os produtos com fornecedores:", err);
    return [];
  }
};

export const deletePurchaseRepository = async (purchaseId) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Check if the purchase exists
    const checkPurchaseQuery = `
                SELECT COUNT(*) AS count
                FROM "SuperShop"."Compra"
                WHERE "id_compra" = $1
        `;

    const { rows: checkRows } = await client.query(checkPurchaseQuery, [
      purchaseId,
    ]);
    const purchaseCount = parseInt(checkRows[0].count, 10);
    if (purchaseCount === 0) {
      console.log("Compra não encontrada");
      return false;
    }

    // Delete from "Compra_Produto" table
    const deletePurchaseProductQuery = `
                DELETE FROM "SuperShop"."Compra_Produto"
                WHERE "id_compra" = $1
        `;
    await client.query(deletePurchaseProductQuery, [purchaseId]);

    // Delete from "Compra" table
    const deletePurchaseQuery = `
                DELETE FROM "SuperShop"."Compra"
                WHERE "id_compra" = $1
        `;
    await client.query(deletePurchaseQuery, [purchaseId]);

    await client.query("COMMIT");

    return true;
  } catch (err) {
    console.log("Erro ao deletar compra:", err);
    await client.query("ROLLBACK");
    console.error("Erro ao deletar compra:", err);

    return false;
  } finally {
    client.release();
  }
};
