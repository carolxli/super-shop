import express from "express";
import { postShopping } from "../controllers/shoppingController.js";

const routerShopping = express.Router();

routerShopping.post("/", postShopping);

export default routerShopping;
