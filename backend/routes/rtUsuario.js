import express from "express";
import { loginUsuario, getUsuario, getUsuarioById, postUsuario, deleteUsuario, updateUsuario } from "../controllers/usuario.js";

const routerUsuario = express.Router();

routerUsuario.post("/login", loginUsuario);
routerUsuario.get("/",getUsuario);
routerUsuario.get("/id/:idUsuario",getUsuarioById);
routerUsuario.post("/",postUsuario);
routerUsuario.delete("/:idUsuario",deleteUsuario);
routerUsuario.put("/:idUsuario",updateUsuario);

export default routerUsuario;
