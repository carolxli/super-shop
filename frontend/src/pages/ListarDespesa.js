// src/pages/ListarDespesa.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import DespesaPesquisa from "../components/DespesaPesquisa.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Para notificações

const ListarDespesa = () => {
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(false); // Indicador de carregamento
  const navigate = useNavigate();

  useEffect(() => {
    fetchDespesas();
  }, []);

  const fetchDespesas = async (filtros = {}) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8800/despesa", {
        params: filtros,
      });
      setDespesas(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao buscar despesas");
    }
    setLoading(false);
  };

  const handlePesquisar = (filtros) => {
    fetchDespesas(filtros);
  };

  const handleEditar = (idDespesa) => {
    navigate(`/editarDespesa/${idDespesa}`);
  };

  const handleDeletar = async (idDespesa) => {
    if (window.confirm("Tem certeza que deseja deletar esta despesa?")) {
      try {
        await axios.delete(`http://localhost:8800/despesa/${idDespesa}`);
        toast.success("Despesa deletada com sucesso!");
        fetchDespesas();
      } catch (err) {
        console.error(err);
        toast.error("Erro ao deletar despesa");
      }
    }
  };

  return (
    <div>
      <DespesaPesquisa onPesquisar={handlePesquisar} />
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Data da Despesa</th>
              <th>Data de Vencimento</th>
              <th>Data de Quitação</th>
              <th>Valor</th>
              <th>Método de Pagamento</th>
              <th>Descrição</th>
              <th>Tipo de Despesa</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {despesas.map((despesa) => (
              <tr key={despesa.idDespesa}>
                <td>{despesa.dt_despesa}</td>
                <td>{despesa.dt_vencimento}</td>
                <td>{despesa.data_quitacao || "Pendente"}</td>
                <td>{despesa.valor.toFixed(2)}</td>
                <td>{despesa.metodo_pgmto}</td>
                <td>{despesa.descricao}</td>
                <td>{despesa.idTipo}</td>
                <td>
                  <button onClick={() => handleEditar(despesa.idDespesa)}>
                    Editar
                  </button>
                  <button onClick={() => handleDeletar(despesa.idDespesa)}>
                    Excluir
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

export default ListarDespesa;
