import pkg from "pg";
const { Pool } = pkg;

export const db = new Pool({
  host: "localhost",
  user: "postgres",
  password: "postgres",
  database: "supershop",
  port: 5432,
});
