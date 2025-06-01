import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  color: #333;
  display: flex;
  justify-content: center;
  text-align: center;
  margin-bottom: 30px;
`;

const FiltersAndExportContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: end;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: end;
  flex-wrap: wrap;
`;

const ExportContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FilterLabel = styled.label`
  font-size: 12px;
  font-weight: bold;
  color: #495057;
`;

const FilterInput = styled.input`
  padding: 8px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  width: 140px;
  margin-right: 10px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const FilterSelect = styled.select`
  padding: 8px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  width: 140px;
  background-color: white;
  margin-right: 10px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const ClearFiltersButton = styled.button`
  padding: 8px 12px;
  font-size: 12px;
  background-color: #868e96;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #6c757d;
  }
`;

const ExportButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  font-size: 12px;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #0056b3;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const StyledTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  background-color: white;
`;

const TableHeader = styled.thead`
  background-color: #5ba3d4;
`;

const TableHeaderCell = styled.th`
  padding: 15px 10px;
  text-align: left;
  font-weight: bold;
  color: white;
  border-bottom: 2px solid #dee2e6;
  font-size: 14px;
`;

const TableCell = styled.td`
  padding: 12px 10px;
  border-bottom: 1px solid #dee2e6;
  font-size: 14px;
  color: #495057;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin: 20px 0;
`;

const TotalsContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
  text-align: right;
`;

const TotalText = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #495057;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  ${(props) => {
    switch (props.status?.toLowerCase()) {
      case "pago":
        return "background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;";
      case "pendente":
        return "background-color: #fff3cd; color: #856404; border: 1px solid #ffeaa7;";
      case "vencido":
        return "background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;";
      default:
        return "background-color: #e2e3e5; color: #6c757d; border: 1px solid #ced4da;";
    }
  }}
`;

const ExpenseReport = () => {
  const [despesas, setDespesas] = useState([]);
  const [despesasFiltradas, setDespesasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtros, setFiltros] = useState({
    dataInicio: "",
    dataFim: "",
    valorMin: "",
    valorMax: "",
    status: "",
  });

  useEffect(() => {
    fetchDespesas();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [despesas, filtros]);

  const fetchDespesas = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8800/despesa");
      if (!response.ok) throw new Error("Erro na requisição");

      const data = await response.json();
      setDespesas(data);
      setDespesasFiltradas(data);
      setError("");
    } catch (err) {
      setError("Erro ao carregar dados do relatório");
      console.error("Erro na requisição:", err);
    } finally {
      setLoading(false);
    }
  };

  const normalizarData = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const aplicarFiltros = () => {
    let despesasTemp = [...despesas];

    console.log("Filtros aplicados:", filtros);
    console.log("Total de despesas antes do filtro:", despesasTemp.length);

    if (filtros.dataInicio) {
      const dataInicioNormalizada = normalizarData(filtros.dataInicio);
      console.log("Data início normalizada:", dataInicioNormalizada);

      despesasTemp = despesasTemp.filter((despesa) => {
        const dataVencimento = normalizarData(despesa.dt_vencimento);
        const resultado =
          dataVencimento && dataVencimento >= dataInicioNormalizada;

        if (despesa.dt_vencimento) {
          console.log(
            `Despesa ${despesa.id}: ${despesa.dt_vencimento} -> ${dataVencimento} >= ${dataInicioNormalizada} = ${resultado}`
          );
        }

        return resultado;
      });

      console.log("Após filtro data início:", despesasTemp.length);
    }

    if (filtros.dataFim) {
      const dataFimNormalizada = normalizarData(filtros.dataFim);
      console.log("Data fim normalizada:", dataFimNormalizada);

      despesasTemp = despesasTemp.filter((despesa) => {
        const dataVencimento = normalizarData(despesa.dt_vencimento);
        const resultado =
          dataVencimento && dataVencimento <= dataFimNormalizada;

        if (despesa.dt_vencimento) {
          console.log(
            `Despesa ${despesa.id}: ${despesa.dt_vencimento} -> ${dataVencimento} <= ${dataFimNormalizada} = ${resultado}`
          );
        }

        return resultado;
      });

      console.log("Após filtro data fim:", despesasTemp.length);
    }

    if (filtros.valorMin) {
      despesasTemp = despesasTemp.filter(
        (despesa) => Number(despesa.valor) >= Number(filtros.valorMin)
      );
      console.log("Após filtro valor mín:", despesasTemp.length);
    }

    if (filtros.valorMax) {
      despesasTemp = despesasTemp.filter(
        (despesa) => Number(despesa.valor) <= Number(filtros.valorMax)
      );
      console.log("Após filtro valor máx:", despesasTemp.length);
    }

    if (filtros.status) {
      despesasTemp = despesasTemp.filter(
        (despesa) =>
          despesa.status?.toLowerCase() === filtros.status.toLowerCase()
      );
      console.log("Após filtro status:", despesasTemp.length);
    }

    console.log("Total final após todos os filtros:", despesasTemp.length);
    setDespesasFiltradas(despesasTemp);
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const limparFiltros = () => {
    setFiltros({
      dataInicio: "",
      dataFim: "",
      valorMin: "",
      valorMax: "",
      status: "",
    });
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const calcularTotalDespesas = () =>
    despesasFiltradas.reduce(
      (total, despesa) => total + Number(despesa.valor || 0),
      0
    );

  const calcularTotalPagas = () =>
    despesasFiltradas
      .filter((despesa) => despesa.status?.toLowerCase() === "pago")
      .reduce((total, despesa) => total + Number(despesa.valor || 0), 0);

  const calcularTotalPendentes = () =>
    despesasFiltradas
      .filter((despesa) => despesa.status?.toLowerCase() === "pendente")
      .reduce((total, despesa) => total + Number(despesa.valor || 0), 0);

  const exportarPDF = () => {
    const doc = new jsPDF();
    const headers = [
      "Data Despesa",
      "Data Vencimento",
      "Valor",
      "Método Pagamento",
      "Descrição",
      "Status",
      "Tipo",
    ];

    const rows = despesasFiltradas.map((despesa) => [
      formatDate(despesa.dt_despesa),
      formatDate(despesa.dt_vencimento),
      formatCurrency(despesa.valor),
      despesa.metodo_pgmto || "-",
      despesa.descricao || "-",
      despesa.status || "-",
      despesa.Tipo_idTipo || "-",
    ]);

    autoTable(doc, {
      head: [headers],
      body: rows,
      styles: {
        fontSize: 10,
        cellPadding: 4,
        halign: "left",
        valign: "middle",
      },
      headStyles: {
        fontStyle: "bold",
        fillColor: [91, 163, 212],
        textColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: "#f8f9fa",
      },
      margin: { top: 30 },
      theme: "grid",
      didDrawPage: (data) => {
        doc.setFontSize(16);
        doc.text("Relatório de Despesas", data.settings.margin.left, 10);
        doc.setFontSize(10);
        doc.text(
          `Gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
          data.settings.margin.left,
          20
        );
      },
    });

    doc.addPage();
    doc.setFontSize(14);
    doc.text("Resumo Financeiro", 20, 30);
    doc.setFontSize(12);
    doc.text(
      `Total de Despesas: ${formatCurrency(calcularTotalDespesas())}`,
      20,
      50
    );
    doc.text(`Total Pagas: ${formatCurrency(calcularTotalPagas())}`, 20, 65);
    doc.text(
      `Total Pendentes: ${formatCurrency(calcularTotalPendentes())}`,
      20,
      80
    );

    doc.save("relatorio_despesas.pdf");
  };

  const exportarExcel = () => {
    const csvContent = gerarCSV();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "relatorio-despesas.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const gerarCSV = () => {
    const headers = [
      "Data Despesa",
      "Data Vencimento",
      "Valor",
      "Método Pagamento",
      "Descrição",
      "Status",
      "Tipo",
    ];

    const csvRows = [headers.join(",")];

    despesasFiltradas.forEach((despesa) => {
      const row = [
        formatDate(despesa.dt_despesa),
        formatDate(despesa.dt_vencimento),
        despesa.valor || 0,
        `"${despesa.metodo_pgmto || ""}"`,
        `"${despesa.descricao || ""}"`,
        `"${despesa.status || ""}"`,
        despesa.Tipo_idTipo || "",
      ];
      csvRows.push(row.join(","));
    });

    return csvRows.join("\n");
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Carregando relatório...</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Relatório de Despesas</Title>

      <FiltersAndExportContainer>
        <FiltersContainer>
          <FilterGroup>
            <FilterLabel>Vencimento Início</FilterLabel>
            <FilterInput
              type="date"
              value={filtros.dataInicio}
              onChange={(e) => handleFiltroChange("dataInicio", e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Vencimento Fim</FilterLabel>
            <FilterInput
              type="date"
              value={filtros.dataFim}
              onChange={(e) => handleFiltroChange("dataFim", e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Valor Mín.</FilterLabel>
            <FilterInput
              type="number"
              placeholder="0,00"
              value={filtros.valorMin}
              onChange={(e) => handleFiltroChange("valorMin", e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Valor Máx.</FilterLabel>
            <FilterInput
              type="number"
              placeholder="0,00"
              value={filtros.valorMax}
              onChange={(e) => handleFiltroChange("valorMax", e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Status</FilterLabel>
            <FilterSelect
              value={filtros.status}
              onChange={(e) => handleFiltroChange("status", e.target.value)}
            >
              <option value="">Todos</option>
              <option value="pago">Pago</option>
              <option value="pendente">Pendente</option>
              <option value="vencido">Vencido</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <ClearFiltersButton onClick={limparFiltros}>
              🗑️ Limpar
            </ClearFiltersButton>
          </FilterGroup>
        </FiltersContainer>

        <ExportContainer>
          <ExportButton onClick={exportarPDF}>📄 PDF</ExportButton>
          <ExportButton onClick={exportarExcel}>📊 Excel</ExportButton>
        </ExportContainer>
      </FiltersAndExportContainer>

      <TableContainer>
        <StyledTable>
          <TableHeader>
            <tr>
              <TableHeaderCell>Data Despesa</TableHeaderCell>
              <TableHeaderCell>Data Vencimento</TableHeaderCell>
              <TableHeaderCell>Valor</TableHeaderCell>
              <TableHeaderCell>Método Pagamento</TableHeaderCell>
              <TableHeaderCell>Descrição</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Tipo</TableHeaderCell>
            </tr>
          </TableHeader>
          <tbody>
            {despesasFiltradas.length === 0 ? (
              <tr>
                <TableCell
                  colSpan={7}
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  {despesas.length === 0
                    ? "Despesas não encontradas"
                    : "Nenhuma despesa encontrada com os filtros aplicados"}
                </TableCell>
              </tr>
            ) : (
              despesasFiltradas.map((despesa, index) => (
                <tr
                  key={despesa.id || index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "white" : "#f8f9fa",
                  }}
                >
                  <TableCell>{formatDate(despesa.dt_despesa)}</TableCell>
                  <TableCell>{formatDate(despesa.dt_vencimento)}</TableCell>
                  <TableCell>{formatCurrency(despesa.valor)}</TableCell>
                  <TableCell>{despesa.metodo_pgmto || "-"}</TableCell>
                  <TableCell>{despesa.descricao || "-"}</TableCell>
                  <TableCell>
                    <StatusBadge status={despesa.status}>
                      {despesa.status || "-"}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{despesa.Tipo_idTipo || "-"}</TableCell>
                </tr>
              ))
            )}
          </tbody>
        </StyledTable>
      </TableContainer>

      {despesasFiltradas.length > 0 && (
        <TotalsContainer>
          <TotalText>
            Total de Despesas: {formatCurrency(calcularTotalDespesas())}
          </TotalText>
          <br />
          <TotalText>
            Total Pagas: {formatCurrency(calcularTotalPagas())}
          </TotalText>
          <br />
          <TotalText>
            Total Pendentes: {formatCurrency(calcularTotalPendentes())}
          </TotalText>
        </TotalsContainer>
      )}
    </Container>
  );
};

export default ExpenseReport;
