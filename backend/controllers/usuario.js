import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const loginUsuario = async (req, res) => {
  const { login, senha } = req.body;

  try {
    const result = await db.query(
      `SELECT u.*, p.nome, u.cargo 
       FROM "SuperShop"."Usuario" u
       JOIN "SuperShop"."Pessoa" p ON u."Pessoa_idPessoa" = p."idPessoa"
       WHERE u."login" = $1`, 
      [login]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }

    const usuario = result.rows[0];

    if (senha !== usuario.senha) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    const token = jwt.sign({ id: usuario.idUsuario, cargo: usuario.cargo }, 'seuSegredoJWT', { expiresIn: '1h' });

    return res.status(200).json({ token, nome: usuario.nome, cargo: usuario.cargo });
  } 
  catch (error) {
    return res.status(500).json({ message: "Erro no servidor.", error });
  }
};
