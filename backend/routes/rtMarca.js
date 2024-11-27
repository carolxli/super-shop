import express from "express"; 
import { getMarca,getMarcaById,getMarcaFornecedor } from "../controllers/marca.js";

const routerMarca = express.Router();

routerMarca.get("/:idFornecedor", getMarca);
routerMarca.get("/:idMarca", getMarcaById);
routerMarca.get("/",getMarcaFornecedor);

export default routerMarca;
