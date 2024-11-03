import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/fornecedor">Fornecedor</Link>
                <Link to="/pessoa">Pessoa</Link>
                <Link to="/produto">Produto</Link>
            </nav>
        </header>
    );
};

export default Header;
