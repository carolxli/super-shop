import React from 'react';

const Home = () => {
    return (
        <div>
            <h1>Bem-vindo ao SuperShop</h1>
            <p>Escolha uma das opções abaixo para cadastrar:</p>
            <button onClick={() => window.location.href='/fornecedor'}>Cadastrar Fornecedor</button>
            <button onClick={() => window.location.href='/pessoa'}>Cadastrar Pessoa</button>
            <button onClick={() => window.location.href='/produto'}>Cadastrar Produto</button>
        </div>
    );
};

export default Home;
