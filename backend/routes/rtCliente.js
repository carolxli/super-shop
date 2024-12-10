import express from "express";
import {
  getCliente, getClienteById,
  postCliente,
  updateCliente,
  deleteCliente, 
} from "../controllers/cliente.js";

const routerCli = express.Router();
routerCli.get("/", getCliente);
routerCli.get("/id/:idCliente",getClienteById);
routerCli.post("/", postCliente);
routerCli.put("/:idCliente", updateCliente);
routerCli.delete("/:idCliente", deleteCliente);

export default routerCli;
