import express from "express";
import {
  getTiposDespesa,
  getTipoDespesaById,
  getTiposDespesaByName,
  createTipoDespesa,
  updateTipoDespesa,
  deleteTipoDespesa,
} from "../controllers/tipoDespesa.js";

const router = express.Router();

router.get("/", getTiposDespesa);

router.get("/:idTipo", getTipoDespesaById);

router.get("/nome/:nome_tipo", getTiposDespesaByName);

router.post("/", createTipoDespesa);

router.put("/:idTipo", updateTipoDespesa);

router.delete("/:idTipo", deleteTipoDespesa);

export default router;
