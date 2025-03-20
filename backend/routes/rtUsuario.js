import express from "express";
import {
  loginUsuario,
  updateUserPassword,
  getUsuario,
  getUsuarioById,
  postUsuario,
  deleteUsuario,
  updateUsuario,
} from "../controllers/usuario.js";

const routerUsuario = express.Router();

routerUsuario.post("/login", loginUsuario);
routerUsuario.put("/reset-password", updateUserPassword);
routerUsuario.get("/", getUsuario);
routerUsuario.get("/id/:idUsuario", getUsuarioById);
routerUsuario.post("/", postUsuario);
routerUsuario.delete("/:idUsuario", deleteUsuario);
routerUsuario.put("/:idUsuario", updateUsuario);

export default routerUsuario;
