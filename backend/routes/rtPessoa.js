import express from "express"; 
import { getPessoa, postPessoa, updatePessoa, deletePessoa, getPessoaById } from "../controllers/pessoa.js";

const routerPess = express.Router();

routerPess.get("/", getPessoa);
routerPess.post("/", postPessoa);
routerPess.get("/:idPessoa", getPessoaById); // Nova rota para obter pessoa pelo ID
routerPess.put("/:idPessoa", updatePessoa);
routerPess.delete("/:idPessoa", deletePessoa);

export default routerPess;
