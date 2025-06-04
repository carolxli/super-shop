import express from "express";
import {
  getProdutos,
  postProdutos,
  updateProdutos,
  deleteProdutos,
  getProduto,
  buscarProdutoPorNome,
  relatorioEstoque,
  relatorioGiroEstoque
} from "../controllers/produto.js";

const routerProd = express.Router();

// Produtos
routerProd.get("/", getProdutos);
routerProd.get("/buscar/nome", buscarProdutoPorNome); // Autocomplete
routerProd.get("/relatorio/estoque", relatorioEstoque); // Relatório de estoque
routerProd.get("/relatorio/giro", relatorioGiroEstoque); // Relatório de giro de estoque
routerProd.get("/:idProduto", getProduto);
routerProd.post("/", postProdutos);
routerProd.put("/:idProduto", updateProdutos);
routerProd.delete("/:idProduto", deleteProdutos);

export default routerProd;