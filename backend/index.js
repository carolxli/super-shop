import express from "express";
import routerProd from "./routes/RtProduto";
import cors from "cors";


const app = express();

app.use(express.json());
app.use(cors());

app.use("/produtos", routerProd);

app.listen(8800);