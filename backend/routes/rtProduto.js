import express from "express";
import { getProdutos, postProdutos, updateProdutos, deleteProdutos, getProduto } from "../controllers/produto.js";

const routerProd = express.Router();

routerProd.get("/", getProdutos);
routerProd.post("/", postProdutos);
routerProd.put("/:idProduto", updateProdutos);
routerProd.delete("/:idProduto", deleteProdutos);
routerProd.get("/:idProduto", getProduto); 

export default routerProd;
