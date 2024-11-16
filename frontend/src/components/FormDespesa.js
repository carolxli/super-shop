import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FormDespesa = () => {
  const [despesa, setDespesa] = useState({
    dt_despesa: "",
    dt_vencimento: "",
    valor: "",
    metodo_pgmto: "",
    descricao: "",
    status: "",
    Tipo_idTipo: "",
  });

  const [tiposDespesa, setTiposDespesa] = useState([]);

  useEffect(() => {
    const fetchTiposDespesa = async () => {
      try {
        const response = await axios.get("http://localhost:8800/tipos-despesa");
        setTiposDespesa(response.data);
      } catch (err) {
        console.error("Erro ao buscar tipos de despesa:", err);
        toast.error("Erro ao buscar tipos de despesa");
      }
    };

    fetchTiposDespesa();
  }, []);

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
      const response = await axios.post(
        "http://localhost:8800/despesa",
        despesa
      );
      toast.success("Despesa cadastrada com sucesso!");
      console.log("Resposta do servidor:", response.data);
      setDespesa({
        dt_despesa: "",
        dt_vencimento: "",
        valor: "",
        metodo_pgmto: "",
        descricao: "",
        status: "",
        Tipo_idTipo: "",
      });
    } catch (err) {
      console.error("Erro ao cadastrar despesa:", err);
      toast.error("Erro ao cadastrar despesa.");
    }
  };

  return (
    <div>
      <h2>Cadastrar Despesa</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Data da Despesa:</label>
          <input
            type="date"
            name="dt_despesa"
            value={despesa.dt_despesa}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Data de Vencimento:</label>
          <input
            type="date"
            name="dt_vencimento"
            value={despesa.dt_vencimento}
            onChange={handleChange}
            required
          />
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
          <label>Método de Pagamento:</label>
          <input
            type="text"
            name="metodo_pgmto"
            value={despesa.metodo_pgmto}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea
            name="descricao"
            value={despesa.descricao}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <input
            type="text"
            name="status"
            value={despesa.status}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Tipo de Despesa:</label>
          <select
            name="Tipo_idTipo"
            value={despesa.Tipo_idTipo}
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
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default FormDespesa;
