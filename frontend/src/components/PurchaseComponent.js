import React, { useState, useEffect } from "react";
import axios from "axios";

const PurchaseComponent = () => {
  const [formData, setFormData] = useState({
    purchaseDate: "",
    totalValue: "",
    discount: "",
    paymentMethod: "",
  });

  const [currentProduct, setCurrentProduct] = useState({
    productId: "",
    productDescription: "",
    saleValue: "",
    quantity: "",
  });

  const [products, setProducts] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  useEffect(() => {
    // Carregar os produtos para o dropdown
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/purchase/products"
        );
        setProductOptions(response.data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        alert("Erro ao carregar produtos!");
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductChange = (e) => {
    const selectedProduct = productOptions.find(
      (product) => product.productId === parseInt(e.target.value)
    );
    if (selectedProduct) {
      setCurrentProduct({
        productId: selectedProduct.productId,
        productDescription: selectedProduct.productDescription,
        saleValue: selectedProduct.saleValue,
        quantity: "",
      });
    }
  };

  const handleQuantityChange = (e) => {
    setCurrentProduct({
      ...currentProduct,
      quantity: parseInt(e.target.value, 10) || 0,
    });
  };

  const addProduct = () => {
    if (currentProduct.productId && currentProduct.quantity) {
      setProducts([...products, currentProduct]);
      setCurrentProduct({
        productId: "",
        productDescription: "",
        saleValue: "",
        quantity: "",
      });
    } else {
      alert("Selecione um produto e preencha a quantidade.");
    }
  };

  const calculateTotalValue = () => {
    const total = products.reduce(
      (total, product) => total + product.saleValue * product.quantity,
      0
    );

    formData.totalValue = parseFloat(total) - parseFloat(formData.discount);
    formData.discount = parseFloat(formData.discount) || 0;

    return total;
  };

  const inputBase = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    backgroundColor: "#90caf9",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  };

  const cellStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (products.length === 0) {
      alert("Adicione ao menos um produto à compra antes de cadastrar.");
      return;
    }
    try {
      // Calcula o total com base nos produtos adicionados
      const total = products.reduce(
        (acc, product) => acc + product.saleValue * product.quantity,
        0
      );

      const discount = parseFloat(formData.discount) || 0;
      const totalValue = total - discount;

      // Cria um array somente com productId e quantity
      const minimalProducts = products.map(({ productId, quantity }) => ({
        productId,
        quantity,
      }));

      // Cria o objeto de dados da compra
      const purchaseData = {
        ...formData,
        totalValue,
        products: minimalProducts,
      };

      // Exibe os dados da compra no console
      alert("Dados da compra:\n" + JSON.stringify(purchaseData, null, 2));
      console.log(purchaseData);

      await axios.post("http://localhost:8800/purchase", purchaseData);

      alert("Compra cadastrada com sucesso!");
      setFormData({
        purchaseDate: "",
        totalValue: "",
        discount: "",
        paymentMethod: "",
      });
      setProducts([]);
    } catch (error) {
      console.error("Erro ao cadastrar compra:", error);
      if (error.response) {
        console.error("Resposta do servidor:", error.response.data);
        alert(
          "Erro: " + error.response.data.message || "Erro ao cadastrar compra!"
        );
      } else {
        alert("Erro ao cadastrar compra!");
      }
    }
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h2
          style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}
        >
          Registro de Compras
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: "20px",
            rowGap: "20px",
            alignItems: "start",
          }}
        >
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>
              *Data da Compra:
            </label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleInputChange}
              required
              style={{ ...inputBase, width: "90%" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px" }}>
              *Desconto:
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              required
              style={{ ...inputBase, width: "80%" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px" }}>
              *Forma de Pagamento:
            </label>
            <input
              type="text"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              required
              style={{ ...inputBase, width: "80%" }}
            />
          </div>
        </div>

        {/* Produto + Quantidade */}
        <div>
          <label>*Adicionar Produto:</label>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "8px",
            }}
          >
            <select
              onChange={handleProductChange}
              value={currentProduct.productId}
              style={{ flex: 2, ...inputBase }}
            >
              <option value="">Selecione um produto</option>
              {productOptions.map((product) => (
                <option key={product.productId} value={product.productId}>
                  {product.productDescription}
                </option>
              ))}
            </select>

            {currentProduct.productId && (
              <input
                type="number"
                name="quantity"
                placeholder="Quantidade"
                value={currentProduct.quantity}
                onChange={handleQuantityChange}
                style={{ flex: 1, ...inputBase }}
              />
            )}
          </div>
          <button
            type="button"
            onClick={addProduct}
            style={{ ...buttonStyle, marginTop: "10px", width: "100%" }}
          >
            Adicionar Produto
          </button>
        </div>

        {products.length > 0 && (
          <div>
            <h3>Produtos Adicionados:</h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f9f9f9" }}>
                  <th style={cellStyle}>ID</th>
                  <th style={cellStyle}>Descrição</th>
                  <th style={cellStyle}>Valor</th>
                  <th style={cellStyle}>Qtd</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
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
            <h4 style={{ marginTop: "10px" }}>
              Valor Total:{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(calculateTotalValue())}
            </h4>
          </div>
        )}

        <button
          type="submit"
          style={{ ...buttonStyle, width: "100%", fontWeight: "bold" }}
        >
          Cadastrar Compra
        </button>
      </form>
    </div>
  );
};

export default PurchaseComponent;
