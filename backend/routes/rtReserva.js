// routes/rtReserva.js
import express from "express";
import {
  getReservas,
  postReserva,
  deleteReserva,
  concluirReserva,
  cancelarReserva, // nova função
} from "../controllers/reserva.js";

const router = express.Router();

router.get("/", getReservas);                         // Lista todas as reservas
router.post("/", postReserva);                        // Cria uma nova reserva
router.delete("/:id", deleteReserva);                 // Exclui uma reserva e devolve o estoque
router.put("/concluir/:id", concluirReserva);         // Conclui uma reserva
router.put("/cancelar/:id", cancelarReserva);         // Cancela uma reserva (nova rota)

export default router;
