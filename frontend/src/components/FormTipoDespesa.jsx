// frontend/src/components/FormTipoDespesa.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FormTipoDespesa = ({ onCriar }) => {
  const [nomeTipo, setNomeTipo] = useState("");
  const [descricaoTipo, setDescricaoTipo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomeTipo.trim()) {
      toast.error("O nome do tipo é obrigatório");
      return;
    }

    try {
      await axios.post("http://localhost:8800/tipos-despesa", {
        nome_tipo: nomeTipo,
        descricao_tipo: descricaoTipo,
      });
      toast.success("Tipo de despesa criado com sucesso!");
      setNomeTipo("");
      setDescricaoTipo("");
      onCriar(); // Atualiza a lista após criação
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(`Erro: ${err.response.data.error}`);
      } else {
        toast.error("Erro ao criar tipo de despesa");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>Cadastrar Novo Tipo de Despesa</h3>
      <div>
        <label>Nome do Tipo:</label>
        <input
          type="text"
          value={nomeTipo}
          onChange={(e) => setNomeTipo(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Descrição:</label>
        <textarea
          value={descricaoTipo}
          onChange={(e) => setDescricaoTipo(e.target.value)}
        />
      </div>
      <button type="submit">Cadastrar</button>
    </form>
  );
};

export default FormTipoDespesa;