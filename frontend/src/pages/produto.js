// src/pages/produto.js
import React from 'react';
import FormProduto from '../components/FormProduto.js';

const Produto = () => {
    return (
        <div>
            <FormProduto />
            <a href="/listar-produtos"><button>Listar Produtos Cadastrados</button></a>
        </div>
    );
};

export default Produto;
