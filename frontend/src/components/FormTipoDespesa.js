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

  // Atualiza os resultados conforme o campo "nome_tipo" é alterado
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

  const handleFiltroChange = (e) => {
    setFiltroNome(e.target.value);
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
      }

      navigate("/listarTipoDespesa");
    } catch (err) {
      console.error("Erro ao salvar tipo de despesa:", err);
      toast.error("Erro ao salvar tipo de despesa.");
    }
  };

  return (
    <div>
      <div>
        <label>Filtrar por Nome:</label>
        <input type="text" value={filtroNome} onChange={handleFiltroChange} />
      </div>

      {resultadosBusca.length > 0 && (
        <table
          border="1"
          cellPadding="5"
          cellSpacing="0"
          style={{ marginTop: "10px" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome do Tipo</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            {resultadosBusca.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.nome_tipo}</td>
                <td>{item.descricao_tipo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ marginTop: "20px" }}>
        {idTipo ? "Editar Tipo de Despesa" : "Cadastrar Novo Tipo de Despesa"}
      </h2>
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
        <button type="submit">{idTipo ? "Atualizar" : "Cadastrar"}</button>
      </form>
    </div>
  );
};

export default FormTipoDespesa;
