// frontend/src/components/FormTipoDespesa.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FormTipoDespesa = ({ initialData = {}, onSuccess }) => {
  const [tipoDespesa, setTipoDespesa] = useState({
    nome_tipo: initialData.nome_tipo || "",
    descricao_tipo: initialData.descricao_tipo || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTipoDespesa((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!tipoDespesa.nome_tipo.trim()) {
      toast.error("O nome do tipo de despesa é obrigatório.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      let response;
      if (initialData.idTipo) {
        // Atualizar tipo de despesa existente
        response = await axios.put(
          `http://localhost:8800/tipos-despesa/${initialData.idTipo}`,
          tipoDespesa
        );
        toast.success("Tipo de despesa atualizado com sucesso!");
      } else {
        // Criar novo tipo de despesa
        response = await axios.post("http://localhost:8800/tipos-despesa", tipoDespesa);
        toast.success("Tipo de despesa criado com sucesso!");
      }
      console.log("Resposta do servidor:", response.data); // Log para depuração
      setTipoDespesa({
        nome_tipo: "",
        descricao_tipo: "",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Erro ao cadastrar/atualizar tipo de despesa:", err);
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(`Erro: ${err.response.data.error}`);
      } else {
        toast.error("Erro ao cadastrar/atualizar tipo de despesa.");
      }
    }
  };

  return (
    <div>
      <h2>
        {initialData.idTipo ? "Editar Tipo de Despesa" : "Cadastrar Novo Tipo de Despesa"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome do Tipo:</label>
          <input
            type="text"
            name="nome_tipo"
            value={tipoDespesa.nome_tipo}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea
            name="descricao_tipo"
            value={tipoDespesa.descricao_tipo}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit">
          {initialData.idTipo ? "Atualizar" : "Cadastrar"}
        </button>
      </form>
    </div>
  );
};

export default FormTipoDespesa;