import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
`;

const Titulo = styled.h2`
  margin-bottom: 20px;
`;

const TotalLabel = styled.div`
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const BotaoExcluir = styled.button`
  background-color: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: darkred;
  }
`;

const Caixa = () => {
  const [vendas, setVendas] = useState([]);
  const [dataHora, setDataHora] = useState(new Date());

  useEffect(() => {
    // Atualiza a data/hora a cada segundo
    const timer = setInterval(() => {
      setDataHora(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:8800/venda/relatorioVendas")
      .then((response) => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const amanha = new Date(hoje);
        amanha.setDate(hoje.getDate() + 1);

        const vendasHoje = response.data.filter((venda) => {
          const dataVenda = new Date(venda.data_venda);
          return dataVenda >= hoje && dataVenda < amanha;
        });

        setVendas(vendasHoje);
      })
      .catch((error) => {
        console.error("Erro ao buscar vendas:", error);
      });
  }, []);

  // Calcula o total vendido hoje, somando todos os itens de todas as vendas
  const totalVendido = vendas.reduce((acc, venda) => {
    const totalVenda = venda.itens.reduce(
      (somaItens, item) => somaItens + item.qtde * item.valor_vendido,
      0
    );
    return acc + totalVenda;
  }, 0);

  const handleDeleteVenda = (idVenda) => {
    if (!window.confirm("Tem certeza que deseja excluir esta venda?")) return;

    axios
      .delete(`http://localhost:8800/venda/${idVenda}`)
      .then(() => {
        setVendas((prev) => prev.filter((venda) => venda.idVenda !== idVenda));
        alert("Venda excluída com sucesso.");
      })
      .catch((err) => {
        console.error("Erro ao excluir venda:", err);
        alert("Erro ao excluir venda.");
      });
  };

  return (
    <Container>
      <Titulo>
        {`${dataHora.toLocaleDateString("pt-BR")} - ${dataHora.toLocaleTimeString("pt-BR")}`}
      </Titulo>
      <TotalLabel>Total vendido hoje: R$ {totalVendido.toFixed(2)}</TotalLabel>

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Data</th>
            <th>Cliente</th>
            <th>Produto</th>
            <th>SKU</th>
            <th>Qtde</th>
            <th>Unitário</th>
            <th>Total</th>
            <th>Pagamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vendas.length === 0 && (
            <tr>
              <td colSpan="10">Nenhuma venda registrada hoje.</td>
            </tr>
          )}
          {vendas.map((venda) =>
            venda.itens.map((item, index) => (
              <tr key={`${venda.idVenda}-${item.sku}`}>
                {index === 0 && (
                  <>
                    <td rowSpan={venda.itens.length}>{venda.idVenda}</td>
                    <td rowSpan={venda.itens.length}>
                      {new Date(venda.data_venda).toLocaleDateString()}
                    </td>
                    <td rowSpan={venda.itens.length}>{venda.cliente}</td>
                  </>
                )}
                <td>{item.descricao}</td>
                <td>{item.sku}</td>
                <td>{item.qtde}</td>
                <td>R$ {item.valor_unitario.toFixed(2)}</td>
                <td>R$ {(item.qtde * item.valor_vendido).toFixed(2)}</td>
                {index === 0 && (
                  <>
                    <td rowSpan={venda.itens.length}>
                      {venda.pagamentos.map((pg, i) => (
                        <div key={i}>
                          {pg.metodo_pagamento}: R$ {pg.valor_pago.toFixed(2)}
                        </div>
                      ))}
                    </td>
                    <td rowSpan={venda.itens.length}>
                      <BotaoExcluir onClick={() => handleDeleteVenda(venda.idVenda)}>
                        Excluir
                      </BotaoExcluir>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Container>
  );
};

export default Caixa;
