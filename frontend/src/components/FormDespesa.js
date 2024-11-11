import React, { useState } from "react";
import axios from "axios";

const FormDespesa = () => {
  const [despesa, setDespesa] = useState({
    dt_despesa: "",
    dt_vencimento: "",
    valor: "",
    metodo_pgmto: "",
    descricao: "",
    status: "",
    idTipo: "",
  });

  const handleChange = (e) => {
    setDespesa({
      ...despesa,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/despesa", despesa);
      alert("Despesa cadastrada com sucesso!");
      setDespesa({
        dt_despesa: "",
        dt_vencimento: "",
        valor: "",
        metodo_pgmto: "",
        descricao: "",
        status: "",
        idTipo: "",
      });
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar despesa");
    }
  };

  return (
    <>
      <h3>Cadastrar Despesa</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Data da Despesa
          <input
            type="date"
            name="dt_despesa"
            value={despesa.dt_despesa}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Data de Vencimento
          <input
            type="date"
            name="dt_vencimento"
            value={despesa.dt_vencimento}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Valor
          <input
            type="number"
            name="valor"
            value={despesa.valor}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Método de Pagamento
          <input
            type="text"
            name="metodo_pgmto"
            value={despesa.metodo_pgmto}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Descrição
          <textarea
            name="descricao"
            value={despesa.descricao}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Status
          <input
            type="text"
            name="status"
            value={despesa.status}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          ID do Tipo
          <input
            type="number"
            name="idTipo"
            value={despesa.idTipo}
            onChange={handleChange}
            required
          />
        </label>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: "20px",
          }}
        >
          <button type="submit">Cadastrar</button>
          <a href="/">
            <button type="button">Cancelar</button>
          </a>
        </div>
      </form>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginTop: "10px",
        }}
      >
        {/* <a href="/listar-despesas">
          <button>Listar Despesas Cadastradas</button>
        </a> */}
      </div>
    </>
  );
};

export default FormDespesa;
