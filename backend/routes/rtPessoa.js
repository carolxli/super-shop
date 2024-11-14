import express from "express"; 
import { getPessoa, postPessoa, updatePessoa, deletePessoa, getPessoaById, getPessoaByNome } from "../controllers/pessoa.js";

const routerPess = express.Router();

routerPess.get("/", getPessoa);
routerPess.post("/", postPessoa);
routerPess.get("/:idPessoa", getPessoaById);
routerPess.get("/:nome",getPessoaByNome);
routerPess.put("/:idPessoa", updatePessoa);
routerPess.delete("/:idPessoa", deletePessoa);

export default routerPess;
