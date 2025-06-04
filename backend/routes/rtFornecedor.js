import express from "express";
import {
  getFornecedor,
  getFornecedorById,
  getRelatorioPerfilFornecedor,
  postFornecedor,
  updateFornecedor,
  deleteFornecedor, 
  getFornecedores,
} from "../controllers/fornecedor.js";

const routerForne = express.Router();
routerForne.get("/", getFornecedor);
routerForne.get("/:razao_social",getFornecedores);
routerForne.get("/id/:idFornecedor", getFornecedorById);
routerForne.get("/relatorioPerfilFornecedor/:id",getRelatorioPerfilFornecedor);
routerForne.post("/", postFornecedor);
routerForne.put("/:idFornecedor", updateFornecedor);
routerForne.delete("/:idFornecedor", deleteFornecedor);

export default routerForne;
