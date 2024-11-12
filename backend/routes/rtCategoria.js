import express from "express";
import {
  getCategorias,
  getCategoriaById,
  postCategoria,
  updateCategoria,
  deleteCategoria,
} from "../controllers/categoria.js";

const routerCategoria = express.Router();

// Rota para obter todas as categorias
routerCategoria.get("/", getCategorias);  // Retorna todas as categorias

// Rota para obter uma categoria específica por ID
routerCategoria.get("/:idCategoria", getCategoriaById);  // Retorna uma categoria pelo ID

// Rota para adicionar uma nova categoria
routerCategoria.post("/", postCategoria);  // Cria uma nova categoria

// Rota para atualizar uma categoria existente
routerCategoria.put("/:idCategoria", updateCategoria);  // Atualiza categoria pelo ID

// Rota para deletar uma categoria
routerCategoria.delete("/:idCategoria", deleteCategoria);  // Deleta categoria pelo ID

export default routerCategoria;
