import express from "express";
import {
  getFornecedor,
  getFornecedorById,
  postFornecedor,
  updateFornecedor,
  deleteFornecedor, 
  getFornecedores,
} from "../controllers/fornecedor.js";

const routerForne = express.Router();
routerForne.get("/", getFornecedor);
routerForne.get("/:razao_social",getFornecedores);
routerForne.get("/:idFornecedor", getFornecedorById);
routerForne.post("/", postFornecedor);
routerForne.put("/:idFornecedor", updateFornecedor);
routerForne.delete("/:idFornecedor", deleteFornecedor);

export default routerForne;
