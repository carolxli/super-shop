import {
  createPurchaseRepository,
  getAllPurchasesRepository,
  getProductsByPurchaseIdRepository,
} from "../repositories/purchaseRepository.js";

const validate = (data) => {
  if (
    data.purchaseDate === undefined ||
    data.purchaseDate === null ||
    data.purchaseDate === ""
  ) {
    return false;
  }

  if (
    data.totalValue === undefined ||
    data.totalValue === null ||
    data.totalValue === "" ||
    isNaN(data.totalValue)
  ) {
    return false;
  }

  if (
    data.discount === undefined ||
    data.discount === null ||
    data.discount === "" ||
    isNaN(data.discount)
  ) {
    return false;
  }

  if (
    data.paymentMethod === undefined ||
    data.paymentMethod === null ||
    data.paymentMethod === ""
  ) {
    return false;
  }

  if (!Array.isArray(data.products) || data.products.length === 0) {
    return false;
  }

  for (const product of data.products) {
    if (
      product.productID === undefined ||
      product.productID === null ||
      product.productID === "" ||
      isNaN(product.productID)
    ) {
      return false;
    }

    if (
      product.quantity === undefined ||
      product.quantity === null ||
      product.quantity === "" ||
      isNaN(product.quantity)
    ) {
      return false;
    }
  }

  return true;
};

export const createPurchaseService = async (data) => {
  if (!validate(data)) {
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
    return null;
  }

  const products = await getProductsByPurchaseIdRepository(purchaseId);
  if (!products || products.length === 0) {
    return null;
  }

  return products;
};
