import { db } from "../db.js";

export const createShoppingRepository = async (data) => {
  const query = `
        INSERT INTO "SuperShop"."Compra" (
            "id_produto",
            "id_usuario",
            "dt_compra",
            "total_compra",
            "desconto",
            "metodo_pgmto"
        ) VALUES ($1, $2, $3, $4, $5, $6)
    `;
  console.log("repository data: ", data);
  const values = [
    data.productID,
    data.userID,
    data.shoppingDate,
    data.totalValue,
    data.discount,
    data.paymentMethod,
  ];

  try {
    await db.query(query, values);
    console.log("Compra criada com sucesso!");
    return true;
  } catch (err) {
    console.error("Erro ao criar compra:", err);
    return false;
  }
};
