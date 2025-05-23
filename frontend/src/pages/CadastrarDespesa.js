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
      <FormDespesa onSuccess={handleSuccess} />
    </div>
  );
};

export default CadastrarDespesa;
