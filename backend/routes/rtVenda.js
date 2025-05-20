import express from "express";
import {
    getClienteVenda,
    getUsuarioVenda,
    getListarComprasCliente,
    getListarVendasUsuario,
    getRelatorioVendas,
    postRegistrarVenda,
    getVendasByCliente,
    getItensVenda
} from "../controllers/venda.js";

const routerVenda = express.Router();

// Rotas de consulta
routerVenda.get("/", getClienteVenda);
routerVenda.get("/usuario/:nome", getUsuarioVenda);
routerVenda.get("/listarComprasCliente/:idCliente", getListarComprasCliente);
routerVenda.get("/listarVendasUsuario/:idUsuario", getListarVendasUsuario);
routerVenda.get("/relatorioVendas", getRelatorioVendas);
routerVenda.get("/cliente/:idCliente", getVendasByCliente);
routerVenda.get("/itens/:idVenda", getItensVenda);

// Rota de registro de venda
routerVenda.post("/", postRegistrarVenda);

export default routerVenda;
