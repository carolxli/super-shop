// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header.js';
import Home from './pages/home.js';
import Fornecedor from './pages/fornecedor.js'; // Página de cadastro de fornecedores
import ListarFornecedores from './pages/ListarFornecedores.js'; // Importar a nova página para listar fornecedores
import EditarFornecedor from './pages/EditarFornecedor.js'; // Importar a página de edição de fornecedores
import Pessoa from './pages/pessoa.js';
import Produto from './pages/produto.js';
import ListarProdutos from './pages/ListarProdutos.js';
import EditarProduto from './pages/EditarProduto.js';
import ListarPessoas from './pages/ListarPessoas.js';
import GlobalStyle from './styles/globalstyle.js';
import EditarPessoa from './pages/EditarPessoa.js';

const App = () => {
    return (
        <Router>
            <GlobalStyle />
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/fornecedor" element={<Fornecedor />} />
                <Route path="/listar-fornecedores" element={<ListarFornecedores />} /> {/* Rota para listar fornecedores */}
                <Route path="/editarFornecedor/:idFornecedor" element={<EditarFornecedor />} /> {/* Rota para editar fornecedor */}
                <Route path="/pessoa" element={<Pessoa />} />
                <Route path="/produto" element={<Produto />} />
                <Route path="/listar-produtos" element={<ListarProdutos />} />
                <Route path="/editarProduto/:idProduto" element={<EditarProduto />} />
                <Route path="/listar-pessoas" element={<ListarPessoas />} />
                <Route path="/editarPessoa/:idPessoa" element={<EditarPessoa />} />
            </Routes>
        </Router>
    );
};

export default App;
