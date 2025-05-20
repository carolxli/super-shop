import express from "express";
import {
  getCliente, getClienteById, getRelatorioPerfilCliente, getHistoricoComprasCliente,
  postCliente,
  updateCliente,
  deleteCliente, 
} from "../controllers/cliente.js";

const routerCli = express.Router();
routerCli.get("/", getCliente);
routerCli.get("/id/:idCliente",getClienteById);
routerCli.get("/relatorioPerfilCliente/:id",getRelatorioPerfilCliente);
routerCli.get("/historicoComprasCliente/:id",getHistoricoComprasCliente);
routerCli.post("/", postCliente);
routerCli.put("/:idCliente", updateCliente);
routerCli.delete("/:idCliente", deleteCliente);

export default routerCli;
