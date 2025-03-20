import React from "react";
import { useNavigate } from "react-router-dom";
import FormQuitarDespesa from "../components/FormQuitarDespesa";

const QuitarDespesa = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/despesa");
  };

  return (
    <div>
      <FormQuitarDespesa onSuccess={handleSuccess} />
    </div>
  );
};

export default QuitarDespesa;
