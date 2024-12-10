import express from "express";
import { 
    getMarca,
    getMarcaById,
    getMarcaFornecedor,
    createMarca,
    updateMarca,
    deleteMarca 
} from "../controllers/marca.js";

const routerMarca = express.Router();

// Rota GET para obter marcas de um fornecedor específico
routerMarca.get("/:idFornecedor", getMarca);

// Rota GET para obter uma marca pelo ID
routerMarca.get("/:idMarca", getMarcaById);

// Rota GET para obter todas as marcas
routerMarca.get("/", getMarcaFornecedor);

// Rota POST para criar uma nova marca
routerMarca.post("/", createMarca);

// Rota PUT para atualizar uma marca existente
routerMarca.put("/:idMarca", updateMarca);

// Rota DELETE para excluir uma marca pelo ID
routerMarca.delete("/:idMarca", deleteMarca);

export default routerMarca;
