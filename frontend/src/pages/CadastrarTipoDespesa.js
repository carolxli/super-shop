// frontend/src/pages/CadastrarTipoDespesa.js
import React from "react";
import FormTipoDespesa from "../components/FormTipoDespesa.jsx";
import { useNavigate } from "react-router-dom";

const CadastrarTipoDespesa = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/tipos-despesa"); // Redireciona para a listagem de tipos de despesa após sucesso
  };

  return (
    <div>
      <h2>Cadastrar Novo Tipo de Despesa</h2>
      <FormTipoDespesa onSuccess={handleSuccess} />
    </div>
  );
};

export default CadastrarTipoDespesa;
