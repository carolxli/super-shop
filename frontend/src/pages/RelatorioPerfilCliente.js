import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FiX } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Container = styled.div`
  padding: 20px;
`;

const FiltrosContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 30px;
  margin-left: 27px;
  align-items: flex-end;
  width: 100%;
  font-size: 14px;
  overflow-x: auto;
`;

const FiltroGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 180px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 80%;
  overflow-y: auto;
  position: relative;
`;
const BotaoExportar = styled.button`
all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  margin: 5px;
  font-size: 14px;
  background-color: #007bff;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #0056b3;
  }
`;

const CloseButton = styled.button`
  all: unset;
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
  color: red;
  font-size: 24px;

  &:hover {
    color: #000;
  }

  svg {
    pointer-events: none;
  }
`;

const Section = styled.div`
  margin-bottom: 15px;
`;

const RelatorioPerfilCliente = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [detalhesCliente, setDetalhesCliente] = useState(null);
  const [historicoCompras, setHistoricoCompras] = useState([]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [perfilCliente, setPerfilCliente] = useState([]);

  const [dataInicial, setDataInicial] = React.useState('');
  const [dataFinal, setDataFinal] = React.useState('');
  const [nomeCliente, setNomeCliente] = React.useState('');

  useEffect(() => {
    buscarClientes();
  }, []);

  const buscarClientes = async () => {
    try {
      const response = await axios.get(`http://localhost:8800/Cliente`);
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes", error);
    }
  };

  const handleClienteClick = async (cliente) => {
    setClienteSelecionado(cliente);
    try {
      const [detalhesRes, historicoRes] = await Promise.all([
        axios.get(`http://localhost:8800/Cliente/relatorioPerfilCliente/${cliente.idCliente}`),
        axios.get(`http://localhost:8800/venda/listarComprasCliente/${cliente.idCliente}`)
      ]);
      setDetalhesCliente(detalhesRes.data);
      setHistoricoCompras(historicoRes.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes ou histórico do cliente", error);
    }
  };

  const handleCloseModal = () => {
    setClienteSelecionado(null);
    setDetalhesCliente(null);
    setHistoricoCompras([]);
    setDataInicio("");
    setDataFim("");
  };

  const calcularIdade = (dataNasc) => {
    const nascimento = new Date(dataNasc);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const filteredVendas = historicoCompras.filter((venda) => {
    const vendaData = new Date(venda.data);
    const inicio = dataInicio ? new Date(dataInicio) : null;
    const fim = dataFim ? new Date(dataFim) : null;

    const isAfterInicio = !inicio || vendaData >= inicio;
    const isBeforeFim = !fim || vendaData <= fim;

    return isAfterInicio && isBeforeFim;
  });

  const exportarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Perfil do Cliente", 14, 20);

    const clienteInfo = [
      ["Nome", clienteSelecionado.pessoa_nome],
      ["Data de nascimento", detalhesCliente?.data_nasc ? new Date(detalhesCliente.data_nasc).toLocaleDateString() : "-"],
      ["Idade", detalhesCliente?.data_nasc ? `${calcularIdade(detalhesCliente.data_nasc)} anos` : "-"],
      ["Telefone", detalhesCliente?.telefone_1 || "-"],
      ["Email", detalhesCliente?.email || "-"],
      ["Data da primeira compra", detalhesCliente?.data_primeira_compra ? new Date(detalhesCliente.data_primeira_compra).toLocaleDateString() : "-"],
      ["Data da última compra", clienteSelecionado.ultima_compra ? new Date(clienteSelecionado.ultima_compra).toLocaleDateString() : "-"],
    ];

    autoTable(doc, {
      startY: 30,
      head: [["Campo", "Valor"]],
      body: clienteInfo,
    });

    doc.text("Estatísticas", 14, doc.lastAutoTable.finalY + 10);
    const estatisticas = [
      ["Número total de compras", detalhesCliente?.total_vendas || 0],
      ["Valor gasto total", `R$ ${detalhesCliente?.valor_total_gasto?.toFixed(2) || "0.00"}`],
      ["Ticket médio", `R$ ${(+(detalhesCliente?.ticket_medio) || 0).toFixed(2)}`],
      ["Produto mais comprado", detalhesCliente?.produto_mais_comprado || "-"],
      ["Categoria mais comprada", detalhesCliente?.categoria_mais_comprada || "-"],
      ["Marca mais comprada", detalhesCliente?.marca_mais_comprada || "-"],
      ["Forma de pagamento mais usada", detalhesCliente?.forma_pagamento_mais_usada || "-"],
      ["Quantidade de devoluções", detalhesCliente?.total_devolucoes || 0],
    ];

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Indicador", "Valor"]],
      body: estatisticas,
    });

    doc.text("Histórico de Compras", 14, doc.lastAutoTable.finalY + 10);

    const compras = filteredVendas.flatMap((venda) =>
      venda.itens.map((item) => [
        new Date(venda.data).toLocaleDateString(),
        venda.vendedor,
        item.produto,
        item.marca,
        item.categoria,
        `R$ ${item.valor_unitario.toFixed(2)}`,
        `R$ ${item.valor_vendido.toFixed(2)}`,
      ])
    );

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Data", "Vendedor", "Produto", "Marca", "Categoria", "Valor Unitário", "Valor Pago"]],
      body: compras,
    });

    doc.save("perfil_cliente.pdf");
  };

  const exportarExcel = () => {
    const data = [];

    // Cabeçalho: Perfil do Cliente
    data.push(["Perfil do Cliente"]);
    data.push(["Campo", "Valor"]);
    data.push(["Nome", clienteSelecionado.pessoa_nome]);
    data.push(["Data de nascimento", detalhesCliente?.data_nasc ? new Date(detalhesCliente.data_nasc).toLocaleDateString() : "-"]);
    data.push(["Idade", detalhesCliente?.data_nasc ? `${calcularIdade(detalhesCliente.data_nasc)} anos` : "-"]);
    data.push(["Telefone", detalhesCliente?.telefone_1 || "-"]);
    data.push(["Email", detalhesCliente?.email || "-"]);
    data.push(["Data da primeira compra", detalhesCliente?.data_primeira_compra ? new Date(detalhesCliente.data_primeira_compra).toLocaleDateString() : "-"]);
    data.push(["Data da última compra", clienteSelecionado.ultima_compra ? new Date(clienteSelecionado.ultima_compra).toLocaleDateString() : "-"]);

    // Espaço
    data.push([]);
    data.push(["Estatísticas"]);
    data.push(["Indicador", "Valor"]);
    data.push(["Número total de compras", detalhesCliente?.total_vendas || 0]);
    data.push(["Valor gasto total", `R$ ${detalhesCliente?.valor_total_gasto?.toFixed(2) || "0.00"}`]);
    data.push(["Ticket médio", `R$ ${(+(detalhesCliente?.ticket_medio) || 0).toFixed(2)}`]);
    data.push(["Produto mais comprado", detalhesCliente?.produto_mais_comprado || "-"]);
    data.push(["Categoria mais comprada", detalhesCliente?.categoria_mais_comprada || "-"]);
    data.push(["Marca mais comprada", detalhesCliente?.marca_mais_comprada || "-"]);
    data.push(["Forma de pagamento mais usada", detalhesCliente?.forma_pagamento_mais_usada || "-"]);
    data.push(["Quantidade de devoluções", detalhesCliente?.total_devolucoes || 0]);

    // Espaço
    data.push([]);
    data.push(["Histórico de Compras"]);
    data.push(["Data", "Vendedor", "Produto", "Marca", "Categoria", "Valor Unitário", "Valor Pago"]);

    filteredVendas.forEach((venda) => {
      venda.itens.forEach((item) => {
        data.push([
          new Date(venda.data).toLocaleDateString(),
          venda.vendedor,
          item.produto,
          item.marca,
          item.categoria,
          item.valor_unitario,
          item.valor_vendido
        ]);
      });
    });

    // Criar planilha e exportar
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PerfilCliente");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "perfil_cliente.xlsx");
  };

  const clientesFiltrados = clientes.filter((cliente) => {
    const nomeValido = cliente.pessoa_nome.toLowerCase().includes(nomeCliente.toLowerCase());

    const ultimaCompra = cliente.ultima_compra ? new Date(cliente.ultima_compra) : null;
    const dataIni = dataInicial ? new Date(dataInicial) : null;
    const dataFi = dataFinal ? new Date(dataFinal) : null;

    const dataValida = (!dataIni || (ultimaCompra && ultimaCompra >= dataIni)) &&
      (!dataFi || (ultimaCompra && ultimaCompra <= dataFi));

    // Também permite mostrar clientes que não tem compras (ultima_compra null) se não estiver filtrando por datas
    if (!ultimaCompra && (dataIni || dataFi)) {
      return false;
    }

    return nomeValido && dataValida;
  });


  return (
    <Container>
      <h2>Relatório de Clientes</h2>
      <FiltrosContainer>
        <FiltroGroup>
          <label>Data Inicial</label>
          <input
            type="date"
            value={dataInicial}
            onChange={(e) => setDataInicial(e.target.value)}
          />
        </FiltroGroup>
        <FiltroGroup>
          <label>Data Final</label>
          <input
            type="date"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
          />
        </FiltroGroup>
        <FiltroGroup>
          <label>Nome do cliente</label>
          <input
            type="text"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
          />
        </FiltroGroup>
      </FiltrosContainer>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Data da Última Compra</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.map((cliente) => (
            <tr key={cliente.idCliente} onClick={() => handleClienteClick(cliente)}>
              <td>{cliente.pessoa_nome}</td>
              <td>{cliente.ultima_compra ? new Date(cliente.ultima_compra).toLocaleDateString() : "Sem compras"}</td>
            </tr>
          ))}
        </tbody>

      </table>

      {clienteSelecionado && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={handleCloseModal}>
              <FiX />
            </CloseButton>

            <h3>Perfil do Cliente:</h3>
            <Section><strong>Nome:</strong> {clienteSelecionado.pessoa_nome}</Section>
            <Section><strong>Data de nascimento:</strong> {detalhesCliente?.data_nasc ? new Date(detalhesCliente.data_nasc).toLocaleDateString() : "-"}</Section>
            <Section><strong>Idade:</strong> {detalhesCliente?.data_nasc ? calcularIdade(detalhesCliente.data_nasc) + " anos" : "-"}</Section>
            <Section><strong>Telefone:</strong> {detalhesCliente?.telefone_1 || "-"}</Section>
            <Section><strong>Email:</strong> {detalhesCliente?.email || "-"}</Section>
            <Section><strong>Data da primeira compra:</strong> {detalhesCliente?.data_primeira_compra ? new Date(detalhesCliente.data_primeira_compra).toLocaleDateString() : "-"}</Section>
            <Section><strong>Data da última compra:</strong> {clienteSelecionado.ultima_compra ? new Date(clienteSelecionado.ultima_compra).toLocaleDateString() : "Sem compras"}</Section>

            <h3>Estatísticas:</h3>
            <Section><strong>Número total de compras:</strong> {detalhesCliente?.total_vendas || 0}</Section>
            <Section><strong>Valor gasto total:</strong> R$ {detalhesCliente?.valor_total_gasto?.toFixed(2) || "0.00"}</Section>
            <Section><strong>Ticket médio:</strong> R$ {(+(detalhesCliente?.ticket_medio) || 0).toFixed(2)}</Section>
            <Section><strong>Produto mais comprado:</strong> {detalhesCliente?.produto_mais_comprado || "-"}</Section>
            <Section><strong>Categoria mais comprada:</strong> {detalhesCliente?.categoria_mais_comprada || "-"}</Section>
            <Section><strong>Marca mais comprada:</strong> {detalhesCliente?.marca_mais_comprada || "-"}</Section>
            <Section><strong>Forma de pagamento mais usada:</strong> {detalhesCliente?.forma_pagamento_mais_usada || "-"}</Section>
            <Section><strong>Quantidade de devoluções:</strong> {detalhesCliente?.total_devolucoes || 0}</Section>

            <h3>Histórico de Compras:</h3>

            {filteredVendas.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Data da Compra</th>
                    <th>Vendedor</th>
                    <th>Qtde</th>
                    <th>Produto</th>
                    <th>Marca</th>
                    <th>Categoria</th>
                    <th>Valor Unitário</th>
                    <th>Valor Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendas.map((venda) =>
                    venda.itens.map((item, index) => (
                      <tr key={`${venda.idVenda}-${index}`}>
                        <td>{new Date(venda.data).toLocaleDateString()}</td>
                        <td>{venda.vendedor}</td>
                        <td>{item.qtde}</td>
                        <td>{item.produto}</td>
                        <td>{item.marca}</td>
                        <td>{item.categoria}</td>
                        <td>R$ {item.valor_unitario.toFixed(2)}</td>
                        <td>R$ {item.valor_vendido.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <p>Sem compras registradas nesse intervalo.</p>
            )}
            <div>
              <BotaoExportar onClick={exportarPDF}>Exportar PDF</BotaoExportar>
              <BotaoExportar onClick={exportarExcel}>Exportar Excel</BotaoExportar>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default RelatorioPerfilCliente;
