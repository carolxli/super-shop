import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const FormRow = styled.form`
  width: 80%;
  padding: 5px;
  font-size: 14px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  thead {
    background-color: #f0f0f0;
  }
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
  width: 155px;
  margin: 30px;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: rgb(3, 156, 194);
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
`;
const VendaFinanceiro = () => {
  const [dadosVenda, setDadosVenda] = useState(null);
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [valorPagamento, setValorPagamento] = useState("");
  const [pagamentos, setPagamentos] = useState([]);
  const [valorVoucher, setValorVoucher] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);
  const [tipoDesconto, setTipoDesconto] = useState("");
  const [desconto, setDesconto] = useState("");
  const [valorRestante, setValorRestante] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const vendaTemp = localStorage.getItem("venda_em_aberto");
    if (vendaTemp) {
      const vendaParse = JSON.parse(vendaTemp);
      setDadosVenda(vendaParse);
      setTotalFinal(vendaParse.total || 0);
      setPagamentos(vendaParse.pagamentos || []);
      setDesconto(vendaParse.desconto || "");
      setTipoDesconto(vendaParse.tipoDesconto || "");
    } else {
      alert("Nenhuma venda em aberto encontrada.");
      navigate("/venda");
    }
  }, [navigate]);

  useEffect(() => {
    const vendaTemp = localStorage.getItem("venda_em_aberto");
    if (vendaTemp) {
      const atualizada = {
        ...JSON.parse(vendaTemp),
        pagamentos,
        desconto,
        tipoDesconto
      };
      localStorage.setItem("venda_em_aberto", JSON.stringify(atualizada));
    }
  }, [pagamentos, desconto, tipoDesconto]);

  useEffect(() => {
    const fetchVoucherDoCliente = async () => {
      if (dadosVenda && dadosVenda.cliente) {
        try {
          const pessoaRes = await axios.get(`http://localhost:8800/Pessoa?nome=${dadosVenda.cliente}`);
          const pessoa = pessoaRes.data.find(p => p.nome === dadosVenda.cliente);

          if (pessoa) {
            const clienteRes = await axios.get(`http://localhost:8800/Cliente`);
            const cliente = clienteRes.data.find(c => c.Pessoa_idPessoa === pessoa.idPessoa);

            if (cliente) {
              setValorVoucher(parseFloat(cliente.voucher || 0));
            }
          }
        } catch (err) {
          console.error("Erro ao buscar voucher do cliente:", err);
        }
      }
    };

    fetchVoucherDoCliente();
  }, [dadosVenda]);

  useEffect(() => {
    if (dadosVenda) {
      let total = dadosVenda.total;
      let descontoPercentual = Number(desconto);

      if (tipoDesconto === "Valor" && total > 0) {
        descontoPercentual = ((Number(desconto) / total) * 100);
      }

      const descontoAplicado = tipoDesconto === "Percentual" || tipoDesconto === "Valor"
        ? total * (descontoPercentual / 100)
        : 0;

      let novoTotal = total - descontoAplicado;
      if (novoTotal < 0) novoTotal = 0;

      setTotalFinal(novoTotal);
    }
  }, [desconto, tipoDesconto, dadosVenda]);


  useEffect(() => {
    const totalPago = pagamentos.reduce((acc, p) => acc + p.valor, 0);
    const restante = totalFinal - totalPago;
    setValorRestante(restante > 0 ? restante : 0);
  }, [pagamentos, totalFinal]);

  const adicionarPagamento = () => {
    const valor = parseFloat(valorPagamento);
    if (!metodoPagamento || isNaN(valor) || valor <= 0) {
      alert("Selecione uma forma de pagamento válida e informe o valor.");
      return;
    }

    if (valor > valorRestante) {
      alert(`O valor excede o total restante de R$ ${valorRestante.toFixed(2)}.`);
      return;
    }

    if (metodoPagamento === "Voucher") {
      const totalUsado = pagamentos
        .filter(p => p.metodo === "Voucher")
        .reduce((acc, p) => acc + p.valor, 0);

      if (valor > valorVoucher - totalUsado) {
        alert(`Saldo de voucher insuficiente. Disponível: R$ ${(valorVoucher - totalUsado).toFixed(2)}`);
        return;
      }
    }

    setPagamentos([...pagamentos, { metodo: metodoPagamento, valor }]);
    setValorPagamento("");
  };


  const finalizarVenda = async () => {
    const totalPago = pagamentos.reduce((acc, p) => acc + p.valor, 0);
    if (totalPago < totalFinal) {
      alert("O valor total ainda não foi pago.");
      return;
    }

    if (!metodoPagamento) {
      alert("Selecione a forma de pagamento.");
      return;
    }

    const valorUsadoVoucher = pagamentos
      .filter(p => p.metodo === "Voucher")
      .reduce((acc, p) => acc + p.valor, 0);

    let pessoa = null;
    let cliente = null;

    try {
      const vendaTemp = JSON.parse(localStorage.getItem("venda_em_aberto"));

      if (valorUsadoVoucher >= 0 && dadosVenda?.cliente) {
        const pessoaRes = await axios.get(`http://localhost:8800/Pessoa?nome=${vendaTemp.cliente}`);
        pessoa = pessoaRes.data.find(p => p.nome === vendaTemp.cliente);

        if (!pessoa) {
          alert("Cliente não encontrado.");
          return;
        }

        const clienteRes = await axios.get(`http://localhost:8800/Cliente`);
        cliente = clienteRes.data.find(c => c.Pessoa_idPessoa === pessoa.idPessoa);

        const novoValorVoucher = Math.max(0, (cliente.voucher || 0) - valorUsadoVoucher);

        await axios.put(`http://localhost:8800/Cliente/${cliente.idCliente}`, {
          ...cliente,
          voucher: novoValorVoucher
        });

        setValorVoucher && setValorVoucher(novoValorVoucher);
      }
      let descontoPercentual = parseFloat(desconto);
      if (tipoDesconto === "Valor" && dadosVenda?.total > 0) {
        descontoPercentual = (parseFloat(desconto) / dadosVenda.total) * 100;
      }
      const novaVenda = {
        data: new Date().toISOString().split("T")[0],
        desconto: descontoPercentual.toFixed(2), // garante duas casas decimais
        valor_total: totalFinal,
        Usuario_idUsuario: vendaTemp.Usuario_idUsuario || null,
        Pessoa_idPessoa: pessoa?.idPessoa || null,
        Cliente_idCliente: cliente?.idCliente || null,
        itens: vendaTemp.itens.map(item => ({
          Produto_idProduto: item.idProduto,
          qtde: item.quantidade,
          valor_unitario: item.valorUnitario,
          valor_vendido: item.valorTotal
        })),
        pagamentos: pagamentos  // Enviando todos os pagamentos
      };
      console.log("pagamentos depois: ", pagamentos)
      console.log("nova venda: ", novaVenda)
      const response = await axios.post("http://localhost:8800/Venda", novaVenda);

      if (response.status === 201 || response.status === 200) {
        localStorage.removeItem("venda_em_aberto");
        localStorage.removeItem("voucher_cliente");
        alert("Venda finalizada com sucesso!");
        navigate("/venda");
      } else {
        alert("Erro ao finalizar a venda.");
      }

    } catch (error) {
      console.error("Erro ao finalizar a venda:", error);
      alert("Erro ao finalizar a venda.");
    }
  };

  const removerPagamento = (index) => {
    const pagamentosAtualizados = [...pagamentos];
    pagamentosAtualizados.splice(index, 1);
    setPagamentos(pagamentosAtualizados);
  };

  return (
    <>
      <h2>Finalizar Venda</h2>

      {dadosVenda && (
        <FormRow onSubmit={(e) => e.preventDefault()}>
          <p><strong>Cliente:</strong> {dadosVenda.cliente}</p>
          <p><strong>Vendedor:</strong> {dadosVenda.usuario}</p>
          <Table>
            <thead>
              <tr>
                <Th>Produto</Th>
                <Th>Quantidade</Th>
                <Th>Valor Unitário</Th>
                <Th>Valor Total</Th>
              </tr>
            </thead>
            <tbody>
              {dadosVenda.itens.map((item) => (
                <tr key={item.id}>
                  <Td>{item.produto}</Td>
                  <Td>{item.quantidade}</Td>
                  <Td>R$ {item.valorUnitario.toFixed(2)}</Td>
                  <Td>R$ {item.valorTotal.toFixed(2)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>

          <label>Tipo de Desconto:
            <select value={tipoDesconto} onChange={(e) => setTipoDesconto(e.target.value)}>
              <option value="">Nenhum</option>
              <option value="Percentual">Percentual (%)</option>
              <option value="Valor">Valor (R$)</option>
            </select>
          </label>

          <label>Desconto:
            <input
              type="number"
              value={desconto}
              onChange={(e) => setDesconto(e.target.value)}
              placeholder="Informe o desconto"
            />
          </label>

          <p><strong>Valor Bruto:</strong> R$ {dadosVenda.total?.toFixed(2) || "0.00"}</p>
          <p><strong>Valor com Desconto:</strong> R$ {totalFinal.toFixed(2)}</p>
          <p><strong>Valor Restante a Pagar:</strong> R$ {valorRestante.toFixed(2)}</p>

          <label>Forma de Pagamento:
            <select value={metodoPagamento} onChange={(e) => setMetodoPagamento(e.target.value)} required>
              <option value="">Selecione</option>
              <option value="PIX">PIX</option>
              <option value="Credito">Crédito</option>
              <option value="Debito">Débito</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Voucher">Voucher (R$ {valorVoucher.toFixed(2)})</option>
            </select>
          </label>

          <label>Valor:
            <input
              type="number"
              value={valorPagamento}
              onChange={(e) => setValorPagamento(e.target.value)}
              placeholder="Valor do pagamento"
            />
          </label>

          {pagamentos.length > 0 && (
            <div>
              <h4>Pagamentos Adicionados:</h4>
              <ul
                style={{
                  listStyleType: "none",
                  padding: 0,
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                {pagamentos.map((p, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "0.8rem",
                      padding: "6px 10px",
                      border: "1px solid #eee",
                      borderRadius: "4px",
                      background: "#f9f9f9",
                    }}
                  >
                    <span style={{ marginRight: "8px" }}>
                      {p.metodo}: R$ {p.valor.toFixed(2)}

                    </span>
                    <button
                      onClick={() => removerPagamento(index)}
                      style={{
                        color: "white",
                        backgroundColor: "#87CEEB",
                        border: "none",
                        borderRadius: "4px",
                        padding: "3px 5px",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                      }}
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}


          <div>
            <Button type="button" onClick={adicionarPagamento}>Adicionar Pagamento</Button>
            <Button type="button" onClick={finalizarVenda}>Finalizar Venda</Button>
            <Button
              onClick={() => {
                // Certifique-se de que os dados da venda ainda estão no localStorage
                const vendaEmAberto = localStorage.getItem("venda_em_aberto");
                if (!vendaEmAberto) {
                  alert("Nenhuma venda em andamento.");
                }
                navigate("/venda");  // Redireciona para a página de vendas
              }}
            >
              Voltar
            </Button>
          </div>
        </FormRow>
      )}

      {!dadosVenda && (
        <p>Carregando informações da venda...</p>
      )}
    </>
  );
};

export default VendaFinanceiro;