import express from "express";
import { getPessoa, postPessoa, updatePessoa, deletePessoa } from "../controllers/pessoa.js";

const routerPess = express.Router();

routerPess.get("/", getPessoa);
routerPess.post("/", postPessoa);
routerPess.put("/:idPessoa", updatePessoa);
routerPess.delete("/:idPessoa", deletePessoa);

export default routerPess;


