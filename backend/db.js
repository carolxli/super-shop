import pkg from "pg";
const { Pool } = pkg;

// ***************/ config - Maria e Joao \***************
// export const db = new Pool({
//   host: "localhost",
//   user: "postgres",
//   password: "123",
//   database: "SuperShop",
//   port: 5432,
// });

export const db = new Pool({
  host: "localhost",
  user: "postgres",
  password: "postgres",
  database: "supershop",
  port: 5432,
});
