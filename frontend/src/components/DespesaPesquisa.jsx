// src/components/DespesaPesquisa.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import InputMask from "react-input-mask";

const DespesaPesquisa = ({ onPesquisar }) => {
  const [filtros, setFiltros] = useState({
    dataInicio: "",
    dataFim: "",
    tipoDespesa: "",
    valorMin: "",
    valorMax: "",
    statusPagamento: "",
  });

  const [tiposDespesas, setTiposDespesas] = useState([]);

  useEffect(() => {
    // Buscar tipos de despesas do backend
    const fetchTipos = async () => {
      try {
        const response = await axios.get("http://localhost:8800/tipos-despesas");
        setTiposDespesas(response.data);
      } catch (err) {
        console.error(err);
        alert("Erro ao buscar tipos de despesas");
      }
    };
    fetchTipos();
  }, []);

  const handleChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPesquisar(filtros);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "850px", margin: "20px auto" }}>
      <h3>Pesquisar Despesas</h3>
      
      <label>
        Data de Início
        <InputMask
          mask="99/99/9999"
          value={filtros.dataInicio}
          onChange={handleChange}
          placeholder="DD/MM/AAAA"
        >
          {(inputProps) => <input type="text" {...inputProps} />}
        </InputMask>
      </label>

      <label>
        Data de Fim
        <InputMask
          mask="99/99/9999"
          value={filtros.dataFim}
          onChange={handleChange}
          placeholder="DD/MM/AAAA"
        >
          {(inputProps) => <input type="text" {...inputProps} />}
        </InputMask>
      </label>

      <label>
        Tipo de Despesa
        <select
          name="tipoDespesa"
          value={filtros.tipoDespesa}
          onChange={handleChange}
        >
          <option value="">Todos</option>
          {tiposDespesas.map((tipo) => (
            <option key={tipo.idTipo} value={tipo.idTipo}>
              {tipo.nome_tipo}
            </option>
          ))}
        </select>
      </label>

      <label>
        Valor Mínimo
        <input
          type="number"
          name="valorMin"
          value={filtros.valorMin}
          onChange={handleChange}
          placeholder="Valor Mínimo"
          step="0.01"
        />
      </label>

      <label>
        Valor Máximo
        <input
          type="number"
          name="valorMax"
          value={filtros.valorMax}
          onChange={handleChange}
          placeholder="Valor Máximo"
          step="0.01"
        />
      </label>

      <label>
        Status de Pagamento
        <select
          name="statusPagamento"
          value={filtros.statusPagamento}
          onChange={handleChange}
        >
          <option value="">Todos</option>
          <option value="pago">Pago</option>
          <option value="pendente">Pendente</option>
        </select>
      </label>

      <button type="submit">Pesquisar</button>
    </form>
  );
};

export default DespesaPesquisa;