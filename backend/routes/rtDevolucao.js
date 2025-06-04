import express from "express";
import { postDevolucao, getDevolucoesByCliente } from "../controllers/devolucao.js";
import { deleteDevolucao,
    getDevolucoesPorCliente,
    getDevolucoesPorPeriodo,
    getDevolucoesPorProduto,
    getDetalheDevolucao } from "../controllers/devolucao.js";

const routerDevolucao = express.Router();

routerDevolucao.post("/", postDevolucao);

// 🔁 PRIMEIRO as rotas específicas:
routerDevolucao.get("/cliente/:idCliente", getDevolucoesByCliente);
routerDevolucao.get("/por-periodo", getDevolucoesPorPeriodo);
routerDevolucao.get("/por-produto/:idProduto", getDevolucoesPorProduto);
routerDevolucao.get("/detalhe/:id", getDetalheDevolucao);

// 🔁 POR ÚLTIMO a rota genérica:
routerDevolucao.get("/:idCliente", getDevolucoesByCliente);

export default routerDevolucao;
