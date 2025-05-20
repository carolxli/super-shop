import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const BotaoExportar = styled.button`
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


const RelatorioVendas = () => {
    const [vendas, setVendas] = useState([]);
    const [vendasFiltradas, setVendasFiltradas] = useState([]);
    const [descricaoFiltro, setDescricaoFiltro] = useState("");


    const [dataInicial, setDataInicial] = useState("");
    const [dataFinal, setDataFinal] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:8800/venda/relatorioVendas")
            .then((response) => {
                setVendas(response.data);
                setVendasFiltradas(response.data);
            })
            .catch((error) => {
                console.error("Erro ao buscar dados:", error);
            });
    }, []);

    useEffect(() => {
        filtrarVendas();
    }, [dataInicial, dataFinal, descricaoFiltro]);

   const filtrarVendas = () => {
  let filtrado = [...vendas];

  if (dataInicial) {
    const dataInicio = new Date(dataInicial);
    filtrado = filtrado.filter((venda) => new Date(venda.data_venda) >= dataInicio);
  }

  if (dataFinal) {
    const dataFim = new Date(dataFinal);
    filtrado = filtrado.filter((venda) => new Date(venda.data_venda) <= dataFim);
  }

  if (descricaoFiltro.trim() !== "") {
    const descricao = descricaoFiltro.toLowerCase();
    filtrado = filtrado
      .map((venda) => {
        const itensFiltrados = venda.itens.filter((item) =>
          item.descricao.toLowerCase().includes(descricao)
        );
        return itensFiltrados.length > 0 ? { ...venda, itens: itensFiltrados } : null;
      })
      .filter(Boolean); // remove nulls
  }

  setVendasFiltradas(filtrado);
};


    const exportarPDF = () => {
        const doc = new jsPDF();
        const rows = [];

        vendasFiltradas.forEach((venda) => {
            venda.itens.forEach((item, index) => {
                const linha = [
                    index === 0 ? venda.idVenda : "",
                    index === 0 ? new Date(venda.data_venda).toLocaleDateString() : "",
                    item.qtde,
                    item.sku,
                    item.descricao,
                    `R$ ${item.valor_unitario.toFixed(2)}`,
                    `R$ ${item.valor_vendido.toFixed(2)}`,
                    index === 0
                        ? venda.pagamentos.map((pg) => `${pg.metodo_pagamento}: R$ ${pg.valor_pago.toFixed(2)}`).join("\n")
                        : "",
                ];
                rows.push(linha);
            });
        });

        autoTable(doc, {
            head: [["Código", "Data", "Qtde", "SKU", "Produto", "Unitário", "Vendido", "Pagamento"]],
            body: rows,
        });

        doc.save("relatorio_vendas.pdf");
    };

    const exportarExcel = () => {
        const data = [];

        vendasFiltradas.forEach((venda) => {
            venda.itens.forEach((item, index) => {
                data.push({
                    Código: index === 0 ? venda.idVenda : "",
                    Data: index === 0 ? new Date(venda.data_venda).toLocaleDateString() : "",
                    Qtde: item.qtde,
                    SKU: item.sku,
                    Produto: item.descricao,
                    "Valor Unitário": item.valor_unitario,
                    "Valor Vendido": item.valor_vendido,
                    "Pagamento":
                        index === 0
                            ? venda.pagamentos.map((pg) => `${pg.metodo_pagamento}: R$ ${pg.valor_pago.toFixed(2)}`).join(" | ")
                            : "",
                });
            });
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = { Sheets: { vendas: worksheet }, SheetNames: ["vendas"] };
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "relatorio_vendas.xlsx");
    };

    return (
        <>
            <h2>Relatório de Vendas</h2>
            <FiltrosContainer>
                <FiltroGroup>
                    <Label>Data Inicial</Label>
                    <Input type="date" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} />
                </FiltroGroup>
                <FiltroGroup>
                    <Label>Data Final</Label>
                    <Input type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />
                </FiltroGroup>
                <FiltroGroup>
                    <Label>Descrição</Label>
                    <Input type="text" value={descricaoFiltro} onChange={(e) => setDescricaoFiltro(e.target.value)}/>
                </FiltroGroup>
                <FiltroGroup>
                    <BotaoExportar onClick={exportarPDF}>Exportar PDF</BotaoExportar>
                </FiltroGroup>
                <FiltroGroup>
                    <BotaoExportar onClick={exportarExcel}>Exportar Excel</BotaoExportar>
                </FiltroGroup>
            </FiltrosContainer>
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Data da Venda</th>
                        <th>Qtde</th>
                        <th>SKU</th>
                        <th>Produto</th>
                        <th>Valor Unitário</th>
                        <th>Valor Vendido</th>
                        <th>Método de pagamento</th>
                    </tr>
                </thead>
                <tbody>
                    {vendasFiltradas.map((venda) => (
                        <React.Fragment key={venda.idVenda}>
                            {venda.itens.map((item, itemIndex) => (
                                <tr
                                    key={`${venda.idVenda}-${itemIndex}`}
                                    style={itemIndex === 0 ? { borderTop: "3px solid #444" } : {}}
                                >
                                    {itemIndex === 0 && (
                                        <>
                                            <td rowSpan={venda.itens.length}>{venda.idVenda}</td>
                                            <td rowSpan={venda.itens.length}>
                                                {new Date(venda.data_venda).toLocaleDateString()}
                                            </td>
                                        </>
                                    )}
                                    <td>{item.qtde}</td>
                                    <td>{item.sku}</td>
                                    <td>{item.descricao}</td>
                                    <td>R$ {item.valor_unitario.toFixed(2)}</td>
                                    <td>R$ {item.valor_vendido.toFixed(2)}</td>
                                    {itemIndex === 0 && (
                                        <td rowSpan={venda.itens.length}>
                                            {venda.pagamentos.map((pg, i) => (
                                                <div key={i}>
                                                    {pg.metodo_pagamento}: R$ {pg.valor_pago.toFixed(2)}
                                                </div>
                                            ))}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <p>
                Total Vendido: R${" "}
                {vendasFiltradas
                    .reduce(
                        (acc, venda) =>
                            acc + venda.itens.reduce((sub, item) => sub + item.valor_vendido * item.qtde, 0),
                        0
                    )
                    .toFixed(2)}
            </p>
        </>
    );
};

export default RelatorioVendas;
