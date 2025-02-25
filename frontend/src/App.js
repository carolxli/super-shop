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
import Categoria from "./pages/categoria.js";
import ListarCategorias from "./pages/ListarCategorias.js";
import EditarCategoria from "./pages/EditarCategoria.js";
import Marca from "./pages/marca.js";
import ListarMarcas from "./pages/ListarMarcas.js";
import EditarMarca from "./pages/EditarMarca.js";
import Login from "./pages/Login.js";
import PrivateRoute from "./utils/PrivateRoute.js";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/AuthContext";
import ListarComissao from "./pages/ListarComissao.js";
import Comissao from "./pages/comissao.js";
import Usuario from "./pages/usuario.js";
import ListarUsuarios from "./pages/ListarUsuario.js";
import EditarUsuario from "./pages/EditarUsuario.js";
import ChangePassword from "./components/ChangePassword.jsx";
const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Router>
        {isAuthenticated && <Header />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/change-password" element={<ChangePassword />} />{" "}
          {/* Adicione esta linha */}
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
            path="/usuario"
            element={
              <PrivateRoute>
                <Usuario />
              </PrivateRoute>
            }
          />
          <Route
            path="/listar-usuarios"
            element={
              <PrivateRoute>
                <ListarUsuarios />
              </PrivateRoute>
            }
          />
          <Route
            path="/editarUsuario/:idUsuario"
            element={
              <PrivateRoute>
                <EditarUsuario />
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
          {/* Comissão */}
          <Route
            path="/comissao"
            element={
              <PrivateRoute>
                <ListarComissao />
              </PrivateRoute>
            }
          />
          <Route
            path="/cadastrarComissao"
            element={
              <PrivateRoute>
                <Comissao />
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
