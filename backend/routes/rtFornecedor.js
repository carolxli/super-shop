import express from "express";
import { getFornecedor,getFornecedorPessoa, postFornecedor, updateFornecedor, deleteFornecedor } from "../controllers/fornecedor.js";

const routerForne = express.Router();

//routerForne.get("/", getFornecedor);
routerForne.get("/",getFornecedorPessoa);
routerForne.post("/", postFornecedor);
routerForne.put("/:idFornecedor", updateFornecedor);
routerForne.delete("/:idFornecedor", deleteFornecedor);

export default routerForne;


