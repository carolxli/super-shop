import { createShoppingRepository } from "../repositories/shoppingRepository.js";

const validate = (data) => {
  if (
    data.productID === undefined ||
    data.productID === null ||
    data.productID === "" ||
    isNaN(data.productID)
  ) {
    return false;
  }

  if (
    data.userID === undefined ||
    data.userID === null ||
    data.userID === "" ||
    isNaN(data.userID)
  ) {
    return false;
  }

  if (
    data.shoppingDate === undefined ||
    data.shoppingDate === null ||
    data.shoppingDate === ""
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

  return true;
};

export const createShoppingService = async (data) => {
  if (!validate(data)) {
    console.log("deu ruimmmmmmm");

    return { error: "Dados inválidos" };
  }
  console.log("service controller: ", data);
  const result = await createShoppingRepository(data);
  if (!result) {
    console.log("deu ruimmmmmmm NO SERVICE");
    return false;
  }

  return true;
};
