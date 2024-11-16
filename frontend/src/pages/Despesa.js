// frontend/src/pages/Despesa.js
import React from "react";
import { Link } from "react-router-dom";

const Despesa = () => {
  return (
    <div>
      <h1>Bem-vindo à Gestão de Despesas</h1>
      <Link to="/cadastrarDespesa">Cadastrar Nova Despesa</Link>
      {/* Adicione mais conteúdo conforme necessário */}
    </div>
  );
};

export default Despesa;
