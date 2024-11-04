import express from "express";
console.log("Express importado com sucesso");
import routerProd from "./routes/rtProduto.js";
import routerPess from "./routes/rtPessoa.js";
import routerForne from "./routes/rtFornecedor.js";
import routerDesp from "./routes/rtDespesa.js";
import cors from "cors";
console.log("CORS importado com sucesso");

const app = express();
console.log("Aplicativo Express inicializado");

app.use(cors());
console.log("Middleware CORS configurado");

app.use(express.json());
console.log("Middleware para JSON configurado");

app.use("/Produto", routerProd);
console.log("Rota /Produto configurada");
app.use("/Pessoa", routerPess);
console.log("Rota /Pessoa configurada");
app.use("/Fornecedor", routerForne);
console.log("Rota /Fornecedor configurada");
app.use("/Despesa", routerDesp);
console.log("Rota /Despesa configurada");

app.listen(8800, () => {
  console.log("Servidor backend rodando na porta 8800");
});
