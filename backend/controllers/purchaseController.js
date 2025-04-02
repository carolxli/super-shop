import {
  createPurchaseService,
  getAllPurchasesService,
  getProductsByPurchaseIdService,
} from "../services/purchaseService.js";

export const postPurchase = async (req, res) => {
  const data = req.body;

  if (!data) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  try {
    const result = await createPurchaseService(data);
    if (result)
      return res.status(201).json({ message: "Compra realizada com sucesso!" });

    return res.status(400).json({ message: "Erro ao realizar compra!" });
  } catch (error) {
    console.error("Erro ao criar compra", error);

    return res.status(500).json({ message: "Erro ao processar compra!" });
  }
};

export const getAllPurchase = async (req, res) => {
  try {
    const data = await getAllPurchasesService();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao buscar compras", error);

    return res.status(500).json({ message: "Erro ao buscar compras!" });
  }
};

export const getPurchaseById = async (req, res) => {
  const { purchaseId } = req.params;

  if (!purchaseId) {
    return res.status(400).json({ message: "ID da compra não informado!" });
  }

  try {
    const data = await getProductsByPurchaseIdService(purchaseId);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao buscar compra por ID", error);

    return res.status(500).json({ message: "Erro ao buscar compra por ID!" });
  }
};
