import express from "express";
import {
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

export default routerPurchase;
