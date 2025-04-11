import express from "express";
import {
  deletePurchase,
  getAllProductsWithSuppliers,
  getAllPurchase,
  getPurchaseById,
  postPurchase,
} from "../controllers/purchaseController.js";

const routerPurchase = express.Router();

routerPurchase.post("/", postPurchase);
routerPurchase.get("/", getAllPurchase);
routerPurchase.get("/products", getAllProductsWithSuppliers);
routerPurchase.get("/:purchaseId", getPurchaseById);
routerPurchase.delete("/:purchaseId", deletePurchase);

export default routerPurchase;
