import React, { useEffect, useState } from "react";
import axios from "axios";

const PurchaseListComponent = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    paymentMethod: "",
    minValue: "",
    maxValue: "",
  });

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get("http://localhost:8800/purchase");
      const sortedPurchases = response.data.sort(
        (a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate)
      );
      setPurchases(sortedPurchases);
      setFilteredPurchases(sortedPurchases);
    } catch (error) {
      console.error("Erro ao buscar compras:", error);
    }
  };

  const handleViewProducts = async (purchaseId) => {
    try {
      const response = await axios.get(
        `http://localhost:8800/purchase/${purchaseId}`
      );

      if (response.data.length > 0) {
        setSelectedProducts(response.data[0].products);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos da compra:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProducts([]);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let filtered = [...purchases];

    if (filters.startDate) {
      filtered = filtered.filter(
        (p) => new Date(p.purchaseDate) >= new Date(filters.startDate)
      );
    }

    if (filters.paymentMethod) {
      filtered = filtered.filter(
        (p) => p.paymentMethod === filters.paymentMethod
      );
    }

    setFilteredPurchases(filtered);
  };

  const cellStyle = {
    border: "1px solid #ddd",
    padding: "10px",
  };

  return (
    <div>
      <h2>Compras Realizadas</h2>

      <div style={{ padding: "0 20px" }}>
        {/* Filtros */}
        <div
          style={{
            display: "flex",
            flexWrap: "nowrap",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
            maxWidth: "100%",
          }}
        >
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            placeholder="Data Inicial"
            style={{
              padding: "8px 12px",
              width: "180px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          />
          <select
            name="paymentMethod"
            value={filters.paymentMethod}
            onChange={handleFilterChange}
            style={{
              padding: "8px 12px",
              width: "180px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              backgroundColor: "#fff",
            }}
          >
            <option value="">Forma de Pagamento</option>
            <option value="Cartão">Cartão</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Pix">Pix</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Boleto">Boleto</option>
          </select>
          <button
            onClick={applyFilters}
            style={{
              padding: "8px 12px",
              width: "180px",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Filtrar
          </button>
        </div>

        {/* Tabela */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
          border="0"
          cellPadding="5"
          cellSpacing="0"
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ textAlign: "left", padding: "8px" }}>ID</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Data</th>
              <th style={{ textAlign: "left", padding: "8px" }}>
                Forma de Pagamento
              </th>
              <th style={{ textAlign: "right", padding: "8px" }}>
                Valor Total
              </th>
              <th style={{ textAlign: "right", padding: "8px" }}>Desconto</th>
              <th style={{ textAlign: "right", padding: "8px" }}>
                Valor Com Desconto
              </th>
              <th style={{ textAlign: "center", padding: "8px" }}>Ações</th>
            </tr>
          </thead>

          <tbody>
            {filteredPurchases.map((purchase) => (
              <tr key={purchase.purchaseId}>
                <td style={{ padding: "8px" }}>{purchase.purchaseId}</td>
                <td style={{ padding: "8px" }}>
                  {new Date(purchase.purchaseDate).toLocaleDateString("pt-BR")}
                </td>
                <td style={{ padding: "8px" }}>{purchase.paymentMethod}</td>
                <td style={{ textAlign: "right", padding: "8px" }}>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(
                    parseFloat(purchase.totalValue) +
                      parseFloat(purchase.discount)
                  )}
                </td>
                <td style={{ textAlign: "right", padding: "8px" }}>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(purchase.discount)}
                </td>
                <td style={{ textAlign: "right", padding: "8px" }}>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(purchase.totalValue)}
                </td>
                <td style={{ textAlign: "center", padding: "8px" }}>
                  <button
                    onClick={() => handleViewProducts(purchase.purchaseId)}
                    style={{
                      padding: "6px 10px",
                      backgroundColor: "#90caf9",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Visualizar Produtos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "30px",
              width: "80%",
              maxWidth: "600px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              Produtos da Compra
            </h2>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#e3f2fd" }}>
                  <th style={cellStyle}>ID</th>
                  <th style={cellStyle}>Descrição</th>
                  <th style={cellStyle}>Valor Unitário</th>
                  <th style={cellStyle}>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product, index) => (
                  <tr key={index}>
                    <td style={cellStyle}>{product.productId}</td>
                    <td style={cellStyle}>{product.productDescription}</td>
                    <td style={cellStyle}>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(product.saleValue)}
                    </td>
                    <td style={cellStyle}>{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={closeModal}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#90caf9",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseListComponent;
