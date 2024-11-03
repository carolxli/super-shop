import express from "express";
import { getFornecedor, getFornecedorById, postFornecedor, updateFornecedor, deleteFornecedor } from "../controllers/fornecedor.js";

const routerForne = express.Router();

// Rota para obter todos os fornecedores
routerForne.get("/", getFornecedor); // Esta linha foi adicionada para listar todos os fornecedores
routerForne.get("/:idFornecedor", getFornecedorById);
routerForne.post("/", postFornecedor);
routerForne.put("/:idFornecedor", updateFornecedor);
routerForne.delete("/:idFornecedor", deleteFornecedor);

export default routerForne;
