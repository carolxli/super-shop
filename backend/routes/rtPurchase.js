import express from "express";
import {
  getAllPurchase,
  getPurchaseById,
  postPurchase,
} from "../controllers/purchaseController.js";

const routerPurchase = express.Router();

routerPurchase.post("/", postPurchase);
routerPurchase.get("/", getAllPurchase);
routerPurchase.get("/:purchaseId", getPurchaseById);

export default routerPurchase;
