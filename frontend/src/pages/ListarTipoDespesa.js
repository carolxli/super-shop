// frontend/src/pages/ListarTipoDespesa.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import FormTipoDespesa from "../components/FormTipoDespesa.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ListarTipoDespesa = () => {
  const [tiposDespesa, setTiposDespesa] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTiposDespesa();
  }, []);

  const fetchTiposDespesa = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8800/tipos-despesa");
      setTiposDespesa(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao buscar tipos de despesa");
    }
    setLoading(false);
  };

  const handleEditar = (idTipo) => {
    navigate(`/editarTipoDespesa/${idTipo}`);
  };

  const handleDeletar = async (idTipo) => {
    if (
      window.confirm("Tem certeza que deseja deletar este tipo de despesa?")
    ) {
      try {
        await axios.delete(`http://localhost:8800/tipos-despesa/${idTipo}`);
        toast.success("Tipo de despesa deletado com sucesso!");
        fetchTiposDespesa();
      } catch (err) {
        console.error(err);
        toast.error("Erro ao deletar tipo de despesa");
      }
    }
  };

  return (
    <div>
      <h2>Tipos de Despesa</h2>
      <FormTipoDespesa onCriar={fetchTiposDespesa} />
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome do Tipo</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tiposDespesa.map((tipo) => (
              <tr key={tipo.idTipo}>
                <td>{tipo.idTipo}</td>
                <td>{tipo.nome_tipo}</td>
                <td>{tipo.descricao_tipo}</td>
                <td>
                  <button onClick={() => handleEditar(tipo.idTipo)}>
                    Editar
                  </button>
                  <button onClick={() => handleDeletar(tipo.idTipo)}>
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListarTipoDespesa;
