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
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");

  useEffect(() => {
    const fetchResultados = async () => {
      if (!filtroNome.trim()) {
        setResultadosBusca([]);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:8800/tipos-despesa?nome_tipo_like=${filtroNome}`
        );
        setResultadosBusca(response.data);
      } catch (err) {
        console.error("Erro ao buscar tipos de despesa:", err);
        toast.error("Erro ao buscar tipos de despesa.");
      }
    };

    fetchResultados();
  }, [filtroNome]);

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
        window.alert("Tipo de despesa atualizado com sucesso!");
        toast.success("Tipo de despesa atualizado com sucesso!");
      } else {
        await axios.post("http://localhost:8800/tipos-despesa", tipoDespesa);
        window.alert("Tipo de despesa criado com sucesso!");
        toast.success("Tipo de despesa criado com sucesso!");
      }

      navigate(-1);
    } catch (err) {
      console.error("Erro ao salvar tipo de despesa:", err);
      window.alert(
        "Erro ao salvar tipo de despesa. Verifique os dados e tente novamente."
      );
      toast.error("Erro ao salvar tipo de despesa.");
    }
  };

  return (
    <div>
      <h2>
        {idTipo ? "Editar Tipo de Despesa" : "Cadastrar Novo Tipo de Despesa"}
      </h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nome do Tipo:
          <input
            type="text"
            name="nome_tipo"
            value={tipoDespesa.nome_tipo}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Descrição:
          <textarea
            name="descricao_tipo"
            value={tipoDespesa.descricao_tipo}
            onChange={handleChange}
          ></textarea>
        </label>
        <button type="submit">{idTipo ? "Atualizar" : "Cadastrar"}</button>
      </form>
    </div>
  );
};

export default FormTipoDespesa;
