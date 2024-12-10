import express from "express";
import {
  getTiposDespesa,
  getTipoDespesaById,
  createTipoDespesa,
  updateTipoDespesa,
  deleteTipoDespesa,
} from "../controllers/tipoDespesa.js";

const router = express.Router();

router.get("/", getTiposDespesa);

router.get("/:idTipo", getTipoDespesaById);

router.post("/", createTipoDespesa);

router.put("/:idTipo", updateTipoDespesa);

router.delete("/:idTipo", deleteTipoDespesa);

export default router;
