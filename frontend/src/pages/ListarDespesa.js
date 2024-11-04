import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ListarDespesas = () => {
  const navigate = useNavigate();
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDespesas = async () => {
      try {
        const response = await axios.get("http://localhost:8800/despesa");
        console.log("Resposta da API:", response.data);
        setDespesas(response.data.rows || response.data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar despesas", err);
        setError("Erro ao carregar despesas.");
        setLoading(false);
      }
    };

    fetchDespesas();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Você tem certeza que deseja deletar esta despesa?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8800/despesa/${id}`);
        setDespesas(despesas.filter((despesa) => despesa.idDespesa !== id));
      } catch (err) {
        console.error("Erro ao deletar despesa", err);
        alert("Erro ao deletar despesa. Tente novamente.");
      }
    }
  };

  if (loading) {
    return <div>Carregando despesas...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <h2>Lista de Despesas</h2>
      <table>
        <thead>
          <tr>
            <th>Data da Despesa</th>
            <th>Data de Vencimento</th>
            <th>Valor</th>
            <th>Método de Pagamento</th>
            <th>Descrição</th>
            <th>Status</th>
            <th>ID Tipo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {despesas.length > 0 ? (
            despesas.map((despesa) => (
              <tr key={despesa.idDespesa}>
                <td>{despesa.dt_despesa}</td>
                <td>{despesa.dt_vencimento}</td>
                <td>{despesa.valor}</td>
                <td>{despesa.metodo_pgmto}</td>
                <td>{despesa.descricao}</td>
                <td>{despesa.status}</td>
                <td>{despesa.idTipo}</td>
                <td>
                  <button
                    onClick={() =>
                      navigate(`/editarDespesa/${despesa.idDespesa}`)
                    }
                  >
                    Editar
                  </button>
                  <button onClick={() => handleDelete(despesa.idDespesa)}>
                    Deletar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">Nenhuma despesa encontrada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default ListarDespesas;
