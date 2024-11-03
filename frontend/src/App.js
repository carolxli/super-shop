// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header.js';
import Home from './pages/home.js';
import Fornecedor from './pages/fornecedor.js';
import Pessoa from './pages/pessoa.js';
import Produto from './pages/produto.js';
import ListarProdutos from './pages/listarProdutos.js'; // Importar a nova página
import EditarProduto from './pages/EditarProduto.js';
import GlobalStyle from './styles/globalstyle.js';

const App = () => {
    return (
        <Router>
            <GlobalStyle />
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/fornecedor" element={<Fornecedor />} />
                <Route path="/pessoa" element={<Pessoa />} />
                <Route path="/produto" element={<Produto />} />
                <Route path="/listar-produtos" element={<ListarProdutos />} />
                <Route path="/editarProduto/:idProduto" element={<EditarProduto />} />
            </Routes>
        </Router>
    );
};

export default App;
