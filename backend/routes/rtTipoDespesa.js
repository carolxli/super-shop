// backend/routes/rtTipoDespesa.js
import express from "express";
import {
  getTiposDespesa,
  getTipoDespesaById,
  createTipoDespesa,
  updateTipoDespesa,
  deleteTipoDespesa,
} from "../controllers/tipoDespesa.js";

const router = express.Router();

// Rota para obter todos os tipos de despesa
router.get("/", getTiposDespesa);

// Rota para obter um tipo de despesa específico pelo ID
router.get("/:idTipo", getTipoDespesaById);

// Rota para criar um novo tipo de despesa
router.post("/", createTipoDespesa);

// Rota para atualizar um tipo de despesa existente
router.put("/:idTipo", updateTipoDespesa);

// Rota para deletar um tipo de despesa
router.delete("/:idTipo", deleteTipoDespesa);

export default router;
