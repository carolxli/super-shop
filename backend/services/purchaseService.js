import { deletePurchase } from "../controllers/purchaseController.js";
import {
  createPurchaseRepository,
  deletePurchaseRepository,
  getAllProductsWithSuppliersRepository,
  getAllPurchasesRepository,
  getProductsByPurchaseIdRepository,
} from "../repositories/purchaseRepository.js";

const validate = (data) => {
  if (
    data.purchaseDate === undefined ||
    data.purchaseDate === null ||
    data.purchaseDate === ""
  ) {
    console.log("Data da compra inválida");
    return false;
  }

  if (
    data.totalValue === undefined ||
    data.totalValue === null ||
    data.totalValue === "" ||
    isNaN(data.totalValue)
  ) {
    console.log("Valor total inválido");
    return false;
  }

  if (
    data.discount === undefined ||
    data.discount === null ||
    data.discount === "" ||
    isNaN(data.discount)
  ) {
    console.log("Desconto inválido");
    return false;
  }

  if (
    data.paymentMethod === undefined ||
    data.paymentMethod === null ||
    data.paymentMethod === ""
  ) {
    console.log("Método de pagamento inválido");
    return false;
  }

  if (!Array.isArray(data.products) || data.products.length === 0) {
    console.log("Produtos inválidos");
    return false;
  }

  for (const product of data.products) {
    if (
      product.productId === undefined ||
      product.productId === null ||
      product.productId === "" ||
      isNaN(product.productId)
    ) {
      console.log("ID do produto inválido");
      return false;
    }

    if (
      product.quantity === undefined ||
      product.quantity === null ||
      product.quantity === "" ||
      isNaN(product.quantity)
    ) {
      console.log("Quantidade inválida");
      return false;
    }
  }

  return true;
};

export const createPurchaseService = async (data) => {
  if (!validate(data)) {
    console.log("Dados inválidos para criar compra: ", data);
    return false;
  }

  const result = await createPurchaseRepository(data);
  if (!result) {
    return false;
  }

  return true;
};

export const getAllPurchasesService = async () => {
  const purchases = await getAllPurchasesRepository();
  if (!purchases || purchases.length === 0) {
    return [];
  }

  return purchases;
};

export const getProductsByPurchaseIdService = async (purchaseId) => {
  if (!purchaseId || isNaN(purchaseId)) {
    console.log("ID da compra inválido");
    return null;
  }

  const products = await getProductsByPurchaseIdRepository(purchaseId);
  if (!products || products.length === 0) {
    console.log("Nenhum produto encontrado para a compra com ID:", purchaseId);
    return null;
  }

  return products;
};

export const getAllProductsWithSuppliersService = async () => {
  const products = await getAllProductsWithSuppliersRepository();
  if (!products || products.length === 0) {
    return [];
  }

  return products;
};

export const deletePurchaseService = async (purchaseId) => {
  if (!purchaseId || isNaN(purchaseId)) {
    console.log("ID da compra inválido");
    return false;
  }

  const result = await deletePurchaseRepository(purchaseId);
  if (!result) {
    return false;
  }

  return true;
};
