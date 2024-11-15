import React, { useState, useEffect } from "react";
import axios from "axios";
import InputMask from "react-input-mask";

const FormDespesa = () => {
  const [despesa, setDespesa] = useState({
    dt_despesa: "",
    dt_vencimento: "",
    valor: "",
    metodo_pgmto: "",
    descricao: "",
    data_quitacao: "",
    idTipo: "",
  });

  const [tiposDespesas, setTiposDespesas] = useState([]);

  useEffect(() => {
    // Buscar tipos de despesas do backend
    const fetchTipos = async () => {
      try {
        const response = await axios.get("http://localhost:8800/tipos-despesa");
        setTiposDespesas(response.data);
      } catch (err) {
        console.error(err);
        alert("Erro ao buscar tipos de despesa");
      }
    };
    fetchTipos();
  }, []);

  const handleChange = (e) => {
    setDespesa({
      ...despesa,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Converter datas para o formato ISO (AAAA-MM-DD) antes de enviar
      const despesaConvertida = {
        ...despesa,
        dt_despesa: despesa.dt_despesa,
        dt_vencimento: despesa.dt_vencimento,
        data_quitacao: despesa.data_quitacao,
        valor: parseFloat(despesa.valor),
      };
      await axios.post("http://localhost:8800/despesa", despesaConvertida);
      alert("Despesa cadastrada com sucesso!");
      setDespesa({
        dt_despesa: "",
        dt_vencimento: "",
        valor: "",
        metodo_pgmto: "",
        descricao: "",
        data_quitacao: "",
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
          <InputMask
            mask="99/99/9999"
            value={despesa.dt_despesa}
            onChange={handleChange}
            placeholder="DD/MM/AAAA"
            required
          >
            {(inputProps) => <input type="text" {...inputProps} />}
          </InputMask>
        </label>

        <label>
          Data de Vencimento
          <InputMask
            mask="99/99/9999"
            value={despesa.dt_vencimento}
            onChange={handleChange}
            placeholder="DD/MM/AAAA"
            required
          >
            {(inputProps) => <input type="text" {...inputProps} />}
          </InputMask>
        </label>

        <label>
          Data de Quitação
          <InputMask
            mask="99/99/9999"
            value={despesa.data_quitacao}
            onChange={handleChange}
            placeholder="DD/MM/AAAA"
            required
          >
            {(inputProps) => <input type="text" {...inputProps} />}
          </InputMask>
        </label>

        <label>
          Valor
          <input
            type="number"
            name="valor"
            value={despesa.valor}
            onChange={handleChange}
            required
            step="0.01"
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
          Tipo de Despesa
          <select
            name="idTipo"
            value={despesa.idTipo}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            {tiposDespesas.map((tipo) => (
              <option key={tipo.idTipo} value={tipo.idTipo}>
                {tipo.nome_tipo}
              </option>
            ))}
          </select>
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
    </>
  );
};

export default FormDespesa;
