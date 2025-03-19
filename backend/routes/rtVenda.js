import express from "express";
import { getClienteVenda } from "../controllers/venda.js";

const routerVenda = express.Router();

routerVenda.get("/",getClienteVenda);

export default routerVenda;
