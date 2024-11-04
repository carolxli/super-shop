import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditarDespesa = () => {
  const { idDespesa } = useParams();
  const navigate = useNavigate();
  const [despesa, setDespesa] = useState({
    dt_despesa: "",
    dt_vencimento: "",
    valor: "",
    metodo_pgmto: "",
    descricao: "",
    status: "",
    idTipo: "",
  });

  useEffect(() => {
    const fetchDespesa = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/despesa/${idDespesa}`
        );
        const despesaData = response.data;
        setDespesa({
          ...despesaData,
          dt_despesa: despesaData.dt_despesa.split("T")[0],
          dt_vencimento: despesaData.dt_vencimento.split("T")[0],
        });
      } catch (err) {
        console.error(err);
        alert("Erro ao buscar despesa");
      }
    };
    fetchDespesa();
  }, [idDespesa]);

  const handleChange = (e) => {
    setDespesa({
      ...despesa,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmUpdate = window.confirm(
      "Você tem certeza que deseja atualizar esta despesa?"
    );
    if (!confirmUpdate) {
      return;
    }

    try {
      await axios.put(`http://localhost:8800/despesa/${idDespesa}`, despesa);
      alert("Despesa atualizada com sucesso!");
      navigate("/listar-despesas");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar despesa");
    }
  };

  return (
    <>
      <h3>Editar Despesa</h3>
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
          <button type="submit">Editar</button>
          <a href="/listar-despesas">
            <button type="button">Cancelar</button>
          </a>
        </div>
      </form>
    </>
  );
};

export default EditarDespesa;
