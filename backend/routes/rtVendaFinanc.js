import express from "express";
import { getClienteVenda } from "../controllers/venda.js";

const routerVendaFinanc = express.Router();

routerVendaFinanc.get("/",getClienteVenda);

export default routerVendaFinanc;
