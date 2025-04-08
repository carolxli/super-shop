import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const FormRow = styled.form`
  width: 80%;
  padding: 5px;
  font-size: 14px;
`;

const Button = styled.button`
  background-color: #87CEEB;
  color: #fff;
  border: none;
  padding: 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  width: 150px;
  margin: 5px;
`;

const VendaFinanceiro = () => {
  const [dadosVenda, setDadosVenda] = useState(null);
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [parcelas, setParcelas] = useState("1");
  const [tipoDesconto, setTipoDesconto] = useState("");
  const [desconto, setDesconto] = useState("");
  const [totalFinal, setTotalFinal] = useState(0);
  const [voucherCliente, setVoucherCliente] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const vendaTemp = localStorage.getItem("venda_em_aberto");
    if (vendaTemp) {
      const vendaParse = JSON.parse(vendaTemp);
      setDadosVenda(vendaParse);
      setTotalFinal(vendaParse.total);
    } else {
      alert("Nenhuma venda em aberto encontrada.");
      navigate("/venda");
    }
  }, [navigate]);

  useEffect(() => {
    const voucher = localStorage.getItem("voucher_cliente");
    if (voucher) {
      const { valorVoucher } = JSON.parse(voucher);
      setVoucherCliente(valorVoucher || 0);
    }
  }, []);

  useEffect(() => {
    if (dadosVenda) {
      let total = dadosVenda.total;
      const valorDesconto = Number(desconto);
      if (tipoDesconto === "Percentual") {
        total -= total * (valorDesconto / 100);
      } else if (tipoDesconto === "Valor") {
        total -= valorDesconto;
      }
      if (total < 0) total = 0;
      setTotalFinal(total);
    }
  }, [desconto, tipoDesconto, dadosVenda]);

  const finalizarVenda = async () => {
    try {
      const vendaFinal = {
        ...dadosVenda,
        metodoPagamento,
        tipoDesconto,
        descontoAplicado: Number(desconto),
        totalFinal,
        parcelas: metodoPagamento === "Credito" ? Number(parcelas) : null
      };

      await axios.post("http://localhost:8800/Venda", vendaFinal);

      alert("Venda registrada com sucesso!");
      localStorage.removeItem("venda_em_aberto");
      localStorage.removeItem("voucher_cliente");
      navigate("/");
    } catch (error) {
      console.error("Erro ao registrar venda:", error);
      alert("Erro ao registrar venda.");
    }
  };

  if (!dadosVenda) return <p>Carregando dados da venda...</p>;

  return (
    <>
      <br /><br /><br />
      <h2>Finalizar Venda</h2>
      <FormRow onSubmit={(e) => e.preventDefault()}>
        <p><strong>Cliente:</strong> {dadosVenda.cliente}</p>
        <p><strong>Vendedor:</strong> {dadosVenda.usuario}</p>
        <p><strong>Voucher (carteira):</strong> R$ {voucherCliente.toFixed(2)}</p>

        <label>Forma de Pagamento:
          <select value={metodoPagamento} onChange={(e) => setMetodoPagamento(e.target.value)} required>
            <option value="">Selecione</option>
            <option value="PIX">PIX</option>
            <option value="Credito">Crédito</option>
            <option value="Debito">Débito</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Voucher">Voucher</option>
          </select>
        </label>

        {metodoPagamento === "Credito" && (
          <label>Parcelas:
            <select value={parcelas} onChange={(e) => setParcelas(e.target.value)}>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}x</option>
              ))}
            </select>
          </label>
        )}

        <label>Tipo de Desconto:
          <select value={tipoDesconto} onChange={(e) => setTipoDesconto(e.target.value)}>
            <option value="">Nenhum</option>
            <option value="Percentual">Percentual %</option>
            <option value="Valor">Valor R$</option>
          </select>
        </label>

        {tipoDesconto && (
          <label>Valor do Desconto:
            <input
              type="number"
              value={desconto}
              onChange={(e) => setDesconto(e.target.value)}
              onFocus={(e) => e.target.select()}
              min="0"
            />
          </label>
        )}

        <p><strong>Total Bruto:</strong> R$ {dadosVenda.total.toFixed(2)}</p>
        <p><strong>Total Final:</strong> R$ {totalFinal.toFixed(2)}</p>

        <Button onClick={finalizarVenda}>Confirmar Venda</Button>
      </FormRow>
    </>
  );
};

export default VendaFinanceiro;
