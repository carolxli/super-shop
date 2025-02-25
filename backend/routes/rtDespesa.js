import express from "express";
import {
  getDespesa,
  getDespesaById,
  getDespesaByStatus,
  postDespesa,
  updateDespesa,
  deleteDespesa,
} from "../controllers/despesa.js";

const router = express.Router();

router.get("/", getDespesa);

router.get("/:idDespesa", getDespesaById);

router.get("/status/:status", getDespesaByStatus);

router.post("/", postDespesa);

router.put("/:idDespesa", updateDespesa);

router.delete("/:idDespesa", deleteDespesa);

export default router;
