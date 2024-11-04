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
  host: "localhost",
  user: "postgres",
  password: "sua_senha_segura",
  database: "supershop",
  port: 5432,
});
