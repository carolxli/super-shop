import React from "react";
import FormDespesa from "../components/FormDespesa.js";
import { useNavigate } from "react-router-dom";

const CadastrarDespesa = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/despesa");
  };

  return (
    <div>
      {/* <h2>Cadastrar Nova Despesa</h2> */}
      <FormDespesa onSuccess={handleSuccess} />
    </div>
  );
};

export default CadastrarDespesa;
