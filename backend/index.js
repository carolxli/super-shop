import express from "express";
import routerProd from "./routes/rtProduto.js";
import routerPess from "./routes/rtPessoa.js";
import routerForne from "./routes/rtFornecedor.js";
import routerCli from "./routes/rtCliente.js";
import routerMarca from "./routes/rtMarca.js";
import routerCategoria from "./routes/rtCategoria.js";
import routerUsuario from "./routes/rtUsuario.js";
import routerDespesa from "./routes/rtDespesa.js";
import routerTipoDespesa from "./routes/rtTipoDespesa.js";
import routerComissao from "./routes/rtComissao.js";
import routerAcertoEstoque from "./routes/rtAcertoEstoque.js";
import routerVenda from "./routes/rtVenda.js";
import routerVendaFinanc from "./routes/rtVendaFinanc.js";
import cors from "cors";
import routerPurchase from "./routes/rtPurchase.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/Produto", routerProd);
app.use("/Pessoa", routerPess);
app.use("/Fornecedor", routerForne);
app.use("/Cliente", routerCli);
app.use("/vendasCliente", routerCli);
app.use("/Marca", routerMarca);
app.use("/Categoria", routerCategoria);
app.use("/usuario", routerUsuario);
app.use("/despesa", routerDespesa);
app.use("/tipos-despesa", routerTipoDespesa);
<<<<<<< HEAD
app.use("/comissao",routerComissao);
app.use("/acertoEstoque",routerAcertoEstoque);
app.use("/Venda",routerVenda)
app.use("/venda-financeiro",routerVendaFinanc);
=======
app.use("/comissao", routerComissao);
app.use("/acertoEstoque", routerAcertoEstoque);
app.use("/Venda", routerVenda);
app.use("/purchase", routerPurchase);
>>>>>>> 30c13dcd93a9286b99fe7331a57ec1fa060a3e1c

app.listen(8800);
