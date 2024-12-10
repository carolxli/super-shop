import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const FormDespesa = ({ idDespesa }) => {
  const navigate = useNavigate();
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
    const fetchDespesa = async () => {
      if (!idDespesa) return; // Não busca se for cadastro
      try {
        const response = await axios.get(
          `http://localhost:8800/despesa/${idDespesa}`
        );
        setDespesa({
          descricao: response.data.descricao || "",
          Tipo_idTipo: response.data.Tipo_idTipo || "",
          valor: response.data.valor || "",
          dt_despesa: response.data.dt_despesa || "",
          dt_vencimento: response.data.dt_vencimento || "",
          metodo_pgmto: response.data.metodo_pgmto || "",
          status: response.data.status || "",
        });
      } catch (err) {
        console.error("Erro ao buscar despesa:", err);
        toast.error("Erro ao buscar despesa.");
      }
    };

    const fetchTiposDespesa = async () => {
      try {
        const response = await axios.get("http://localhost:8800/tipos-despesa");
        setTiposDespesa(response.data);
      } catch (err) {
        console.error("Erro ao buscar tipos de despesa:", err);
        toast.error("Erro ao buscar tipos de despesa.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !despesa.descricao ||
      !despesa.Tipo_idTipo ||
      !despesa.valor ||
      !despesa.dt_despesa ||
      !despesa.metodo_pgmto ||
      !despesa.status
    ) {
      toast.error("Todos os campos são obrigatórios.");
      return;
    }

    try {
      if (idDespesa) {
        await axios.put(`http://localhost:8800/despesa/${idDespesa}`, despesa);
        toast.success("Despesa atualizada com sucesso!");
      } else {
        await axios.post("http://localhost:8800/despesa", despesa);
        toast.success("Despesa cadastrada com sucesso!");
        navigate("/despesa");
      }
    } catch (err) {
      console.error("Erro ao salvar despesa:", err);
      toast.error(
        "Erro ao salvar despesa. Verifique os dados e tente novamente."
      );
    }
  };

  return (
    <div>
      <h2>{idDespesa ? "Editar Despesa" : "Cadastrar Despesa"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Descrição:
          <input
            type="text"
            name="descricao"
            value={despesa.descricao}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Data da Despesa:
          <input
            type="date"
            name="dt_despesa"
            value={despesa.dt_despesa}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Data de Vencimento:
          <input
            type="date"
            name="dt_vencimento"
            value={despesa.dt_vencimento}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Valor:
          <input
            type="number"
            name="valor"
            value={despesa.valor}
            onChange={handleChange}
            required
            step="0.01"
            min="0.01"
          />
        </label>
        <label>
          Método de Pagamento:
          <select
            name="metodo_pgmto"
            value={despesa.metodo_pgmto}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um método</option>
            <option value="Cartão">Cartão</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Pix">Pix</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Boleto">Boleto</option>
          </select>
        </label>
        <label>
          Status:
          <select
            name="status"
            value={despesa.status}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um status</option>
            <option value="Pago">Pago</option>
            <option value="Pendente">Pendente</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </label>
        <label>
          Tipo de Despesa:
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
        </label>
        <button type="submit">{idDespesa ? "Atualizar" : "Cadastrar"}</button>
      </form>
    </div>
  );
};

export default FormDespesa;
