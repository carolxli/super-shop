import express from "express";
import { getClienteVenda, postRegistrarVenda, getUsuarioVenda } from "../controllers/venda.js";

const routerVendaFinanc = express.Router();

routerVendaFinanc.get("/",getClienteVenda);
routerVendaFinanc.get("/",getUsuarioVenda);
routerVendaFinanc.post("/",postRegistrarVenda);

export default routerVendaFinanc;
