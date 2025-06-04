import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Container = styled.div`padding: 20px;`;
const FiltrosContainer = styled.div`display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px;`;
const FiltroGroup = styled.div`display: flex; flex-direction: column;`;
const Label = styled.label`margin-bottom: 5px; font-weight: bold;`;
const Input = styled.input`padding: 10px; border: 1px solid #ccc; border-radius: 4px;`;
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
  th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
  tbody tr:nth-child(even) { background-color: #f9f9f9; }
`;

const RelatorioGiroEstoque = () => {
  const [dados, setDados] = useState([]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [descricaoFiltro, setDescricaoFiltro] = useState("");

  const carregarDados = useCallback(() => {
    const params = {};
    if (dataInicio) params.dataInicio = dataInicio;
    if (dataFim) params.dataFim = dataFim;

    console.log("🔄 Buscando giro de estoque com filtros:", params);

    axios
      .get("http://localhost:8800/produto/relatorio/giro", { params })
      .then((res) => {
        console.log("✅ Produtos recebidos:", res.data);
        setDados(res.data);
      })
      .catch((err) => {
        console.error("❌ Erro ao buscar giro de estoque:", err);
      });
  }, [dataInicio, dataFim]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const dadosFiltrados = dados.filter((item) =>
    item.descricao.toLowerCase().includes(descricaoFiltro.toLowerCase())
  );

  const exportarPDF = () => {
    const doc = new jsPDF();
    const rows = dadosFiltrados.map((item) => [
      item.sku || "-",
      item.descricao,
      item.quantidade_vendida,
      item.estoque_atual,
      item.giro_estoque?.toFixed(2),
    ]);

    autoTable(doc, {
      head: [["SKU", "Produto", "Qtde Vendida", "Estoque Atual", "Giro de Estoque"]],
      body: rows,
    });

    doc.save("giro_estoque.pdf");
  };

  const exportarExcel = () => {
    const data = dadosFiltrados.map((item) => ({
      SKU: item.sku || "-",
      Produto: item.descricao,
      "Qtde Vendida": item.quantidade_vendida,
      "Estoque Atual": item.estoque_atual,
      "Giro de Estoque": item.giro_estoque?.toFixed(2),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { giro: worksheet }, SheetNames: ["giro"] };
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "giro_estoque.xlsx");
  };

  return (
    <Container>
      <h2>Relatório de Giro de Estoque</h2>
      <FiltrosContainer>
        <FiltroGroup>
          <Label>Data Inicial</Label>
          <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        </FiltroGroup>
        <FiltroGroup>
          <Label>Data Final</Label>
          <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        </FiltroGroup>
        <FiltroGroup>
          <Label>Nome do Produto</Label>
          <Input
            type="text"
            value={descricaoFiltro}
            placeholder="Digite o nome do produto"
            onChange={(e) => setDescricaoFiltro(e.target.value)}
          />
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
            <th>SKU</th>
            <th>Produto</th>
            <th>Quantidade Vendida</th>
            <th>Estoque Atual</th>
            <th>Giro de Estoque</th>
          </tr>
        </thead>
        <tbody>
          {[...dadosFiltrados]
            .sort((a, b) => b.giro_estoque - a.giro_estoque)
            .map((item, index) => {
              let bgColor = "#f8d7da";
              if (item.giro_estoque >= 1.5) bgColor = "#d4edda";
              else if (item.giro_estoque >= 0.5) bgColor = "#fff3cd";

              return (
                <tr key={index} style={{ backgroundColor: bgColor }}>
                  <td>{item.sku || "-"}</td>
                  <td>{item.descricao}</td>
                  <td>{item.quantidade_vendida}</td>
                  <td>{item.estoque_atual}</td>
                  <td>{item.giro_estoque?.toFixed(2)}</td>
                </tr>
              );
            })}
        </tbody>
      </Tabela>
    </Container>
  );
};

export default RelatorioGiroEstoque;
