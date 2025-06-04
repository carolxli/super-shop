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

const ClearFiltersButton = styled.button`
  padding: 8px 12px;
  font-size: 12px;
  background-color: #868e96;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  white-space: nowrap;
  margin-right: 15px;

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
  background-color: #28a745;
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

const PurchaseReport = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    minValue: "",
    maxValue: "",
    minDiscount: "",
    maxDiscount: "",
    paymentMethod: "",
  });

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [purchases, filters]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8800/purchase");
      if (!response.ok) throw new Error("Request error");

      const data = await response.json();
      setPurchases(data);
      setFilteredPurchases(data);
      setError("");
    } catch (err) {
      setError("Erro ao carregar dados do relatório");
      console.error("Erro na requisição:", err);
    } finally {
      setLoading(false);
    }
  };

  // Função melhorada para normalizar datas
  const normalizeDate = (dateString) => {
    if (!dateString) return null;
    // Se for uma string de data no formato YYYY-MM-DD (filtro), criar data local
    if (
      typeof dateString === "string" &&
      dateString.includes("-") &&
      dateString.length === 10
    ) {
      const [year, month, day] = dateString.split("-");
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    // Para datas vindas da API, usar o formato ISO
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const applyFilters = () => {
    let tempPurchases = [...purchases];

    console.log("Applied filters:", filters);
    console.log("Total purchases before filter:", tempPurchases.length);

    // Filtro por data de início
    if (filters.startDate) {
      const normalizedStartDate = normalizeDate(filters.startDate);
      console.log("Data início normalizada:", normalizedStartDate);

      tempPurchases = tempPurchases.filter((purchase) => {
        const purchaseDate = normalizeDate(purchase.purchaseDate);
        if (!purchaseDate) return false;

        // Comparar apenas as datas (sem horário)
        const purchaseDateOnly = new Date(
          purchaseDate.getFullYear(),
          purchaseDate.getMonth(),
          purchaseDate.getDate()
        );
        const startDateOnly = new Date(
          normalizedStartDate.getFullYear(),
          normalizedStartDate.getMonth(),
          normalizedStartDate.getDate()
        );

        const result = purchaseDateOnly >= startDateOnly;

        console.log(
          `Compra ${purchase.purchaseId}: ${
            purchase.purchaseDate
          } -> ${purchaseDateOnly.toDateString()} >= ${startDateOnly.toDateString()} = ${result}`
        );

        return result;
      });

      console.log("Após filtro data início:", tempPurchases.length);
    }

    // Filtro por data de fim
    if (filters.endDate) {
      const normalizedEndDate = normalizeDate(filters.endDate);
      console.log("Data fim normalizada:", normalizedEndDate);

      tempPurchases = tempPurchases.filter((purchase) => {
        const purchaseDate = normalizeDate(purchase.purchaseDate);
        if (!purchaseDate) return false;

        // Comparar apenas as datas (sem horário)
        const purchaseDateOnly = new Date(
          purchaseDate.getFullYear(),
          purchaseDate.getMonth(),
          purchaseDate.getDate()
        );
        const endDateOnly = new Date(
          normalizedEndDate.getFullYear(),
          normalizedEndDate.getMonth(),
          normalizedEndDate.getDate()
        );

        const result = purchaseDateOnly <= endDateOnly;

        console.log(
          `Compra ${purchase.purchaseId}: ${
            purchase.purchaseDate
          } -> ${purchaseDateOnly.toDateString()} <= ${endDateOnly.toDateString()} = ${result}`
        );

        return result;
      });

      console.log("Após filtro data fim:", tempPurchases.length);
    }

    // Filtro por valor mínimo
    if (filters.minValue) {
      tempPurchases = tempPurchases.filter(
        (purchase) => Number(purchase.totalValue) >= Number(filters.minValue)
      );
      console.log("After min value filter:", tempPurchases.length);
    }

    // Filtro por valor máximo
    if (filters.maxValue) {
      tempPurchases = tempPurchases.filter(
        (purchase) => Number(purchase.totalValue) <= Number(filters.maxValue)
      );
      console.log("After max value filter:", tempPurchases.length);
    }

    // Filtro por desconto mínimo
    if (filters.minDiscount) {
      tempPurchases = tempPurchases.filter(
        (purchase) =>
          Number(purchase.discount || 0) >= Number(filters.minDiscount)
      );
      console.log("After min discount filter:", tempPurchases.length);
    }

    // Filtro por desconto máximo
    if (filters.maxDiscount) {
      tempPurchases = tempPurchases.filter(
        (purchase) =>
          Number(purchase.discount || 0) <= Number(filters.maxDiscount)
      );
      console.log("After max discount filter:", tempPurchases.length);
    }

    // Filtro por método de pagamento
    if (filters.paymentMethod) {
      tempPurchases = tempPurchases.filter(
        (purchase) =>
          purchase.paymentMethod &&
          purchase.paymentMethod
            .toLowerCase()
            .includes(filters.paymentMethod.toLowerCase())
      );
      console.log("After payment method filter:", tempPurchases.length);
    }

    console.log("Final total after all filters:", tempPurchases.length);
    setFilteredPurchases(tempPurchases);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      minValue: "",
      maxValue: "",
      minDiscount: "",
      maxDiscount: "",
      paymentMethod: "",
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

  // Função para calcular o valor original (valor com desconto + desconto)
  const calculateOriginalValue = (purchase) => {
    const totalValue = Number(purchase.totalValue || 0);
    const discount = Number(purchase.discount || 0);
    return totalValue + discount;
  };

  const calculateTotalPurchases = () =>
    filteredPurchases.reduce(
      (total, purchase) => total + Number(purchase.totalValue || 0),
      0
    );

  const calculateTotalDiscount = () =>
    filteredPurchases.reduce(
      (total, purchase) => total + Number(purchase.discount || 0),
      0
    );

  const calculateAverageValue = () => {
    if (filteredPurchases.length === 0) return 0;
    return calculateTotalPurchases() / filteredPurchases.length;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const headers = [
      "ID da Compra",
      "Data da Compra",
      "Valor",
      "Valor com Desconto",
      "Desconto",
      "Método de Pagamento",
    ];

    const rows = filteredPurchases.map((purchase) => [
      purchase.purchaseId || "-",
      formatDate(purchase.purchaseDate),
      formatCurrency(calculateOriginalValue(purchase)),
      formatCurrency(purchase.totalValue),
      formatCurrency(purchase.discount || 0),
      purchase.paymentMethod || "-",
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
        fillColor: [135, 206, 250], // Azul claro (Light Sky Blue)
        textColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: "#f8f9fa",
      },
      margin: { top: 30 },
      theme: "grid",
      didDrawPage: (data) => {
        doc.setFontSize(16);
        doc.text("Relatório de Compras", data.settings.margin.left, 10);
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
      `Total de Compras: ${formatCurrency(calculateTotalPurchases())}`,
      20,
      50
    );
    doc.text(
      `Total de Desconto: ${formatCurrency(calculateTotalDiscount())}`,
      20,
      65
    );
    doc.text(`Valor Médio: ${formatCurrency(calculateAverageValue())}`, 20, 80);

    doc.save("relatorio_compras.pdf");
  };

  const exportToExcel = () => {
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "relatorio-compras.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const generateCSV = () => {
    const headers = [
      "ID da Compra",
      "Data da Compra",
      "Valor",
      "Valor com Desconto",
      "Desconto",
      "Método de Pagamento",
    ];

    const csvRows = [headers.join(",")];

    filteredPurchases.forEach((purchase) => {
      const row = [
        purchase.purchaseId || "",
        formatDate(purchase.purchaseDate),
        calculateOriginalValue(purchase),
        purchase.totalValue || 0,
        purchase.discount || 0,
        `"${purchase.paymentMethod || ""}"`,
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
      <Title>Relatório de Compras</Title>

      <FiltersAndExportContainer>
        <FiltersContainer>
          <FilterGroup>
            <FilterLabel>Data Início</FilterLabel>
            <FilterInput
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Data Fim</FilterLabel>
            <FilterInput
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Valor Mín.</FilterLabel>
            <FilterInput
              type="number"
              placeholder="0,00"
              value={filters.minValue}
              onChange={(e) => handleFilterChange("minValue", e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Valor Máx.</FilterLabel>
            <FilterInput
              type="number"
              placeholder="0,00"
              value={filters.maxValue}
              onChange={(e) => handleFilterChange("maxValue", e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Desconto Mín.</FilterLabel>
            <FilterInput
              type="number"
              placeholder="0,00"
              value={filters.minDiscount}
              onChange={(e) =>
                handleFilterChange("minDiscount", e.target.value)
              }
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Desconto Máx.</FilterLabel>
            <FilterInput
              type="number"
              placeholder="0,00"
              value={filters.maxDiscount}
              onChange={(e) =>
                handleFilterChange("maxDiscount", e.target.value)
              }
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Método de Pagamento</FilterLabel>
            <FilterInput
              type="text"
              placeholder="Ex: Cartão, Dinheiro..."
              value={filters.paymentMethod}
              onChange={(e) =>
                handleFilterChange("paymentMethod", e.target.value)
              }
            />
          </FilterGroup>

          <FilterGroup>
            <ClearFiltersButton onClick={clearFilters}>
              🗑️ Limpar
            </ClearFiltersButton>
          </FilterGroup>
        </FiltersContainer>

        <ExportContainer>
          <ExportButton onClick={exportToPDF}>📄 PDF</ExportButton>
          <ExportButton onClick={exportToExcel}>📊 Excel</ExportButton>
        </ExportContainer>
      </FiltersAndExportContainer>

      <TableContainer>
        <StyledTable>
          <TableHeader>
            <tr>
              <TableHeaderCell>ID da Compra</TableHeaderCell>
              <TableHeaderCell>Data da Compra</TableHeaderCell>
              <TableHeaderCell>Valor</TableHeaderCell>
              <TableHeaderCell>Valor com Desconto</TableHeaderCell>
              <TableHeaderCell>Desconto</TableHeaderCell>
              <TableHeaderCell>Método de Pagamento</TableHeaderCell>
            </tr>
          </TableHeader>
          <tbody>
            {filteredPurchases.length === 0 ? (
              <tr>
                <TableCell
                  colSpan={6}
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  {purchases.length === 0
                    ? "Compras não encontradas"
                    : "Nenhuma compra encontrada com os filtros aplicados"}
                </TableCell>
              </tr>
            ) : (
              filteredPurchases.map((purchase, index) => (
                <tr
                  key={purchase.purchaseId || index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "white" : "#f8f9fa",
                  }}
                >
                  <TableCell>{purchase.purchaseId || "-"}</TableCell>
                  <TableCell>{formatDate(purchase.purchaseDate)}</TableCell>
                  <TableCell>
                    {formatCurrency(calculateOriginalValue(purchase))}
                  </TableCell>
                  <TableCell>{formatCurrency(purchase.totalValue)}</TableCell>
                  <TableCell>
                    {formatCurrency(purchase.discount || 0)}
                  </TableCell>
                  <TableCell>{purchase.paymentMethod || "-"}</TableCell>
                </tr>
              ))
            )}
          </tbody>
        </StyledTable>
      </TableContainer>

      {filteredPurchases.length > 0 && (
        <TotalsContainer>
          <TotalText>
            Total de Compras: {formatCurrency(calculateTotalPurchases())}
          </TotalText>
          <br />
          <TotalText>
            Total de Desconto: {formatCurrency(calculateTotalDiscount())}
          </TotalText>
          <br />
          <TotalText>
            Valor Médio: {formatCurrency(calculateAverageValue())}
          </TotalText>
        </TotalsContainer>
      )}
    </Container>
  );
};

export default PurchaseReport;
