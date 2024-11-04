// routes/rtDespesa.js

import express from "express";
import {
  getDespesa,
  getDespesaById,
  postDespesa,
  updateDespesa,
  deleteDespesa,
} from "../controllers/despesa.js";

const router = express.Router();

// Rota para obter todas as despesas
router.get("/", getDespesa);

// Rota para obter uma despesa específica pelo ID
router.get("/:idDespesa", getDespesaById);

// Rota para criar uma nova despesa
router.post("/", postDespesa);

// Rota para atualizar uma despesa existente
router.put("/:idDespesa", updateDespesa);

// Rota para deletar uma despesa
router.delete("/:idDespesa", deleteDespesa);

export default router;
