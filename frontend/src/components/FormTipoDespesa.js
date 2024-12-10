import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const FormTipoDespesa = () => {
  const { idTipo } = useParams();
  const navigate = useNavigate();

  const [tipoDespesa, setTipoDespesa] = useState({
    nome_tipo: "",
    descricao_tipo: "",
  });

  useEffect(() => {
    if (idTipo) {
      const fetchTipoDespesa = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8800/tipos-despesa/${idTipo}`
          );
          setTipoDespesa(response.data);
        } catch (err) {
          console.error("Erro ao carregar tipo de despesa:", err);
          toast.error("Erro ao carregar tipo de despesa.");
        }
      };

      fetchTipoDespesa();
    }
  }, [idTipo]);

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
      if (idTipo) {
        await axios.put(
          `http://localhost:8800/tipos-despesa/${idTipo}`,
          tipoDespesa
        );
        toast.success("Tipo de despesa atualizado com sucesso!");
      } else {
        await axios.post("http://localhost:8800/tipos-despesa", tipoDespesa);
        toast.success("Tipo de despesa criado com sucesso!");
        navigate("/listarTipoDespesa");
      }

      // Redireciona para a listagem após sucesso
      navigate("/listarTipoDespesa");
    } catch (err) {
      console.error("Erro ao salvar tipo de despesa:", err);
      toast.error("Erro ao salvar tipo de despesa.");
    }
  };

  return (
    <div>
      <h2>{idTipo ? "Editar Tipo de Despesa" : "Cadastrar Novo Tipo de Despesa"}</h2>
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
          {idTipo ? "Atualizar" : "Cadastrar"}
        </button>
      </form>
    </div>
  );
};

export default FormTipoDespesa;