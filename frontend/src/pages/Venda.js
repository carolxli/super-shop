import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  padding: 15px;
  font-size: 14px;
  display: flex;
`;

const Button = styled.button`
  background-color:rgb(77, 168, 204);
  color: #fff;
  border: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  width: 120px;
  margin: 5px;
  margin-left: 180px;
`;

const Textarea = styled.textarea`
  padding: 25px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
`;

const Venda = () => {
  const [nomeCliente, setNomeCliente] = useState('');
  const [clientes, setClientes] = useState([]);
  const [voucher, setVoucher] = useState('');
  const [autocompleteVisible, setAutocompleteVisible] = useState(false);
  const navigate = useNavigate();

  const handleNomeClienteChange = async (e) => {
    const nome = e.target.value;
    setNomeCliente(nome);

    if (nome.length >= 2) {
      try {
        const response = await axios.get(`http://localhost:8800/Pessoa?nome=${nome}`);
        setClientes(response.data);
        setAutocompleteVisible(true);
      } catch (error) {
        console.error("Erro ao buscar pessoas:", error);
      }
    } else {
      setAutocompleteVisible(false);
    }
  };

  const handleClienteSelect = (cliente) => {
    setNomeCliente(cliente.nome);
    setVoucher(cliente.voucher);
    setAutocompleteVisible(false);
  };

  return (
    <Container>
      <h2>Nova Venda</h2>
      <Form>
        <label>
          Cliente
          <input
            type="text"
            name="clienteNome"
            value={nomeCliente || ''}
            onChange={handleNomeClienteChange}
            required
          />
          {autocompleteVisible && (
            <ul className="autocomplete-list">
              {clientes.map((cliente) => (
                <li key={cliente.idCliente} onClick={() => handleClienteSelect(cliente)}>
                  {cliente.nome}
                </li>
              ))}
            </ul>
          )}
        </label>

        <label>
          Saldo
          <input
            type="number"
            name="voucher"
            value={voucher || ''}
            readOnly
            required
          />
        </label>
        
      </Form>
      <Form>
        <label>Produtos
          <input type="text" name="produtos" required />
        </label>
        <label>Acréscimo
          <input type="number" name="acrescimo" required />
        </label>
        <label>Desconto
          <input type="number" name="desconto" required />
        </label>

        <label>Forma de pagamento
          <select>
            <option value=""></option>
            <option value="Debito">Débito</option>
            <option value="Credito">Crédito</option>
            <option value="Pix">Pix</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Carteira">Carteira</option>
          </select>
        </label>
        <label>Parcela
          <select>
            <option value=""></option>
            <option value="1">1x</option>
            <option value="2">2x</option>
            <option value="3">3x</option>
            <option value="4">4x</option>
            <option value="5">5x</option>
            <option value="6">6x</option>
            <option value="7">7x</option>
            <option value="8">8x</option>
            <option value="9">9x</option>
            <option value="10">10x</option>
          </select>
        </label>
        <label>
          Valor Total
          <input type="number" name="valorTotal" disabled style={{ cursor: "not-allowed" }} />
        </label>
        <label>
          Venda final
          <Textarea name="produtos-lista" disabled style={{ cursor: "not-allowed" }} />
        </label>
        <label>
          <Button type="submit">Registrar Venda</Button>
          <Button type="button" onClick={() => navigate("/")}>Devolver</Button>
          <Button type="button" onClick={() => navigate("/")}>Reservar</Button>
          <Button type="button" onClick={() => navigate("/")}>Quitar Recebimento</Button>
        </label>
      </Form>
    </Container>
  );
};

export default Venda;
