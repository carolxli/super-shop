import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const FormQuitarDespesa = () => {
  const { idDespesa } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [despesa, setDespesa] = useState({
    valor: "",
    data_pagamento: "",
  });
  const [tipoPagamento, setTipoPagamento] = useState("total");
  const [despesaInfo, setDespesaInfo] = useState({
    valorTotal: 0,
    valorPago: 0,
    valorRestante: 0,
  });

  useEffect(() => {
    // Buscar informações da despesa
    const fetchDespesaInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/despesa/${idDespesa}`
        );
        const despesaData = response.data;

        const valorTotal = parseFloat(despesaData.valor) || 0;
        const valorPago = parseFloat(despesaData.valor_pgmto) || 0;
        const valorRestante = valorTotal - valorPago;

        setDespesaInfo({
          valorTotal,
          valorPago,
          valorRestante,
        });

        // Se vem do location state, usar esses valores
        if (location.state) {
          setDespesaInfo({
            valorTotal: location.state.valorTotal || valorTotal,
            valorPago: location.state.valorPago || valorPago,
            valorRestante: location.state.valorRestante || valorRestante,
          });
        }
      } catch (err) {
        console.error("Erro ao buscar informações da despesa:", err);
        toast.error("Erro ao carregar informações da despesa.");
      }
    };

    fetchDespesaInfo();
  }, [idDespesa, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDespesa((prevDespesa) => ({
      ...prevDespesa,
      [name]: value,
    }));
  };

  const handleTipoPagamentoChange = (e) => {
    setTipoPagamento(e.target.value);
    if (e.target.value === "total") {
      setDespesa((prevDespesa) => ({
        ...prevDespesa,
        valor: "", // Reset valor when switching to total
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!despesa.data_pagamento) {
      toast.error("Por favor, preencha a data de pagamento.");
      return;
    }

    if (tipoPagamento === "parcial") {
      if (!despesa.valor) {
        toast.error("Por favor, preencha o valor do pagamento.");
        return;
      }

      const valorPagamento = parseFloat(
        despesa.valor.replace(/[^\d,-]/g, "").replace(",", ".")
      );

      if (valorPagamento <= 0) {
        toast.error("O valor do pagamento deve ser maior que zero.");
        return;
      }

      if (valorPagamento > despesaInfo.valorRestante) {
        toast.error(
          "O valor do pagamento não pode exceder o valor restante da despesa."
        );
        return;
      }
    }

    try {
      const despesaToSend = {
        ...despesa,
        valor:
          tipoPagamento === "total"
            ? "valor_total"
            : parseFloat(
                despesa.valor.replace(/[^\d,-]/g, "").replace(",", ".")
              ),
      };

      await axios.put(
        `http://localhost:8800/despesa/quitar/${idDespesa}`,
        despesaToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Despesa quitada com sucesso!");
      navigate("/despesa");
    } catch (err) {
      console.error("Erro ao quitar despesa:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Erro ao quitar despesa. Verifique os dados e tente novamente.";
      toast.error(errorMessage);
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const cardStyle = {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
  };

  const headerStyle = {
    backgroundColor: "#87ceeb",
    color: "white",
    padding: "24px 32px",
    margin: "0",
    fontSize: "24px",
    fontWeight: "600",
    textAlign: "center",
  };

  const contentStyle = {
    padding: "32px",
  };

  const infoCardStyle = {
    backgroundColor: "#f8f9fa",
    border: "1px solid #e9ecef",
    borderRadius: "8px",
    padding: "24px",
    marginBottom: "32px",
  };

  const infoTitleStyle = {
    color: "#495057",
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "16px",
    margin: "0 0 16px 0",
  };

  const infoGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "16px",
  };

  const infoItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #e9ecef",
  };

  const labelStyle = {
    color: "#6c757d",
    fontSize: "14px",
    fontWeight: "500",
  };

  const valueStyle = {
    color: "#212529",
    fontSize: "16px",
    fontWeight: "600",
  };

  const highlightValueStyle = {
    ...valueStyle,
    color: "#dc3545",
    fontSize: "18px",
  };

  const formGroupStyle = {
    marginBottom: "24px",
  };

  const inputLabelStyle = {
    display: "block",
    marginBottom: "8px",
    color: "#495057",
    fontSize: "14px",
    fontWeight: "600",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e9ecef",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: "white",
  };

  const alertStyle = {
    backgroundColor: "#d1ecf1",
    border: "1px solid #87ceeb",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px",
  };

  const alertTextStyle = {
    margin: "0",
    color: "#0c5460",
    fontSize: "14px",
    lineHeight: "1.5",
  };

  const buttonContainerStyle = {
    display: "flex",
    gap: "16px",
    marginTop: "32px",
  };

  const primaryButtonStyle = {
    flex: "1",
    padding: "14px 24px",
    backgroundColor: "#87ceeb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const secondaryButtonStyle = {
    flex: "1",
    padding: "14px 24px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const smallTextStyle = {
    color: "#6c757d",
    fontSize: "12px",
    marginTop: "8px",
    display: "block",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headerStyle}>Quitar Despesa</h2>

        <div style={contentStyle}>
          {/* Informações da Despesa */}
          <div style={infoCardStyle}>
            <h3 style={infoTitleStyle}>Informações da Despesa</h3>
            <div style={infoGridStyle}>
              <div style={infoItemStyle}>
                <span style={labelStyle}>Valor Total:</span>
                <span style={valueStyle}>
                  {despesaInfo.valorTotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
              <div style={infoItemStyle}>
                <span style={labelStyle}>Valor Já Pago:</span>
                <span style={valueStyle}>
                  {despesaInfo.valorPago.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>
            <div style={{ ...infoItemStyle, gridColumn: "1 / -1" }}>
              <span style={labelStyle}>Valor Restante:</span>
              <span style={highlightValueStyle}>
                {despesaInfo.valorRestante.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={formGroupStyle}>
              <label style={inputLabelStyle}>Tipo de Pagamento:</label>
              <select
                value={tipoPagamento}
                onChange={handleTipoPagamentoChange}
                style={selectStyle}
              >
                <option value="total">
                  Pagamento Total (Quitar Completamente)
                </option>
                <option value="parcial">Pagamento Parcial</option>
              </select>
            </div>

            {tipoPagamento === "total" && (
              <div style={alertStyle}>
                <p style={alertTextStyle}>
                  <strong>Pagamento Total:</strong> Esta despesa será marcada
                  como "Pago" e o valor restante de{" "}
                  {despesaInfo.valorRestante.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}{" "}
                  será quitado completamente.
                </p>
              </div>
            )}

            {tipoPagamento === "parcial" && (
              <div style={formGroupStyle}>
                <label style={inputLabelStyle}>Valor do Pagamento:</label>
                <input
                  type="text"
                  name="valor"
                  value={despesa.valor}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    const formattedValue = new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(value / 100);
                    handleChange({
                      target: { name: "valor", value: formattedValue },
                    });
                  }}
                  placeholder="R$ 0,00"
                  style={inputStyle}
                  required
                />
                <small style={smallTextStyle}>
                  Valor máximo:{" "}
                  {despesaInfo.valorRestante.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </small>
              </div>
            )}

            <div style={formGroupStyle}>
              <label style={inputLabelStyle}>Data do Pagamento:</label>
              <input
                type="date"
                name="data_pagamento"
                value={despesa.data_pagamento}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            <div style={buttonContainerStyle}>
              <button
                type="submit"
                style={primaryButtonStyle}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#6bb6db")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#87ceeb")}
              >
                {tipoPagamento === "total"
                  ? "Quitar Completamente"
                  : "Registrar Pagamento"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/despesa")}
                style={secondaryButtonStyle}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#5a6268")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#6c757d")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormQuitarDespesa;
