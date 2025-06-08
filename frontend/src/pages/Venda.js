import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

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
    const vendaTemp = localStorage.getItem("venda_em_aberto");
    if (vendaTemp) {
      const dados = JSON.parse(vendaTemp);
      setNomeCliente(dados.cliente || "");
      setNomeUsuario(dados.usuario || "");
      setItens(dados.itens || []);

      // Recarrega os dados do usuário (para garantir que o idUsuario exista)
      const fetchUsuario = async () => {
        try {
          const res = await axios.get(`http://localhost:8800/Venda/usuario/${dados.usuario}`);
          const usuarioEncontrado = res.data.find(u => u.nome === dados.usuario);
          if (usuarioEncontrado) {
            setUsuarios([usuarioEncontrado]); // Recarrega a lista com o usuário atual
          }
        } catch (err) {
          console.error("Erro ao recarregar usuário:", err);
        }
      };

      fetchUsuario();
    }
  }, []);


  useEffect(() => {
    const fetchDados = async () => {
      try {
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

    const itemExistente = itens.find(item => item.idProduto === produtoSelecionado.idProduto);

    const quantidadeExistente = itemExistente?.quantidade || 0;
    const novaQuantidade = quantidadeExistente + quantidade;

    if (novaQuantidade > estoqueDisponivel) {
      alert(`Não é possível adicionar ${quantidade} unidade(s). Já há ${quantidadeExistente} unidade(s) deste produto no carrinho. O estoque atual do produto "${produtoSelecionado.descricao}" é de ${estoqueDisponivel} unidade(s).`);
      return;
    }

    if (itemExistente) {
      const itensAtualizados = itens.map(item =>
        item.idProduto === produtoSelecionado.idProduto
          ? {
            ...item,
            quantidade: item.quantidade + quantidade,
            valorTotal: (item.quantidade + quantidade) * item.valorUnitario
          }
          : item
      );
      setItens(itensAtualizados);
    } else {
      const item = {
        id: Date.now(),
        idProduto: produtoSelecionado.idProduto,
        produto: produtoSelecionado.descricao,
        quantidade,
        valorUnitario: produtoSelecionado.valor_venda,
        valorTotal: quantidade * produtoSelecionado.valor_venda
      };
      setItens([...itens, item]);
    };

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
        const response = await axios.get(`http://localhost:8800/venda?nome=${nome}`);
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
        const response = await axios.get(`http://localhost:8800/Venda/usuario/${nome}`);
        console.log("Usuários filtrados:", response.data);
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

    const usuario = usuarios.find(u => u.nome === nomeUsuario);

    if (!usuario) {
      alert("Usuário inválido ou não selecionado corretamente.");
      return;
    }

    const dadosVenda = {
      Usuario_Pessoa_idPessoa: usuario.Pessoa_idPessoa,
      Usuario_idUsuario: usuario.idUsuario,
      cliente: nomeCliente,
      itens: itens,
      total: total,
      totalItens: totalItens,
      usuario: usuario.nome
    };

    localStorage.setItem("venda_em_aberto", JSON.stringify(dadosVenda));
    console.log("Dados salvos no localStorage:", JSON.parse(localStorage.getItem("venda_em_aberto")));

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
                    setNomeCliente(cliente.nome);
                    setAutocompleteClienteVisible(false);

                    const valor = cliente.voucher || 0;
                    setValorVoucher(valor);

                    const dadosVoucher = {
                      clienteId: cliente.idPessoa,
                      nome: cliente.nome,
                      valorVoucher: valor
                    };
                    localStorage.setItem("voucher_cliente", JSON.stringify(dadosVoucher));
                  }}>{cliente.nome}</li>
                ))
              ) : (
                <li>Cliente não encontrado</li>
              )}
            </ul>
          )}
        </label>

        {valorVoucher > 0 && (
          <p style={{ marginTop: "5px", color: "green", fontWeight: "bold" }}>
            Voucher disponível: R$ {valorVoucher.toFixed(2)}
          </p>
        )}

        <label>Usuário (Vendedor):
          <Input type="text" value={nomeUsuario} onChange={handleNomeUsuarioChange} required />
          {autocompleteUsuarioVisible && (
            <ul className="autocomplete-list">
              {usuarios.length > 0 ? (
                usuarios.map(usuario => (
                  <li key={usuario.idPessoa} onClick={() => {
                    setNomeUsuario(usuario.nome);
                    setAutocompleteUsuarioVisible(false);

                    const dadosVenda = {
                      Usuario_Pessoa_idPessoa: usuario.Pessoa_idPessoa,
                      Usuario_idUsuario: usuario.idUsuario,
                      cliente: nomeCliente,
                      itens: itens,
                      total: total,
                      totalItens: totalItens,
                      usuario: usuario.nome
                    };


                    console.log("Dados do usuário ao salvar:", usuario);
                    console.log("Dados da venda ao salvar:", dadosVenda);

                    localStorage.setItem("venda_em_aberto", JSON.stringify(dadosVenda));
                    console.log("Dados salvos no localStorage:", JSON.parse(localStorage.getItem("venda_em_aberto")));
                  }}>
                    {usuario.nome}
                  </li>
                ))
              ) : (
                <li>Vendedor não encontrado</li>
              )}
            </ul>
          )}
        </label>

        <label>Produto:
          <Input
            type="text"
            value={produto}
            onChange={(e) => {
              setProduto(e.target.value);
              setAutocompleteProdutoVisible(true);
              setProdutoSelecionado(null);
            }}
          />
          {autocompleteProdutoVisible && (
            <ul className="autocomplete-list">
              {produtos
                .filter(p =>
                (p.descricao?.toLowerCase().includes(produto.toLowerCase()) ||
                  p.sku?.toLowerCase().includes(produto.toLowerCase()))
                )
                .map(p => (
                  <li
                    key={p.idProduto}
                    onClick={() => {
                      setProduto(`${p.descricao} (${p.sku})`);
                      setProdutoSelecionado(p);
                      setAutocompleteProdutoVisible(false);
                      setQuantidade(1);
                    }}
                  >
                    {p.descricao} ({p.sku})
                  </li>
                ))}
            </ul>
          )}
        </label>

        <label>Quantidade:
          <Input
            type="number"
            min="1"
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
          />
        </label>

        <Button type="button" onClick={adicionarProduto}>Adicionar</Button>

        <Table>
          <thead>
            <tr>
              <Th>Produto</Th>
              <Th>Quantidade</Th>
              <Th>Valor unitário</Th>
              <Th>Valor Total</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {itens.length > 0 ? (
              itens.map((item) => (
                <tr key={item.id}>
                  <Td>{item.produto}</Td>
                  <Td>{item.quantidade}</Td>
                  <Td>R$ {item.valorUnitario.toFixed(2)}</Td>
                  <Td>R$ {item.valorTotal.toFixed(2)}</Td>
                  <Td><Button onClick={() => removerProduto(item.id)}>Remover</Button></Td>
                </tr>
              ))
            ) : (
              <tr>
                <Td colSpan="5">Nenhum produto adicionado</Td>
              </tr>
            )}
          </tbody>
        </Table>

        <p>Quantidade Total de Itens: {totalItens}</p>
        <p>Subtotal: R$ {subtotal.toFixed(2)}</p>


        <Button onClick={registrarVenda}>Registrar Venda</Button>
        <Button
          onClick={() => {
            // Limpa localStorage e estados locais
            localStorage.removeItem("venda_em_aberto");
            localStorage.removeItem("voucher_cliente");

            // Opcional: Zerar estados locais
            setNomeCliente("");
            setNomeUsuario("");
            setProduto("");
            setProdutoSelecionado(null);
            setQuantidade(1);
            setItens([]);
            setValorVoucher(0);
            setUsuarios([]);
            setClientes([]);

            navigate("/"); // Redireciona
          }}
        >
          Cancelar
        </Button>

      </FormRow>
    </>
  );
};

export default Venda;