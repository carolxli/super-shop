import { createShoppingService } from "../services/shoppingService.js";

export const postShopping = async (req, res) => {
  const data = req.body;
  console.log("data controller: ", data);

  if (!data) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  try {
    const result = await createShoppingService(data);
    if (result)
      return res.status(201).json({ message: "Compra realizada com sucesso!" });

    return res.status(400).json({ message: "Erro ao realizar compra!" });
  } catch (error) {
    console.error("Erro ao criar compra", error);

    return res.status(500).json({ message: "Erro ao processar compra!" });
  }
};
