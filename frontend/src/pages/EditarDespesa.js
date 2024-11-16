// frontend/src/pages/EditarDespesa.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditarDespesa = () => {
  const { idDespesa } = useParams();
  const navigate = useNavigate();

  const [despesa, setDespesa] = useState({
    nome_despesa: "",
    tipoDespesa_id: "",
    valor: "",
    data_despesa: "",
  });

  const [tiposDespesa, setTiposDespesa] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDespesa = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/despesa/${idDespesa}`
        );
        setDespesa({
          nome_despesa: response.data.descricao, // Mapeamento correto
          tipoDespesa_id: response.data.Tipo_idTipo,
          valor: response.data.valor,
          data_despesa: response.data.dt_despesa,
        });
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar a despesa:", err);
        toast.error("Erro ao buscar a despesa.");
        setLoading(false);
      }
    };

    const fetchTiposDespesa = async () => {
      try {
        const response = await axios.get("http://localhost:8800/tipos-despesa");
        setTiposDespesa(response.data);
      } catch (err) {
        console.error("Erro ao buscar tipos de despesa:", err);
        toast.error("Erro ao buscar tipos de despesa");
      }
    };

    fetchDespesa();
    fetchTiposDespesa();
  }, [idDespesa]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDespesa((prevDespesa) => ({
      ...prevDespesa,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!despesa.nome_despesa.trim()) {
      toast.error("O nome da despesa é obrigatório.");
      return false;
    }
    if (!despesa.tipoDespesa_id) {
      toast.error("Selecione um tipo de despesa.");
      return false;
    }
    if (!despesa.valor || isNaN(despesa.valor) || Number(despesa.valor) <= 0) {
      toast.error("Insira um valor válido e maior que zero.");
      return false;
    }
    if (!despesa.data_despesa) {
      toast.error("Insira a data da despesa.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log("Enviando dados atualizados para o backend:", despesa); // Log para depuração

    try {
      const response = await axios.put(
        `http://localhost:8800/despesa/${idDespesa}`,
        despesa
      );
      console.log("Resposta do servidor:", response.data); // Log para depuração
      toast.success("Despesa atualizada com sucesso!");
      navigate("/despesa"); // Navega para a rota correta
    } catch (err) {
      console.error("Erro ao atualizar despesa:", err);
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(`Erro: ${err.response.data.error}`);
      } else {
        toast.error("Erro ao atualizar despesa.");
      }
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h2>Editar Despesa</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome da Despesa:</label>
          <input
            type="text"
            name="nome_despesa"
            value={despesa.nome_despesa}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Tipo de Despesa:</label>
          <select
            name="tipoDespesa_id"
            value={despesa.tipoDespesa_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um tipo</option>
            {tiposDespesa.map((tipo) => (
              <option key={tipo.idTipo} value={tipo.idTipo}>
                {tipo.nome_tipo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Valor:</label>
          <input
            type="number"
            name="valor"
            value={despesa.valor}
            onChange={handleChange}
            required
            step="0.01"
            min="0.01"
          />
        </div>
        <div>
          <label>Data da Despesa:</label>
          <input
            type="date"
            name="data_despesa"
            value={despesa.data_despesa}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Atualizar</button>
      </form>
    </div>
  );
};

export default EditarDespesa;
