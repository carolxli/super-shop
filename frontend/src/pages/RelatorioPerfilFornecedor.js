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
  margin-bottom: 20px;
`;

const FiltroGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 220px;

  input {
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
  max-width: 900px;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
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

const RelatorioPerfilFornecedor = () => {
    const [fornecedores, setFornecedores] = useState([]);
    const [fornecedorSelecionadoDetalhes, setFornecedorSelecionadoDetalhes] = useState(null);
    const [filtroTexto, setFiltroTexto] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8800/Fornecedor")
            .then(res => setFornecedores(res.data))
            .catch(err => console.error("Erro ao buscar fornecedores:", err));
    }, []);

    const buscarDetalhesFornecedor = (id) => {
        axios.get(`http://localhost:8800/Fornecedor/relatorioPerfilFornecedor/${id}`)
            .then(res => setFornecedorSelecionadoDetalhes(res.data))
            .catch(err => console.error("Erro ao buscar detalhes:", err));
    };

    const exportarPDF = () => {
        const doc = new jsPDF();
        if (fornecedorSelecionadoDetalhes) {
            doc.text("Relatório - Fornecedor", 14, 15);
            autoTable(doc, {
                startY: 20,
                head: [["Nome", "Telefone", "Email", "Total Compras", "Valor Total", "Última Compra"]],
                body: [[
                    fornecedorSelecionadoDetalhes.nome_fornecedor || "-",
                    fornecedorSelecionadoDetalhes.telefone_1 || "-",
                    fornecedorSelecionadoDetalhes.email || "-",
                    fornecedorSelecionadoDetalhes.total_compras || "0",
                    `R$ ${parseFloat(fornecedorSelecionadoDetalhes.valor_total_comprado || 0).toFixed(2)}`,
                    fornecedorSelecionadoDetalhes.data_ultima_compra
                        ? new Date(fornecedorSelecionadoDetalhes.data_ultima_compra).toLocaleDateString()
                        : "-"
                ]],
            });

            if (fornecedorSelecionadoDetalhes.historico_compras?.length > 0) {
                doc.text("Histórico de Compras", 14, doc.lastAutoTable.finalY + 10);
                autoTable(doc, {
                    startY: doc.lastAutoTable.finalY + 15,
                    head: [["Data", "Qtde", "Produto", "Marca", "Categoria"]],
                    body: fornecedorSelecionadoDetalhes.historico_compras.flatMap(compra =>
                        compra.itens.map(item => [
                            new Date(compra.dt_compra).toLocaleDateString(),
                            item.quantidade,
                            item.produto,
                            item.marca,
                            item.categoria,
                        ])
                    ),
                });
            }

            doc.save(`fornecedor_${fornecedorSelecionadoDetalhes.nome_fornecedor}.pdf`);
        }
    };

    const exportarExcel = () => {
        if (fornecedorSelecionadoDetalhes) {
            const dadosPrincipais = [{
                Nome: fornecedorSelecionadoDetalhes.nome_fornecedor,
                Telefone: fornecedorSelecionadoDetalhes.telefone_1 || "-",
                Email: fornecedorSelecionadoDetalhes.email || "-",
                "Total Compras": fornecedorSelecionadoDetalhes.total_compras || 0,
                "Valor Total Comprado": parseFloat(fornecedorSelecionadoDetalhes.valor_total_comprado || 0).toFixed(2),
                "Data Última Compra": fornecedorSelecionadoDetalhes.data_ultima_compra
                    ? new Date(fornecedorSelecionadoDetalhes.data_ultima_compra).toLocaleDateString()
                    : "-"
            }];

            const historico = fornecedorSelecionadoDetalhes.historico_compras?.flatMap(compra =>
                compra.itens.map(item => ({
                    "Data da Compra": new Date(compra.dt_compra).toLocaleDateString(),
                    "Quantidade": item.quantidade,
                    "Produto": item.produto,
                    "Marca": item.marca,
                    "Categoria": item.categoria,
                }))
            ) || [];

            const wb = XLSX.utils.book_new();

            const wsPrincipal = XLSX.utils.json_to_sheet(dadosPrincipais);
            XLSX.utils.book_append_sheet(wb, wsPrincipal, "Resumo");

            const wsHistorico = XLSX.utils.json_to_sheet(historico);
            XLSX.utils.book_append_sheet(wb, wsHistorico, "Histórico de Compras");

            const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
            const blob = new Blob([buffer], { type: "application/octet-stream" });
            saveAs(blob, `fornecedor_${fornecedorSelecionadoDetalhes.nome_fornecedor}.xlsx`);
        }
    };

    return (
        <Container>
            <h2>Relatório de Fornecedores</h2>

            <FiltrosContainer>
                <FiltroGroup>
                    <input
                        id="filtroNome"
                        type="text"
                        value={filtroTexto}
                        onChange={(e) => setFiltroTexto(e.target.value)}
                        placeholder="Filtrar por Nome ou Razão Social"
                    />
                </FiltroGroup>
            </FiltrosContainer>

            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>CNPJ</th>
                        <th>Razão Social</th>
                        <th>Marcas</th>
                        <th>Observações</th>
                    </tr>
                </thead>
                <tbody>
                    {fornecedores
                        .filter(f =>
                            (f.pessoa_nome?.toLowerCase() || "").includes(filtroTexto.toLowerCase()) ||
                            (f.razao_social?.toLowerCase() || "").includes(filtroTexto.toLowerCase())
                        )
                        .map(f => (
                            <tr key={f.idFornecedor} onClick={() => buscarDetalhesFornecedor(f.idFornecedor)}>
                                <td>{f.pessoa_nome}</td>
                                <td>{f.cnpj}</td>
                                <td>{f.razao_social}</td>
                                <td>{f.marcas_nome}</td>
                                <td>{f.observacao}</td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {fornecedorSelecionadoDetalhes && (
                <ModalOverlay onClick={() => setFornecedorSelecionadoDetalhes(null)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <CloseButton onClick={() => setFornecedorSelecionadoDetalhes(null)}>
                            <FiX />
                        </CloseButton>
                        <h3>Detalhes do Fornecedor</h3>
                        <Section><strong>Nome:</strong> {fornecedorSelecionadoDetalhes.nome_fornecedor}</Section>
                        <Section><strong>Telefone:</strong> {fornecedorSelecionadoDetalhes.telefone_1}</Section>
                        <Section><strong>Email:</strong> {fornecedorSelecionadoDetalhes.email}</Section>
                        <Section><strong>Total Compras:</strong> {fornecedorSelecionadoDetalhes.total_compras}</Section>
                        <Section>
                            <strong>Valor Total Comprado:</strong>{" "}
                            R$ {
                                !isNaN(parseFloat(fornecedorSelecionadoDetalhes.valor_total_comprado))
                                    ? parseFloat(fornecedorSelecionadoDetalhes.valor_total_comprado).toFixed(2)
                                    : "0,00"
                            }
                        </Section>

                        <Section><strong>Data Última Compra:</strong> {fornecedorSelecionadoDetalhes.data_ultima_compra ? new Date(fornecedorSelecionadoDetalhes.data_ultima_compra).toLocaleDateString() : "-"}</Section>
                        <Section><strong>Observação:</strong> {fornecedorSelecionadoDetalhes.observacao || "-"}</Section>

                        <h3>Histórico de Compras:</h3>
                        {fornecedorSelecionadoDetalhes.historico_compras?.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Data da Compra</th>
                                        <th>Qtde</th>
                                        <th>Produto</th>
                                        <th>Marca</th>
                                        <th>Categoria</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fornecedorSelecionadoDetalhes.historico_compras.map((compra) =>
                                        compra.itens?.map((item, index) => (
                                            <tr key={`${compra.id_compra}-${index}`}>
                                                <td>{new Date(compra.dt_compra).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                                <td>{item.quantidade}</td>
                                                <td>{item.produto}</td>
                                                <td>{item.marca}</td>
                                                <td>{item.categoria}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <p>Nenhum histórico de compras disponível.</p>
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

export default RelatorioPerfilFornecedor;
