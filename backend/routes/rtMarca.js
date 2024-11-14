import express from "express"; 
import { getMarca,getMarcaById } from "../controllers/marca.js";

const routerMarca = express.Router();

routerMarca.get("/", getMarca);
routerMarca.get("/:idMarca", getMarcaById);

export default routerMarca;
