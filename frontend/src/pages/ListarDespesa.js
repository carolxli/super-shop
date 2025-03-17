import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ListarDespesa = () => {
  const [despesas, setDespesas] = useState([]);
  const [filtroDescricao, setFiltroDescricao] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState({
    inicio: "",
    fim: "",
  });
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroValor, setFiltroValor] = useState("");

  useEffect(() => {
    const fetchDespesas = async () => {
      try {
        const response = await axios.get("http://localhost:8800/despesa");
        console.log("Resposta da API para despesas:", response.data);

        if (Array.isArray(response.data)) {
          setDespesas(response.data);
        } else {
          console.error("Resposta da API não é um array:", response.data);
          toast.error("Erro ao buscar despesas: formato inesperado.");
        }
      } catch (err) {
        console.error("Erro ao buscar despesas:", err);
        toast.error("Erro ao buscar despesas.");
      }
    };

    fetchDespesas();
  }, []);

  const handleDelete = async (id, status) => {
    if (status === "Pago") {
      toast.error("Não é possível excluir uma despesa já paga.");
      return;
    }

    if (!window.confirm("Tem certeza que deseja deletar esta despesa?")) return;

    try {
      await axios.delete(`http://localhost:8800/despesa/${id}`);
      toast.success("Despesa deletada com sucesso!");
      setDespesas(despesas.filter((despesa) => despesa.idDespesa !== id));
    } catch (err) {
      console.error("Erro ao deletar despesa:", err);
      toast.error("Erro ao deletar despesa.");
    }
  };

  const handleFilterDescricao = (e) => {
    setFiltroDescricao(e.target.value);
  };

  const handleFilterPeriodo = (e) => {
    const { name, value } = e.target;
    setFiltroPeriodo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterStatus = (e) => {
    setFiltroStatus(e.target.value);
  };

  const handleFilterValor = (e) => {
    setFiltroValor(e.target.value);
  };

  const despesasFiltradas = despesas.filter((despesa) => {
    const matchDescricao = despesa.descricao
      .toLowerCase()
      .includes(filtroDescricao.toLowerCase());

    const expenseDate = new Date(despesa.dt_despesa);
    const startDate = filtroPeriodo.inicio
      ? new Date(filtroPeriodo.inicio)
      : null;
    const endDate = filtroPeriodo.fim ? new Date(filtroPeriodo.fim) : null;
    const matchData =
      (!startDate || expenseDate >= startDate) &&
      (!endDate || expenseDate <= endDate);

    const matchStatus =
      !filtroStatus ||
      despesa.status.toLowerCase() === filtroStatus.toLowerCase();

    const matchValor = !filtroValor || despesa.valor <= parseFloat(filtroValor);

    return matchDescricao && matchData && matchStatus && matchValor;
  });

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "800px", width: "100%" }}>
        <h2>Listar Despesas</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <input
            type="text"
            placeholder="Pesquisar por descrição"
            value={filtroDescricao}
            onChange={handleFilterDescricao}
            style={{
              display: "block",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              flex: "1",
            }}
          />
          <input
            type="date"
            name="inicio"
            placeholder="Data inicial"
            value={filtroPeriodo.inicio}
            onChange={handleFilterPeriodo}
            style={{
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          <input
            type="date"
            name="fim"
            placeholder="Data final"
            value={filtroPeriodo.fim}
            onChange={handleFilterPeriodo}
            style={{
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          <select
            value={filtroStatus}
            onChange={handleFilterStatus}
            style={{
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              flex: "1",
            }}
          >
            <option value="">Filtrar por status</option>
            <option value="Pago">Pago</option>
            <option value="Pendente">Pendente</option>
            <option value="Cancelado">Cancelado</option>
          </select>
          <input
            type="number"
            placeholder="Filtrar por valor máximo"
            value={filtroValor}
            onChange={handleFilterValor}
            style={{
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              flex: "1",
            }}
          />
          <Link to="/cadastrarDespesa">
            <button
              style={{
                padding: "8px 16px",
                backgroundColor: "#87CEEB",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              Cadastrar Nova Despesa
            </button>
          </Link>
        </div>
        <table
          border="1"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Descrição</th>
              <th>Tipo de Despesa</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {despesasFiltradas.length > 0 ? (
              despesasFiltradas.map((despesa) => (
                <tr key={despesa.idDespesa}>
                  <td>{despesa.idDespesa}</td>
                  <td>{despesa.descricao}</td>
                  <td>{despesa.nome_tipo || "N/A"}</td>
                  <td>{despesa.valor}</td>
                  <td>{new Date(despesa.dt_despesa).toLocaleDateString()}</td>
                  <td>{despesa.status}</td>
                  <td>
                    <Link
                      to={`/editarDespesa/${despesa.idDespesa}`}
                      state={{ status: despesa.status }}
                    >
                      <button
                        style={{
                          padding: "6px 12px",
                          marginRight: "5px",
                          backgroundColor:
                            despesa.status === "Pago" ? "#ccc" : "#87CEEB",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor:
                            despesa.status === "Pago"
                              ? "not-allowed"
                              : "pointer",
                        }}
                        disabled={despesa.status === "Pago"}
                      >
                        Editar
                      </button>
                    </Link>
                    <button
                      onClick={() =>
                        handleDelete(despesa.idDespesa, despesa.status)
                      }
                      style={{
                        padding: "6px 12px",
                        backgroundColor:
                          despesa.status === "Pago" ? "#ccc" : "#FF6347",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor:
                          despesa.status === "Pago" ? "not-allowed" : "pointer",
                      }}
                      disabled={despesa.status === "Pago"}
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Nenhuma despesa encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListarDespesa;
