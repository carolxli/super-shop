/*import pkg from 'pg';
const { Pool } = pkg;

export const db = new Pool({
    host: "localhost",
    user: "postgres",
    password: "123",
    database: "SuperShop",
    port: 5432,
});*/

import pkg from "pg";
const { Pool } = pkg;

export const db = new Pool({
  host: "localhost", // Host onde o PostgreSQL está rodando
  user: "postgres", // Usuário do banco de dados
  password: "sua_senha_segura", // **Substitua pela sua senha real**
  database: "SuperShop", // Nome do banco de dados
  port: 5432, // Porta padrão do PostgreSQL
  // Adicionaremos mais configurações abaixo
});
