import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        <div className="dropdown">
          <Link to="/pessoa">Pessoa</Link>
          <div className="dropdown-content">
            <Link to="/fornecedor">Fornecedor</Link>
          </div>
        </div>
        <Link to="/produto">Produto</Link>
        <div className="dropdown">
          <Link to="/despesa">Despesa</Link>
          <div className="dropdown-content">
            <Link to="/despesa">Despesa</Link>
            <Link to="/tipos-despesa">Tipos de Despesa</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
