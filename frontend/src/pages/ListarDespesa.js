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

  const despesasFiltradas = despesas
    .filter((despesa) => {
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

      const matchValor =
        !filtroValor || despesa.valor <= parseFloat(filtroValor);

      return matchDescricao && matchData && matchStatus && matchValor;
    })
    .sort((a, b) => new Date(a.dt_despesa) - new Date(b.dt_despesa));

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "1200px", width: "100%" }}>
        <h2
          style={{ textAlign: "center", color: "#555", marginBottom: "30px" }}
        >
          Gerenciamento de Despesas
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            marginBottom: "25px",
            padding: "15px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <input
            type="text"
            placeholder="Pesquisar Descrição..."
            value={filtroDescricao}
            onChange={handleFilterDescricao}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              flex: "1",
              minWidth: "200px",
            }}
          />
          <input
            type="date"
            name="inicio"
            placeholder="Data inicial"
            value={filtroPeriodo.inicio}
            onChange={handleFilterPeriodo}
            style={{
              padding: "10px",
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
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          <select
            value={filtroStatus}
            onChange={handleFilterStatus}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              minWidth: "150px",
            }}
          >
            <option value="">Status</option>
            <option value="Pago">Pago</option>
            <option value="Parcialmente Pago">Parcialmente Pago</option>
            <option value="Pendente">Pendente</option>
            <option value="Cancelado">Cancelado</option>
          </select>
          <input
            type="number"
            placeholder="Valor Máximo"
            value={filtroValor}
            onChange={handleFilterValor}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              minWidth: "150px",
            }}
          />
          <Link to="/cadastrarDespesa">
            <button
              style={{
                padding: "10px 16px",
                backgroundColor: "#87CEEB",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              Cadastrar Despesa
            </button>
          </Link>
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#87CEEB" }}>
              <th
                style={{
                  padding: "12px",
                  color: "#fff",
                  textAlign: "center",
                  border: "1px solid #ddd",
                }}
              >
                ID
              </th>
              <th
                style={{
                  padding: "12px",
                  color: "#fff",
                  textAlign: "center",
                  border: "1px solid #ddd",
                }}
              >
                Descrição
              </th>
              <th
                style={{
                  padding: "12px",
                  color: "#fff",
                  textAlign: "center",
                  border: "1px solid #ddd",
                }}
              >
                Tipo de Despesa
              </th>
              <th
                style={{
                  padding: "12px",
                  color: "#fff",
                  textAlign: "center",
                  border: "1px solid #ddd",
                }}
              >
                Valor Total
              </th>
              <th
                style={{
                  padding: "12px",
                  color: "#fff",
                  textAlign: "center",
                  border: "1px solid #ddd",
                }}
              >
                Valor Pago
              </th>
              <th
                style={{
                  padding: "12px",
                  color: "#fff",
                  textAlign: "center",
                  border: "1px solid #ddd",
                }}
              >
                Valor Restante
              </th>
              <th
                style={{
                  padding: "12px",
                  color: "#fff",
                  textAlign: "center",
                  border: "1px solid #ddd",
                }}
              >
                Data de Registro
              </th>
              <th
                style={{
                  padding: "12px",
                  color: "#fff",
                  textAlign: "center",
                  border: "1px solid #ddd",
                }}
              >
                Data de Pagamento
              </th>
              <th
                style={{
                  padding: "12px",
                  color: "#fff",
                  textAlign: "center",
                  border: "1px solid #ddd",
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: "12px",
                  color: "#fff",
                  textAlign: "center",
                  border: "1px solid #ddd",
                }}
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {despesasFiltradas.length > 0 ? (
              despesasFiltradas.map((despesa) => {
                const valorTotal = parseFloat(despesa.valor) || 0;
                const valorPago = parseFloat(despesa.valor_pgmto) || 0;

                return (
                  <tr
                    key={despesa.idDespesa}
                    style={{ borderBottom: "1px solid #eee" }}
                  >
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                      }}
                    >
                      {despesa.idDespesa}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {despesa.descricao}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                      }}
                    >
                      {despesa.nome_tipo || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                        fontWeight: "bold",
                      }}
                    >
                      {valorTotal.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                        fontWeight: "bold",
                      }}
                    >
                      {valorPago.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                        fontWeight: "bold",
                      }}
                    >
                      {(valorTotal - valorPago).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                      }}
                    >
                      {new Date(despesa.dt_despesa).toLocaleDateString(
                        "pt-BR",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                      }}
                    >
                      {despesa.data_pagamento
                        ? new Date(despesa.data_pagamento).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                      }}
                    >
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          backgroundColor:
                            despesa.status === "PAGO" ||
                            despesa.status === "Pago"
                              ? "#d4edda"
                              : despesa.status === "PENDENTE" ||
                                despesa.status === "Pendente"
                              ? "#fff3cd"
                              : despesa.status === "Parcialmente Pago"
                              ? "#ffeaa7"
                              : "#f8d7da",
                          color:
                            despesa.status === "PAGO" ||
                            despesa.status === "Pago"
                              ? "#155724"
                              : despesa.status === "PENDENTE" ||
                                despesa.status === "Pendente"
                              ? "#856404"
                              : despesa.status === "Parcialmente Pago"
                              ? "#b8860b"
                              : "#721c24",
                        }}
                      >
                        {despesa.status.toUpperCase()}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          justifyContent: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <Link
                          to={`/editarDespesa/${despesa.idDespesa}`}
                          state={{ status: despesa.status }}
                        >
                          <button
                            style={{
                              padding: "6px 12px",
                              backgroundColor:
                                despesa.status === "Pago" ? "#ccc" : "#87CEEB",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor:
                                despesa.status === "Pago"
                                  ? "not-allowed"
                                  : "pointer",
                              fontSize: "12px",
                            }}
                            disabled={despesa.status === "Pago"}
                          >
                            Editar
                          </button>
                        </Link>
                        <Link
                          to={`/quitarDespesa/${despesa.idDespesa}`}
                          state={{
                            status: despesa.status,
                            valorTotal: valorTotal,
                            valorPago: valorPago,
                            valorRestante: valorTotal - valorPago,
                          }}
                        >
                          <button
                            style={{
                              padding: "6px 12px",
                              backgroundColor:
                                despesa.status === "Pago" ? "#ccc" : "#28a745",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor:
                                despesa.status === "Pago"
                                  ? "not-allowed"
                                  : "pointer",
                              fontSize: "12px",
                            }}
                            disabled={despesa.status === "Pago"}
                          >
                            Quitar
                          </button>
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(despesa.idDespesa, despesa.status)
                          }
                          style={{
                            padding: "6px 12px",
                            backgroundColor:
                              despesa.status === "Pago" ? "#ccc" : "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor:
                              despesa.status === "Pago"
                                ? "not-allowed"
                                : "pointer",
                            fontSize: "12px",
                          }}
                          disabled={despesa.status === "Pago"}
                        >
                          Deletar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="10"
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  Nenhuma despesa encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListarDespesa;
