import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Container = styled.div`
  padding: 20px;
`;

const FiltrosContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
`;

const FiltroGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const BotaoExportar = styled.button`
  padding: 8px 12px;
  margin-top: 22px;
  background-color: #007bff;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: bold;
`;

const Tabela = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: left;
  }

  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const getStatusCor = (status) => {
  if (status === "Crítico") return "#f8d7da";
  if (status === "Atenção") return "#fff3cd";
  return "#d4edda";
};

const RelatorioEstoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [mostrarMinimos, setMostrarMinimos] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8800/Produto/")
      .then((res) => {
        const dados = Array.isArray(res.data) ? res.data : res.data.rows || [];
        setProdutos(dados);
        console.log("Produtos recebidos:", dados);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
      });
  }, []);

  const produtosFiltrados = produtos.filter((p) => {
    const nomeFiltrado = p.descricao?.toLowerCase().includes(filtroNome.toLowerCase());
    const estoqueCritico = !mostrarMinimos || p.estoque_atual <= p.estoque_min;
    return nomeFiltrado && estoqueCritico;
  });

  const getStatus = (produto) => {
    if (produto.estoque_atual <= 0) return "Crítico";
    if (produto.estoque_atual <= produto.estoque_min) return "Atenção";
    return "Estável";
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    const rows = produtosFiltrados.map((p) => [
      p.idProduto,
      p.sku,
      p.descricao,
      p.estoque_atual,
      p.estoque_min,
      getStatus(p),
    ]);

    autoTable(doc, {
      head: [["ID", "SKU", "Produto", "Estoque Atual", "Estoque Mínimo", "Status"]],
      body: rows,
    });

    doc.save("relatorio_estoque.pdf");
  };

  const exportarExcel = () => {
    const data = produtosFiltrados.map((p) => ({
      ID: p.idProduto,
      SKU: p.sku,
      Produto: p.descricao,
      "Estoque Atual": p.estoque_atual,
      "Estoque Mínimo": p.estoque_min,
      Status: getStatus(p),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { estoque: worksheet }, SheetNames: ["estoque"] };
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "relatorio_estoque.xlsx");
  };

  return (
    <Container>
      <h2>Relatório de Estoque</h2>
      <FiltrosContainer>
        <FiltroGroup>
          <Label>Filtrar por Nome</Label>
          <Input
            type="text"
            value={filtroNome}
            placeholder="Digite o nome do produto"
            onChange={(e) => setFiltroNome(e.target.value)}
          />
        </FiltroGroup>
        <FiltroGroup>
          <Label>&nbsp;</Label>
          <BotaoExportar onClick={() => setMostrarMinimos(!mostrarMinimos)}>
            {mostrarMinimos ? "Mostrar Todos" : "Estoque Mínimo"}
          </BotaoExportar>
        </FiltroGroup>
        <FiltroGroup>
          <Label>&nbsp;</Label>
          <BotaoExportar onClick={exportarPDF}>Exportar PDF</BotaoExportar>
        </FiltroGroup>
        <FiltroGroup>
          <Label>&nbsp;</Label>
          <BotaoExportar onClick={exportarExcel}>Exportar Excel</BotaoExportar>
        </FiltroGroup>
      </FiltrosContainer>

      <Tabela>
        <thead>
          <tr>
            <th>ID</th>
            <th>SKU</th>
            <th>Produto</th>
            <th>Estoque Atual</th>
            <th>Estoque Mínimo</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {produtosFiltrados.map((p) => (
            <tr key={p.idProduto} style={{ backgroundColor: getStatusCor(getStatus(p)) }}>
              <td>{p.idProduto}</td>
              <td>{p.sku}</td>
              <td>{p.descricao}</td>
              <td>{p.estoque_atual}</td>
              <td>{p.estoque_min}</td>
              <td>{getStatus(p)}</td>
            </tr>
          ))}
        </tbody>
      </Tabela>
    </Container>
  );
};

export default RelatorioEstoque;
