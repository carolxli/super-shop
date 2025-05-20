import express from "express"; 
import { getPessoa,getPessoaById, getPessoaByNome, postPessoa, updatePessoa, deletePessoa } from "../controllers/pessoa.js";

const routerPess = express.Router();

routerPess.get("/", getPessoa);
routerPess.get("/id/:idPessoa", getPessoaById);
routerPess.get("/:nome",getPessoaByNome);
routerPess.post("/", postPessoa);
routerPess.put("/:idPessoa", updatePessoa);
routerPess.delete("/:idPessoa", deletePessoa);

export default routerPess;

