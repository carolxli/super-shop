import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const cargo = localStorage.getItem("cargo"); // Recupera o cargo do localStorage

  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        {cargo === "admin" && (
          <>
            <div className="dropdown">
              <Link to="/pessoa">Pessoa</Link>
              <div className="dropdown-content">
                <Link to="/cliente">Cliente</Link>
                <Link to="/fornecedor">Fornecedor</Link>
                <Link to="/usuario">Usuário</Link>
              </div>
            </div>
            <div className="dropdown">
              <Link to="/despesa">Despesa</Link>
              <div className="dropdown-content">
                <Link to="/tipos-despesa">Tipos de Despesa</Link>
              </div>
            </div>
          </>
        )}
        {cargo === "admin" || cargo === "vendedor" ? (
          <div className="dropdown">
          <Link to="/produto">Produto</Link>
          <div className="dropdown-content">
            <Link to="/categoria">Categorias</Link>
            <Link to="/marca">Marcas</Link>
          </div>
        </div>
        ) : null}
      </nav>
    </header>
  );
};

export default Header;