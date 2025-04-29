import React, { useState, useEffect } from "react";
import axios from "axios";

const PurchaseComponent = () => {
  // States
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

  // Functions
  useEffect(() => {
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

    if (name === "discount") {
      const numericValue = value.replace(/\D/g, "");
      const floatValue = parseFloat(numericValue) / 100;
      const formatted = floatValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      setFormData({ ...formData, discount: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
      // Check if product already exists in the list
      const isDuplicate = products.some(
        (product) => product.productId === currentProduct.productId
      );

      if (isDuplicate) {
        alert("Este produto já foi adicionado à compra!");
        return;
      }

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

    return total;
  };

  const calculateTotalValueWithDiscount = () => {
    const total = products.reduce(
      (total, product) => total + product.saleValue * product.quantity,
      0
    );

    const discount =
      parseFloat(formData.discount.replace(/\D/g, "")) / 100 || 0;

    return total - discount;
  };

  const removeProduct = (indexToRemove) => {
    setProducts(products.filter((_, index) => index !== indexToRemove));
  };

  // Styles
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
      const total = products.reduce(
        (acc, product) => acc + product.saleValue * product.quantity,
        0
      );

      const discount =
        parseFloat(formData.discount.replace(/\D/g, "")) / 100 || 0;

      if (discount > total) {
        alert("O desconto não pode ser maior que o valor total.");
        return;
      }

      const totalValue = total - discount;

      const minimalProducts = products.map(({ productId, quantity }) => ({
        productId,
        quantity,
      }));

      const purchaseData = {
        ...formData,
        discount,
        totalValue,
        products: minimalProducts,
      };

      console.log(purchaseData);

      await axios.post("http://localhost:8800/purchase", purchaseData);

      alert("Compra cadastrada com sucesso!");
      window.location.reload();
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
              type="text"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              required
              style={{ ...inputBase, width: "80%" }}
            />
          </div>

          <div>
            <label>
              *Forma de Pagamento
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
                style={{ ...inputBase, width: "150%" }}
              >
                <option value="">Forma de Pagamento</option>
                <option value="Cartão">Cartão</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Pix">Pix</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Boleto">Boleto</option>
              </select>
            </label>
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
              {productOptions
                .filter((product) => {
                  // Filter out products that are already added to the list
                  return !products.some(
                    (p) => p.productId === product.productId
                  );
                })
                .map((product) => (
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

          {currentProduct.productId && (
            <button
              type="button"
              onClick={addProduct}
              style={{ ...buttonStyle, marginTop: "10px", width: "100%" }}
            >
              Adicionar Produto
            </button>
          )}
        </div>

        {products.length > 0 && (
          <div>
            <h3>Produtos Adicionados</h3>
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
                  <th style={cellStyle}>Valor Unitário</th>
                  <th style={cellStyle}>Valor Total</th>
                  <th style={cellStyle}>Quantidade</th>
                  <th style={cellStyle}>Ações</th>
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
                    <td style={cellStyle}>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(product.saleValue * product.quantity)}
                    </td>
                    <td style={cellStyle}>{product.quantity}</td>
                    <td style={cellStyle}>
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        style={{
                          backgroundColor: "#ef5350",
                          color: "#fff",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Remover
                      </button>
                    </td>
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
            <h4 style={{ marginTop: "10px" }}>
              Valor Com Desconto:{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(calculateTotalValueWithDiscount())}
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
