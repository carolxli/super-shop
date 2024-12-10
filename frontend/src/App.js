import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/header.js";
import Home from "./pages/home.js";
import Fornecedor from "./pages/fornecedor.js";
import ListarFornecedores from "./pages/ListarFornecedores.js";
import ListarClientes from "./pages/ListarClientes.js";
import EditarCliente from "./pages/EditarCliente.js";
import EditarFornecedor from "./pages/EditarFornecedor.js";
import Pessoa from "./pages/pessoa.js";
import Produto from "./pages/produto.js";
import Cliente from "./pages/cliente.js";
import ListarProdutos from "./pages/listarProdutos.js";
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
import Categoria from "./pages/categoria.js"; // Nova página
import ListarCategorias from "./pages/ListarCategorias.js"; // Nova página
import EditarCategoria from "./pages/EditarCategoria.js"; // Nova página
import Marca from "./pages/marca.js"; // Nova página
import ListarMarcas from "./pages/ListarMarcas.js"; // Nova página
import EditarMarca from "./pages/EditarMarca.js"; // Nova página
import Login from "./pages/Login.js";
import PrivateRoute from "./utils/PrivateRoute.js";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/AuthContext";


const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Router>

        {isAuthenticated && <Header />}
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
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

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

          <Route
            path="/cliente"
            element={
              <PrivateRoute>
                <Cliente />
              </PrivateRoute>
            }
          />
          <Route
            path="/listar-clientes"
            element={
              <PrivateRoute>
                <ListarClientes />
              </PrivateRoute>
            }
          />
          <Route
            path="/editarCliente/:idCliente"
            element={
              <PrivateRoute>
                <EditarCliente />
              </PrivateRoute>
            }
          />

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
          {/* Rotas de Categoria */}
          <Route
            path="/listar-categorias"
            element={
              <PrivateRoute>
                <ListarCategorias />
              </PrivateRoute>
            }
          />
          <Route
            path="/categoria"
            element={
              <PrivateRoute>
                <Categoria />
              </PrivateRoute>
            }
          />
          <Route
            path="/editarCategoria/:idCategoria"
            element={
              <PrivateRoute>
                <EditarCategoria />
              </PrivateRoute>
            }
          />
          <Route
            path="/listar-marcas"
            element={
              <PrivateRoute>
                <ListarMarcas />
              </PrivateRoute>
            }
          />
          <Route
            path="/marca"
            element={
              <PrivateRoute>
                <Marca />
              </PrivateRoute>
            }
          />
          <Route
            path="/editarMarca/:idMarca"
            element={
              <PrivateRoute>
                <EditarMarca />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      <GlobalStyle />
    </>
  );
};

export default App;
