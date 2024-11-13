import express from "express";
import { getProdutos, postProdutos, updateProdutos, deleteProdutos, getProduto, getFornecedores, getMarcasByFornecedor, getCategorias } from "../controllers/produto.js";

const routerProd = express.Router();

routerProd.get("/", getProdutos);
routerProd.post("/", postProdutos);
routerProd.put("/:idProduto", updateProdutos);
routerProd.delete("/:idProduto", deleteProdutos);
routerProd.get("/:idProduto", getProduto); 

// Rotas para obter os dados
routerProd.get("/fornecedores", getFornecedores);
routerProd.get("/marcas/:idFornecedor", getMarcasByFornecedor);
routerProd.get("/categorias", getCategorias);

export default routerProd;
