import express from "express";
import { getAcertosEstoque, postAcerto} from "../controllers/acertoEstoque.js";

const routerAcertoEstoque = express.Router();

routerAcertoEstoque.get("/",getAcertosEstoque);
routerAcertoEstoque.post("/", postAcerto);

export default routerAcertoEstoque;
