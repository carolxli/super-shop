import express from "express";
import routerProd from "./routes/rtProduto.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/Produto", routerProd);

app.listen(8800);