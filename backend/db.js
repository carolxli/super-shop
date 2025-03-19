import pkg from "pg";
const { Pool } = pkg;

export const db = new Pool({
  host: "localhost",
  user: "postgres",
  password: "postgres", // 123
  database: "supershop", // SuperShop
  port: 5432,
});
