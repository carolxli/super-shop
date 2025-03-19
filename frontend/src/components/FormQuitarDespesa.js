import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const FormQuitarDespesa = () => {
  const { idDespesa } = useParams();
  const navigate = useNavigate();
  const [despesa, setDespesa] = useState({
    valor: "",
    data_pagamento: "",
  });
  const [tipoPagamento, setTipoPagamento] = useState("total");

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
    if (
      tipoPagamento === "parcial" &&
      (despesa.valor === "" || despesa.data_pagamento === "")
    ) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    if (tipoPagamento === "total" && despesa.data_pagamento === "") {
      toast.error("Por favor, preencha a data de pagamento.");
      return;
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

      window.alert("despesatoSend: " + JSON.stringify(despesaToSend));
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
      toast.error(
        "Erro ao quitar despesa. Verifique os dados e tente novamente."
      );
    }
  };

  return (
    <div>
      <h2>Quitar Despesa</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Tipo de Pagamento:
          <select value={tipoPagamento} onChange={handleTipoPagamentoChange}>
            <option value="total">Total</option>
            <option value="parcial">Parcial</option>
          </select>
        </label>
        {tipoPagamento === "parcial" && (
          <>
            <label>
              Valor Pagamento:
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
                required
              />
            </label>
            <label>
              Data do Pagamento:
              <input
                type="date"
                name="data_pagamento"
                value={despesa.data_pagamento}
                onChange={handleChange}
                required
              />
            </label>
          </>
        )}
        {tipoPagamento === "total" && (
          <label>
            Data do Pagamento:
            <input
              type="date"
              name="data_pagamento"
              value={despesa.data_pagamento}
              onChange={handleChange}
              required
            />
          </label>
        )}
        <button type="submit">{"Quitar"}</button>
      </form>
    </div>
  );
};

export default FormQuitarDespesa;
