// frontend/src/pages/ListarDespesa.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ListarDespesa = () => {
  const [despesas, setDespesas] = useState([]);
  const [tiposDespesa, setTiposDespesa] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDespesas();
    fetchTiposDespesa();
  }, []);

  const fetchDespesas = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8800/despesa");
      console.log("Despesas:", response.data); // Log para depuração
      setDespesas(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao buscar despesas");
    }
    setLoading(false);
  };

  const fetchTiposDespesa = async () => {
    try {
      // **Use o endpoint correto aqui**
      const response = await axios.get("http://localhost:8800/tipos-despesa");
      console.log("Tipos de Despesa:", response.data); // Log para depuração
      setTiposDespesa(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao buscar tipos de despesa");
    }
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
      <h2>Listar Despesas</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome da Despesa</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(despesas) && despesas.length > 0 ? (
              despesas.map((despesa) => {
                const tipo = tiposDespesa.find(
                  (t) => t.idTipo === despesa.tipoDespesa_id
                );
                return (
                  <tr key={despesa.idDespesa}>
                    <td>{despesa.idDespesa}</td>
                    <td>{despesa.nome_despesa}</td>
                    <td>{tipo ? tipo.nome_tipo : "Desconhecido"}</td>
                    <td>{despesa.valor.toFixed(2)}</td>
                    <td>
                      <button onClick={() => handleEditar(despesa.idDespesa)}>
                        Editar
                      </button>
                      <button onClick={() => handleDeletar(despesa.idDespesa)}>
                        Deletar
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5">Nenhuma despesa encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListarDespesa;
