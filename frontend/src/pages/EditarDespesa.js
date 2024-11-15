// frontend/src/pages/EditarDespesa.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditarDespesa = () => {
  const { idDespesa } = useParams(); // Captura o ID da despesa da URL
  const navigate = useNavigate();

  const [despesa, setDespesa] = useState(null); // Estado para a despesa específica
  const [tiposDespesa, setTiposDespesa] = useState([]); // Estado para os tipos de despesa
  const [loading, setLoading] = useState(true); // Estado para controle de carregamento

  useEffect(() => {
    fetchDespesa();
    fetchTiposDespesa();
  }, []);

  const fetchDespesa = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/despesa/${idDespesa}`
      );
      console.log("Despesa Recebida:", response.data); // Log para depuração
      setDespesa(response.data); // Assegure-se de que response.data é um objeto
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar a despesa:", err);
      toast.error("Erro ao buscar a despesa");
      setLoading(false);
    }
  };

  const fetchTiposDespesa = async () => {
    try {
      // **Certifique-se de usar o endpoint correto sem o "s" no final**
      const response = await axios.get("http://localhost:8800/tipos-despesa");
      console.log("Tipos de Despesa Recebidos:", response.data); // Log para depuração
      setTiposDespesa(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Erro ao buscar tipos de despesa:", err);
      toast.error("Erro ao buscar tipos de despesa");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDespesa((prevDespesa) => ({
      ...prevDespesa,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8800/despesa/${idDespesa}`, despesa);
      toast.success("Despesa atualizada com sucesso!");
      navigate("/listar-despesas"); // Redireciona para a lista de despesas
    } catch (err) {
      console.error("Erro ao atualizar a despesa:", err);
      toast.error("Erro ao atualizar a despesa");
    }
  };

  if (loading && !despesa) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h2>Editar Despesa</h2>
      {despesa ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nome da Despesa:</label>
            <input
              type="text"
              name="nome_despesa"
              value={despesa.nome_despesa || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Tipo de Despesa:</label>
            <select
              name="tipoDespesa_id"
              value={despesa.tipoDespesa_id || ""}
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
              value={despesa.valor || ""}
              onChange={handleChange}
              required
              step="0.01"
            />
          </div>
          <button type="submit">Atualizar</button>
        </form>
      ) : (
        <p>Despesa não encontrada.</p>
      )}
    </div>
  );
};

export default EditarDespesa;
