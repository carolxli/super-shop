import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const loginUsuario = async (req, res) => {
  const { login, senha } = req.body;

  try {
    console.log('Login:', login); // Depuração do login
    console.log('Senha:', senha); // Depuração da senha
  
    // Consulta o usuário no banco de dados, agora com JOIN para buscar o nome da pessoa
    const result = await db.query(
      `SELECT u.*, p.nome 
       FROM "SuperShop"."Usuario" u
       JOIN "SuperShop"."Pessoa" p ON u."Pessoa_idPessoa" = p."idPessoa"
       WHERE u."login" = $1`, 
      [login]
    );
  
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }
  
    const usuario = result.rows[0];
    console.log('Usuario encontrado:', usuario); // Depuração do resultado da consulta
  
    // Verifica se a senha corresponde diretamente (caso não esteja criptografada)
    if (senha !== usuario.senha) {
      return res.status(401).json({ message: "Senha incorreta." });
    }
  
    // Se a senha estiver criptografada, use bcrypt para comparar
    // const bcrypt = require('bcrypt');
    // if (!await bcrypt.compare(senha, usuario.senha)) {
    //   return res.status(401).json({ message: "Senha incorreta." });
    // }
  
    // Gera o token JWT
    const token = jwt.sign({ id: usuario.idUsuario }, 'seuSegredoJWT', { expiresIn: '1h' });
  
    // Retorna o token e o nome da pessoa
    return res.status(200).json({ token, nome: usuario.nome }); // Nome é o nome da pessoa
  } 
  catch (error) {
    console.error('Erro no servidor:', error); // Depuração do erro
    return res.status(500).json({ message: "Erro no servidor.", error });
  }
  
};
