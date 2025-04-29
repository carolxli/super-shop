import React, { useEffect, useState } from "react";
import axios from "axios";

const PurchaseListComponent = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSuccessRegisterMessage, setShowSuccessRegisterMessage] =
    useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState(null);

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

  const handleDeleteClick = (purchaseId) => {
    setPurchaseToDelete(purchaseId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8800/purchase/${purchaseToDelete}`);
      // Atualiza a lista após excluir
      fetchPurchases();
      // Fecha o modal de confirmação
      setShowDeleteConfirmation(false);
      setPurchaseToDelete(null);
      // Mostra mensagem de sucesso
      setShowSuccessMessage(true);
      // Fecha automaticamente a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error("Erro ao deletar compra:", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setPurchaseToDelete(null);
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

    if (filters.startDate && filters.endDate) {
      // Create date objects for comparison but set time to start/end of day
      const startDate = new Date(filters.startDate);
      startDate.setHours(0, 0, 0, 0); // Start of day

      const endDate = new Date(filters.endDate);
      endDate.setHours(0, 0, 0, 0); // End of day

      filtered = filtered.filter((p) => {
        const purchaseDate = new Date(p.purchaseDate);
        return purchaseDate >= startDate && purchaseDate <= endDate;
      });
    } else if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      startDate.setHours(0, 0, 0, 0);

      filtered = filtered.filter((p) => new Date(p.purchaseDate) >= startDate);
    } else if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter((p) => new Date(p.purchaseDate) <= endDate);
    }

    if (filters.paymentMethod) {
      filtered = filtered.filter(
        (p) => p.paymentMethod === filters.paymentMethod
      );
    }

    if (filters.maxValue && !isNaN(parseFloat(filters.maxValue))) {
      filtered = filtered.filter(
        (p) => parseFloat(p.totalValue) <= parseFloat(filters.maxValue)
      );
    }

    setFilteredPurchases(filtered);
  };

  // Calcular os somatórios
  const calculateTotals = () => {
    let totalValue = 0;
    let totalWithDiscount = 0;

    filteredPurchases.forEach((purchase) => {
      totalValue +=
        parseFloat(purchase.totalValue || 0) +
        parseFloat(purchase.discount || 0);
      totalWithDiscount += parseFloat(purchase.totalValue || 0);
    });

    return {
      totalValue,
      totalWithDiscount,
    };
  };

  const totals = calculateTotals();

  const cellStyle = {
    border: "1px solid #ddd",
    padding: "10px",
  };

  // Estilos comuns para containers
  const containerStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  // Estilos comuns para títulos de seção
  const sectionTitleStyle = {
    textAlign: "center",
    margin: "0 0 20px 0",
    color: "#1976d2",
    fontWeight: "600",
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: "10px",
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
        Compras Realizadas
      </h2>

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
        {/* Painel de Filtros */}
        <div
          style={{
            ...containerStyle,
            width: "280px",
            height: "fit-content",
          }}
        >
          <h3 style={sectionTitleStyle}>Filtros</h3>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
                color: "#555",
              }}
            >
              Data Inicial
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              style={{
                padding: "10px 12px",
                width: "100%",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
                color: "#555",
              }}
            >
              Data Final
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              style={{
                padding: "10px 12px",
                width: "100%",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
                color: "#555",
              }}
            >
              Valor Máximo
            </label>
            <input
              type="number"
              name="maxValue"
              value={filters.maxValue}
              onChange={handleFilterChange}
              placeholder="R$ 0,00"
              style={{
                padding: "10px 12px",
                width: "100%",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
                color: "#555",
              }}
            >
              Forma de Pagamento
            </label>
            <select
              name="paymentMethod"
              value={filters.paymentMethod}
              onChange={handleFilterChange}
              style={{
                padding: "10px 12px",
                width: "100%",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                backgroundColor: "#fff",
                boxSizing: "border-box",
              }}
            >
              <option value="">Todos</option>
              <option value="Cartão">Cartão</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Pix">Pix</option>
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Boleto">Boleto</option>
            </select>
          </div>

          <button
            onClick={applyFilters}
            style={{
              padding: "12px 15px",
              width: "100%",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500",
              transition: "background-color 0.2s",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            Aplicar Filtros
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div style={{ flex: 1 }}>
          {/* Tabela */}
          <div
            style={{
              ...containerStyle,
              marginBottom: "24px",
              overflowX: "auto",
            }}
          >
            <h3 style={sectionTitleStyle}>Lista de Compras</h3>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "800px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f2f2f2" }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px 16px",
                        borderBottom: "2px solid #e0e0e0",
                      }}
                    >
                      ID
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px 16px",
                        borderBottom: "2px solid #e0e0e0",
                      }}
                    >
                      Data
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px 16px",
                        borderBottom: "2px solid #e0e0e0",
                      }}
                    >
                      Forma de Pagamento
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "12px 16px",
                        borderBottom: "2px solid #e0e0e0",
                      }}
                    >
                      Preço Compra
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "12px 16px",
                        borderBottom: "2px solid #e0e0e0",
                      }}
                    >
                      Preço Venda
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "12px 16px",
                        borderBottom: "2px solid #e0e0e0",
                      }}
                    >
                      Desconto
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "12px 16px",
                        borderBottom: "2px solid #e0e0e0",
                      }}
                    >
                      Valor Com Desconto
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "12px 16px",
                        borderBottom: "2px solid #e0e0e0",
                        width: "180px",
                      }}
                    >
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPurchases.length > 0 ? (
                    filteredPurchases.map((purchase) => (
                      <tr
                        key={purchase.purchaseId}
                        style={{
                          borderBottom: "1px solid #f0f0f0",
                          transition: "background-color 0.2s",
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                          },
                        }}
                      >
                        <td style={{ padding: "14px 16px" }}>
                          {purchase.purchaseId}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {new Date(purchase.purchaseDate).toLocaleDateString(
                            "pt-BR"
                          )}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {purchase.paymentMethod}
                        </td>
                        <td
                          style={{ textAlign: "right", padding: "14px 16px" }}
                        >
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(purchase.purchaseValue || 0)}
                        </td>
                        <td
                          style={{ textAlign: "right", padding: "14px 16px" }}
                        >
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(
                            parseFloat(purchase.totalValue || 0) +
                              parseFloat(purchase.discount || 0)
                          )}
                        </td>
                        <td
                          style={{ textAlign: "right", padding: "14px 16px" }}
                        >
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(purchase.discount || 0)}
                        </td>
                        <td
                          style={{ textAlign: "right", padding: "14px 16px" }}
                        >
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(purchase.totalValue || 0)}
                        </td>
                        <td style={{ padding: "10px 16px" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "8px",
                            }}
                          >
                            <button
                              onClick={() =>
                                handleViewProducts(purchase.purchaseId)
                              }
                              style={{
                                padding: "8px 12px",
                                backgroundColor: "#90caf9",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                transition: "background-color 0.2s",
                              }}
                            >
                              Visualizar
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteClick(purchase.purchaseId)
                              }
                              style={{
                                padding: "8px 12px",
                                backgroundColor: "#f44336",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                transition: "background-color 0.2s",
                              }}
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        style={{ padding: "20px", textAlign: "center" }}
                      >
                        Nenhuma compra encontrada com os filtros selecionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Div para exibir o somatório dos valores */}
          <div
            style={{
              ...containerStyle,
            }}
          >
            <h3 style={sectionTitleStyle}>Resumo</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 20px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
              }}
            >
              <div>
                <p
                  style={{
                    fontWeight: "bold",
                    margin: "8px 0",
                    fontSize: "16px",
                  }}
                >
                  Preço Venda Total:
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    margin: "8px 0",
                    fontSize: "16px",
                  }}
                >
                  Valor Com Desconto:
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    margin: "8px 0",
                    color: "#1976d2",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totals.totalValue)}
                </p>
                <p
                  style={{
                    margin: "8px 0",
                    color: "#1976d2",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totals.totalWithDiscount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Produtos */}
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
              maxWidth: "700px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: "#1976d2",
              }}
            >
              Produtos da Compra
            </h2>

            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                marginBottom: "20px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#fff",
                  }}
                >
                  <tr style={{ backgroundColor: "#e3f2fd" }}>
                    <th style={cellStyle}>ID</th>
                    <th style={cellStyle}>Descrição</th>
                    <th style={cellStyle}>Preço Compra</th>
                    <th style={cellStyle}>Preço Venda</th>
                    <th style={cellStyle}>Fornecedor</th>
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
                        }).format(product.purchaseValue || 0)}
                      </td>
                      <td style={cellStyle}>
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(product.saleValue || 0)}
                      </td>
                      <td style={cellStyle}>
                        {product.supplierName || "Não informado"}
                      </td>
                      <td style={cellStyle}>{product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={closeModal}
                style={{
                  padding: "10px 24px",
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirmation && (
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
              maxWidth: "400px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                marginBottom: "20px",
                textAlign: "center",
                color: "#d32f2f",
              }}
            >
              Confirmar Exclusão
            </h3>
            <p style={{ marginBottom: "25px" }}>
              Tem certeza que deseja excluir esta compra? Esta ação não pode ser
              desfeita.
            </p>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "15px" }}
            >
              <button
                onClick={cancelDelete}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#9e9e9e",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sucesso de Exclusão */}
      {showSuccessMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#4caf50",
            color: "white",
            padding: "15px 25px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <div style={{ marginRight: "10px", fontSize: "20px" }}>✓</div>
          <div>
            <p style={{ margin: 0, fontWeight: "500" }}>
              Compra apagada com sucesso!
            </p>
          </div>
        </div>
      )}

      {/* Modal de Sucesso de Cadastro */}
      {showSuccessRegisterMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#4caf50",
            color: "white",
            padding: "15px 25px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <div style={{ marginRight: "10px", fontSize: "20px" }}>✓</div>
          <div>
            <p style={{ margin: 0, fontWeight: "500" }}>
              Compra cadastrada com sucesso!
            </p>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          tr:hover {
            background-color: #f5f5f5;
          }
          
          button:hover {
            opacity: 0.9;
          }
        `}
      </style>
    </div>
  );
};

export default PurchaseListComponent;
