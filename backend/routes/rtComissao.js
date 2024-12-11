import express from "express";
import {
  getComissoes,
  getComissaoById,
  createComissao,
  updateComissao,
  deleteComissao,
} from "../controllers/comissao.js";

const router = express.Router();

router.get("/", getComissoes);
router.get("/:idComissao", getComissaoById);
router.post("/", createComissao);
router.put("/:idComissao", updateComissao);
router.delete("/:idComissao", deleteComissao);

export default router;