import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const cargo = localStorage.getItem("cargo"); // Recupera o cargo do localStorage

  const { logout } = useAuth();
  const handleLogoff = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    localStorage.removeItem("cargo");
    logout();
  };
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
              <Link to="/comissao">Comissão</Link>
            </div>
          </div>
        ) : null}

        <Link onClick={handleLogoff}>Sair</Link>
      </nav>
    </header>
  );
};

export default Header;