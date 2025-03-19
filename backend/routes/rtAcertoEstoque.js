import express from "express";
import { postAcerto } from "../controllers/acertoEstoque.js";

const routerAcerto = express.Router();

routerAcerto.post("/", postAcerto);

export default routerAcerto;
