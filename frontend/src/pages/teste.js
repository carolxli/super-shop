import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FormRow = styled.form`
  width: 80%;
  padding: 5px;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
`;

const Button = styled.button`
  background-color: #87CEEB;
  color: #fff;
  border: none;
  padding: 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  width: 150px;
  margin: 5px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: rgb(3, 156, 194);
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
`;

const Venda = () => {
  const [nomeCliente, setNomeCliente] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [produto, setProduto] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [itens, setItens] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [autocompleteClienteVisible, setAutocompleteClienteVisible] = useState(false);
  const [autocompleteUsuarioVisible, setAutocompleteUsuarioVisible] = useState(false);
  const [autocompleteProdutoVisible, setAutocompleteProdutoVisible] = useState(false);
  const [valorVoucher, setValorVoucher] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const clientesResponse = await axios.get("http://localhost:8800/Cliente");
        setClientes(clientesResponse.data);

        const usuariosResponse = await axios.get("http://localhost:8800/Usuario");
        setUsuarios(usuariosResponse.data);

        const produtosResponse = await axios.get("http://localhost:8800/Produto");
        setProdutos(produtosResponse.data.rows || []);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Erro ao carregar dados.");
        setLoading(false);
      }
    };
    fetchDados();
  }, []);

  const adicionarProduto = () => {
    if (!produtoSelecionado) {
      alert("Selecione um produto da lista.");
      return;
    }

    const estoqueDisponivel = produtoSelecionado.estoque_atual || 0;

    if (quantidade > estoqueDisponivel) {
      alert(`Não é possível adicionar ${quantidade} unidades. O estoque atual do produto "${produtoSelecionado.descricao}" é de ${estoqueDisponivel} unidade(s).`);
      return;
    }

    const item = {
      id: Date.now(),
      produto: produtoSelecionado.descricao,
      quantidade,
      valorUnitario: produtoSelecionado.valor_venda,
      valorTotal: quantidade * produtoSelecionado.valor_venda
    };

    setItens([...itens, item]);
    setProduto("");
    setProdutoSelecionado(null);
    setQuantidade(1);
  };

  const removerProduto = (id) => {
    setItens(itens.filter(item => item.id !== id));
  };

  const totalItens = itens.reduce((sum, item) => sum + item.quantidade, 0);
  const subtotal = itens.reduce((sum, item) => sum + item.valorTotal, 0);
  const total = subtotal;

  const handleNomeClienteChange = async (e) => {
    const nome = e.target.value;
    setNomeCliente(nome);
    if (nome.length >= 2) {
      try {
        const response = await axios.get(`http://localhost:8800/Cliente`, {
          params: { nome }
        });
        setClientes(response.data);
        setAutocompleteClienteVisible(true);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    } else {
      setAutocompleteClienteVisible(false);
    }
  };

  const handleNomeUsuarioChange = async (e) => {
    const nome = e.target.value;
    setNomeUsuario(nome);
    if (nome.length >= 2) {
      try {
        const response = await axios.get(`http://localhost:8800/Usuario`, {
          params: { nome }
        });
        setUsuarios(response.data);
        setAutocompleteUsuarioVisible(true);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    } else {
      setAutocompleteUsuarioVisible(false);
    }
  };

  const registrarVenda = () => {
    if (!nomeCliente || !nomeUsuario || itens.length === 0) {
      alert("Preencha todos os campos obrigatórios e adicione ao menos um produto.");
      return;
    }

    const dadosVenda = {
      cliente: nomeCliente,
      usuario: nomeUsuario,
      itens: itens,
      total: total,
      totalItens: totalItens
    };

    localStorage.setItem("venda_em_aberto", JSON.stringify(dadosVenda));

    navigate("/venda-financeiro");
  };

  return (
    <>
      <h2>Nova Venda</h2>
      <FormRow>
        <label>Cliente:
          <Input type="text" value={nomeCliente} onChange={handleNomeClienteChange} required />
          {autocompleteClienteVisible && (
            <ul className="autocomplete-list">
              {clientes.length > 0 ? (
                clientes.map(cliente => (
                  <li key={cliente.idPessoa} onClick={() => {
                    setNomeCliente(cliente.pessoa_nome);
                    setValorVoucher(cliente.voucher || 0);
                    setAutocompleteClienteVisible(false);

                    const dadosVoucher = {
                      clienteId: cliente.idPessoa,
                      nome: cliente.pessoa_nome,
                      valorVoucher: cliente.voucher || 0
                    };
                    localStorage.setItem("voucher_cliente", JSON.stringify(dadosVoucher));
                  }}>{cliente.pessoa_nome}</li>
                ))
              ) : (
                <li>Cliente não encontrado</li>
              )}
            </ul>
          )}
        </label>

        {valorVoucher > 0 && (
          <p style={{ marginTop: "5px", color: "green", fontWeight: "bold" }}>
            Cliente possui voucher de R$ {valorVoucher.toFixed(2)}
          </p>
        )}

        <label>Usuário:
          <Input type="text" value={nomeUsuario} onChange={handleNomeUsuarioChange} required />
          {autocompleteUsuarioVisible && (
            <ul className="autocomplete-list">
              {usuarios.length > 0 ? (
                usuarios.map(usuario => (
                  <li key={usuario.idPessoa} onClick={() => {
                    setNomeUsuario(usuario.pessoa_nome);
                    setAutocompleteUsuarioVisible(false);
                  }}>{usuario.pessoa_nome}</li>
                ))
              ) : (
                <li>Usuário não encontrado</li>
              )}
            </ul>
          )}
        </label>

        <label>Produto:
          <Input
            type="text"
            value={produto}
            onChange={(e) => {
              const valor = e.target.value;
              setProduto(valor);
              const encontrados = produtos.filter(p =>
                p.descricao.toLowerCase().includes(valor.toLowerCase())
              );
              if (encontrados.length > 0) {
                setProdutoSelecionado(encontrados[0]);
              } else {
                setProdutoSelecionado(null);
              }
              setAutocompleteProdutoVisible(valor.length >= 1);
            }}
            required
          />
          {autocompleteProdutoVisible && (
            <ul className="autocomplete-list">
              {produtos
                .filter(p => p.descricao.toLowerCase().includes(produto.toLowerCase()))
                .map(p => (
                  <li key={p.idProduto} onClick={() => {
                    setProduto(p.descricao);
                    setProdutoSelecionado(p);
                    setAutocompleteProdutoVisible(false);
                  }}>{p.descricao}</li>
                ))}
            </ul>
          )}
        </label>

        <label>Quantidade:
          <Input
            type="number"
            min="1"
            value={quantidade}
            onChange={(e) => setQuantidade(parseInt(e.target.value))}
            required
          />
        </label>

        <Button type="button" onClick={adicionarProduto}>Adicionar Produto</Button>
      </FormRow>

      {itens.length > 0 && (
        <>
          <h3>Itens da Venda</h3>
          <Table>
            <thead>
              <tr>
                <Th>Produto</Th>
                <Th>Quantidade</Th>
                <Th>Valor Unitário</Th>
                <Th>Valor Total</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {itens.map(item => (
                <tr key={item.id}>
                  <Td>{item.produto}</Td>
                  <Td>{item.quantidade}</Td>
                  <Td>R$ {item.valorUnitario.toFixed(2)}</Td>
                  <Td>R$ {item.valorTotal.toFixed(2)}</Td>
                  <Td>
                    <Button type="button" onClick={() => removerProduto(item.id)}>Remover</Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h4>Subtotal: R$ {subtotal.toFixed(2)}</h4>
          <h4>Total de Itens: {totalItens}</h4>
        </>
      )}

      <Button type="button" onClick={registrarVenda}>Finalizar Venda</Button>
    </>
  );
};

export default Venda;
