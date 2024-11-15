import express from "express";
import { loginUsuario } from "../controllers/usuario.js";

const routerUsuario = express.Router();

routerUsuario.post("/login", loginUsuario);

export default routerUsuario;
