import express from "express";
import routerProd from "./routes/rtProduto.js";
import routerPess from "./routes/rtPessoa.js";
import routerForne from "./routes/rtFornecedor.js";
import routerMarca from "./routes/rtMarca.js";
import routerCategoria from "./routes/rtCategoria.js";
import routerUsuario from "./routes/rtUsuario.js";
import routerDespesa from "./routes/rtDespesa.js";
import routerTipoDespesa from "./routes/rtTipoDespesa.js"; // Importa as rotas de TipoDespesa
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/Produto", routerProd);
app.use("/Pessoa", routerPess);
app.use("/Fornecedor", routerForne);
app.use("/Marca", routerMarca);
app.use("/Categoria", routerCategoria);
app.use("/usuario", routerUsuario);
app.use("/despesa", routerDespesa);
app.use("/tipos-despesa", routerTipoDespesa); // Adiciona as rotas de TipoDespesa

app.listen(8800);
