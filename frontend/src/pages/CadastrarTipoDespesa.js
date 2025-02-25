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
      <FormTipoDespesa onSuccess={handleSuccess} />
    </div>
  );
};

export default CadastrarTipoDespesa;
