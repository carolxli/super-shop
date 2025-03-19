import React, { } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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
  width: 800px;
`;

const Compra = () => {
    const navigate = useNavigate();

    return (
        <Container>
            <h2>Registro de Compras</h2>
            <Form>
                <label>
                    Fornecedor
                    <input
                        type="text"
                    />
                </label>

                <label>Produtos
                    <input type="text" name="produtos" required />
                </label>
                <label>Lista de Compras
                    <Textarea type="textarea" name="listaProdutos" disabled required />
                </label><br></br>
                <label>Data da compra
                    <input type="date" name="dataCompra" required />
                </label>
                <label>Total da compra
                    <input type="number" name="acrescimo" min={0} required />
                </label>
                <label>Desconto
                    <input type="number" name="desconto" min={0} required />
                </label>

                <label>Forma de pagamento
                    <select>
                        <option value=""></option>
                        <option value="Debito">Débito</option>
                        <option value="Credito">Crédito</option>
                        <option value="Pix">Pix</option>
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Boleto">Boleto</option>
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
                <label>Dia do vencimento
                    <input type="number" name="acrescimo" min={1} max={31} required />
                </label>

                <Button type="submit">Registrar Compra</Button>
                <Button type="button" onClick={() => navigate("/")}>Quitar Pagamentos</Button>

            </Form>
        </Container>
    );
};

export default Compra;
