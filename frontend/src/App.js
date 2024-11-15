import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/header.js";
import Home from "./pages/home.js";
import Fornecedor from "./pages/fornecedor.js";
import ListarFornecedores from "./pages/ListarFornecedores.js";
import EditarFornecedor from "./pages/EditarFornecedor.js";
import Pessoa from "./pages/pessoa.js";
import Produto from "./pages/produto.js";
import ListarProdutos from "./pages/ListarProdutos.js";
import EditarProduto from "./pages/EditarProduto.js";
import ListarPessoas from "./pages/ListarPessoas.js";
import GlobalStyle from "./styles/globalstyle.js";
import EditarPessoa from "./pages/EditarPessoa.js";
import Despesa from "./pages/Despesa.js";
import ListarDespesas from "./pages/ListarDespesa.js";
import EditarDespesa from "./pages/EditarDespesa.js";
import Login from "./pages/Login.js";
import PrivateRoute from "./utils/PrivateRoute.js"; // Importa o componente de rota privada

const App = () => {
  return (
    <Router>
      <GlobalStyle />
      <Header />
      <Routes>
        {/* Rota pública para Login */}
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        {/* Fornecedor */}
        <Route
          path="/fornecedor"
          element={
            <PrivateRoute>
              <Fornecedor />
            </PrivateRoute>
          }
        />
        <Route
          path="/listar-fornecedores"
          element={
            <PrivateRoute>
              <ListarFornecedores />
            </PrivateRoute>
          }
        />
        <Route
          path="/editarFornecedor/:idFornecedor"
          element={
            <PrivateRoute>
              <EditarFornecedor />
            </PrivateRoute>
          }
        />
        {/* Pessoa */}
        <Route
          path="/pessoa"
          element={
            <PrivateRoute>
              <Pessoa />
            </PrivateRoute>
          }
        />
        <Route
          path="/listar-pessoas"
          element={
            <PrivateRoute>
              <ListarPessoas />
            </PrivateRoute>
          }
        />
        <Route
          path="/editarPessoa/:idPessoa"
          element={
            <PrivateRoute>
              <EditarPessoa />
            </PrivateRoute>
          }
        />
        {/* Produto */}
        <Route
          path="/produto"
          element={
            <PrivateRoute>
              <Produto />
            </PrivateRoute>
          }
        />
        <Route
          path="/listar-produtos"
          element={
            <PrivateRoute>
              <ListarProdutos />
            </PrivateRoute>
          }
        />
        <Route
          path="/editarProduto/:idProduto"
          element={
            <PrivateRoute>
              <EditarProduto />
            </PrivateRoute>
          }
        />
        {/* Despesa */}
        <Route
          path="/despesa"
          element={
            <PrivateRoute>
              <Despesa />
            </PrivateRoute>
          }
        />
        <Route
          path="/listar-despesas"
          element={
            <PrivateRoute>
              <ListarDespesas />
            </PrivateRoute>
          }
        />
        <Route
          path="/editarDespesa/:idDespesa"
          element={
            <PrivateRoute>
              <EditarDespesa />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
