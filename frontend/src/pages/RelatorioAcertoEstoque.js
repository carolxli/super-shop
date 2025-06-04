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
  flex-wrap: nowrap;
  gap: 30px;
  margin-left: 27px;
  align-items: flex-end;
  width: 100%;
  font-size: 14px;
  overflow-x: auto;
  margin-bottom: 20px;
`;

const FiltroGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 220px;

  input,
  select {
    padding: 6px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 14px;
    margin-top: 4px;

    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  th {
    background: #f0f0f0;
    text-align: left;
  }
`;

const BotaoExportar = styled.button`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  margin: 5px;
  font-size: 14px;
  background-color: #007bff;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #0056b3;
  }
`;

const RelatorioAcertoEstoque = () => {
  const [acertos, setAcertos] = useState([]);
  const [motivo, setMotivo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");


  const fetchAcertos = async () => {
    setLoading(true);
    try {
      const params = {};
      if (motivo) params.motivo = motivo;
      if (usuario) params.usuario = usuario;
      if (dataInicio) params.dataInicio = dataInicio;
      if (dataFim) params.dataFim = dataFim;

      const response = await axios.get("http://localhost:8800/acertoEstoque", { params });
      setAcertos(response.data);
    } catch (error) {
      alert("Erro ao buscar acertos de estoque.");
      console.error(error);
    }
    setLoading(false);
  };


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!usuario || usuario.length >= 3) {
        fetchAcertos();
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [motivo, usuario, dataInicio, dataFim]);



  useEffect(() => {
    fetchAcertos();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Acertos de Estoque", 14, 20);

    const body = acertos.map(item => [
      item.idAcertoEst,
      item.produtoDescricao,
      item.estoqueAnterior,
      item.estoqueNovo,
      item.motivo,
      item.login,
      new Date(item.dataAcerto).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [['ID', 'Produto', 'Estoque Anterior', 'Estoque Novo', 'Motivo', 'Usuário', 'Data']],
      body,
      startY: 30,
    });

    doc.save("relatorio_acerto_estoque.pdf");
  };

  const exportExcel = () => {
    const worksheetData = [
      ['ID', 'Produto', 'Estoque Anterior', 'Estoque Novo', 'Motivo', 'Usuário', 'Data'],
      ...acertos.map(item => [
        item.idAcertoEst,
        item.produtoDescricao,
        item.estoqueAnterior,
        item.estoqueNovo,
        item.motivo,
        item.login,
        new Date(item.dataAcerto).toLocaleDateString(),
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Acertos");

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "relatorio_acerto_estoque.xlsx");
  };

  return (
    <Container>
      <h2>Relatório de Acertos de Estoque</h2>

      <FiltrosContainer>
        <FiltroGroup>
          <label>Motivo</label>
          <select value={motivo} onChange={e => setMotivo(e.target.value)}>
            <option value="">Todos</option>
            <option value="Perda">Perda</option>
            <option value="Roubo">Roubo</option>
            <option value="Avaria">Avaria</option>
            <option value="Erro">Erro de lançamento</option>
            <option value="Extravio">Extravio</option>
            <option value="Danificacao">Danificação</option>
            <option value="Obsoleto">Produto obsoleto</option>
            <option value="Contagem">Divergência na contagem física</option>
            <option value="Ajuste">Ajuste contábil/fiscal</option>
          </select>
        </FiltroGroup>

        <FiltroGroup>
          <label>Usuário</label>
          <input
            type="text"
            placeholder="Digite o login do usuário"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
          />
        </FiltroGroup>

        <FiltroGroup>
          <label>Data Início</label>
          <input
            type="date"
            value={dataInicio}
            onChange={e => setDataInicio(e.target.value)}
          />
        </FiltroGroup>

        <FiltroGroup>
          <label>Data Fim</label>
          <input
            type="date"
            value={dataFim}
            onChange={e => setDataFim(e.target.value)}
          />
        </FiltroGroup>

      </FiltrosContainer>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Produto</th>
                <th>Estoque Anterior</th>
                <th>Estoque Novo</th>
                <th>Motivo</th>
                <th>Usuário</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {acertos.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                acertos.map(item => (
                  <tr key={item.idAcertoEst}>
                    <td>{item.idAcertoEst}</td>
                    <td>{item.produtoDescricao}</td>
                    <td>{item.estoqueAnterior}</td>
                    <td>{item.estoqueNovo}</td>
                    <td>{item.motivo}</td>
                    <td>{item.login}</td>
                    <td>{new Date(item.dataAcerto).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div style={{ marginTop: 10 }}>
            <BotaoExportar onClick={exportPDF}>Exportar PDF</BotaoExportar>
            <BotaoExportar onClick={exportExcel}>Exportar Excel</BotaoExportar>
          </div>
        </>
      )}
    </Container>
  );
};

export default RelatorioAcertoEstoque;
