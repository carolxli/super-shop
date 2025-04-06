import React, { useEffect, useState } from "react";
import axios from "axios";

const PurchaseListComponent = () => {
  const [purchases, setPurchases] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

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
    } catch (error) {
      console.error("Erro ao buscar compras:", error);
    }
  };

  const handleViewProducts = async (purchaseId) => {
    try {
      const response = await axios.get(
        `http://localhost:8800/purchase/${purchaseId}`
      );

      console.log(response.data);
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

  const cellStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
  };

  return (
    <div>
      <h2>Compras Realizadas</h2>
      <table border="0" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Desconto</th>
            <th>Pagamento</th>
            <th>Valor Total</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase.purchaseId}>
              <td>{purchase.purchaseId}</td>
              <td>
                {new Date(purchase.purchaseDate).toLocaleDateString("pt-BR")}
              </td>
              <td>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(purchase.discount)}
              </td>
              <td>{purchase.paymentMethod}</td>
              <td>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(purchase.totalValue)}
              </td>
              <td>
                <button onClick={() => handleViewProducts(purchase.purchaseId)}>
                  Visualizar Produtos
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para exibir produtos */}
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
                  <th style={cellStyle}>Valor</th>
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
