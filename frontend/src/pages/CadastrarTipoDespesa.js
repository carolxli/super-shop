import React from "react";
import FormTipoDespesa from "../components/FormTipoDespesa.js";
import { useNavigate } from "react-router-dom";

const CadastrarTipoDespesa = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/tipos-despesa"); 
  };

  return (
    <div>
      <h2>Cadastrar Novo Tipo de Despesa</h2>
      <FormTipoDespesa onSuccess={handleSuccess} />
    </div>
  );
};

export default CadastrarTipoDespesa;
