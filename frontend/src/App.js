// src/App.js
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
import EditarPessoa from "./pages/EditarPessoa.js";
import GlobalStyle from "./styles/globalstyle.js";
import ListarDespesa from "./pages/ListarDespesa.js";
import CadastrarDespesa from "./pages/CadastrarDespesa.js";
import EditarDespesa from "./pages/EditarDespesa.js";
import ListarTipoDespesa from "./pages/ListarTipoDespesa.js";
import CadastrarTipoDespesa from "./pages/CadastrarTipoDespesa.js";
import EditarTipoDespesa from "./pages/EditarTipoDespesa.js";
import Login from "./pages/Login.js";
import PrivateRoute from "./utils/PrivateRoute.js"; // Importa o componente de rota privada
import "react-toastify/dist/ReactToastify.css"; // Importa o CSS do react-toastify
import { useAuth } from "./context/AuthContext"; // Importa o contexto de autenticação


const App = () => {
  const { isAuthenticated } = useAuth(); // Verifica se o usuário está autenticado

  return (
    <Router>
      {isAuthenticated && <Header />} {/* Exibe o Header apenas se autenticado */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

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
        {/* Rotas para Despesas */}
        <Route
          path="/despesa"
          element={
            <PrivateRoute>
              <ListarDespesa />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastrarDespesa"
          element={
            <PrivateRoute>
              <CadastrarDespesa />
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

        {/* Rotas para Tipos de Despesa */}
        <Route
          path="/tipos-despesa"
          element={
            <PrivateRoute>
              <ListarTipoDespesa />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastrarTipoDespesa"
          element={
            <PrivateRoute>
              <CadastrarTipoDespesa />
            </PrivateRoute>
          }
        />
        <Route
          path="/editarTipoDespesa/:idTipo"
          element={
            <PrivateRoute>
              <EditarTipoDespesa />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
