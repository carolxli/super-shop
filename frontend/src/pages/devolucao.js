import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";


const Label = styled.form`
 all: unset;
  width: calc(49.98% - 20px);
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #333;
  margin-bottom: 5px;
   `
const Input = styled.input`
  all: unset;
  width: 50%;
  padding: 15px;
  border: 0.5px solid #000;
`;


const Devolucao = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [nomeCliente, setNomeCliente] = useState("");
  const [autocompleteVisible, setAutocompleteVisible] = useState(false);

  const [usuarios, setUsuarios] = useState([]);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [autocompleteUsuarioVisible, setAutocompleteUsuarioVisible] = useState(false);

  const [vendas, setVendas] = useState([]);
  const [vendaSelecionada, setVendaSelecionada] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [motivo, setMotivo] = useState("");
  const [historicoDevolucoes, setHistoricoDevolucoes] = useState([]);
  const [devolucoesExcluidas, setDevolucoesExcluidas] = useState([]);

  const handleNomeClienteChange = async (e) => {
    const nome = e.target.value;
    setNomeCliente(nome);
    if (nome.length >= 2) {
      try {
        const responsePessoa = await axios.get(`http://localhost:8800/Pessoa?nome=${nome}`);
        const responseCliente = await axios.get("http://localhost:8800/Cliente");
        const pessoas = responsePessoa.data;
        const clientes = responseCliente.data;
        const pessoasClientes = pessoas
          .filter(p => clientes.some(c => c.Pessoa_idPessoa === p.idPessoa))
          .map(p => {
            const cliente = clientes.find(c => c.Pessoa_idPessoa === p.idPessoa);
            return { ...p, idCliente: cliente.idCliente };
          });
        setClientes(pessoasClientes);
        setAutocompleteVisible(true);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    } else {
      setAutocompleteVisible(false);
    }
  };

  const handleNomeUsuarioChange = async (e) => {
    const nome = e.target.value;
    setNomeUsuario(nome);
    if (nome.length >= 2) {
      try {
        const responsePessoa = await axios.get(`http://localhost:8800/Pessoa?nome=${nome}`);
        const responseUsuario = await axios.get("http://localhost:8800/Usuario");
        const pessoas = responsePessoa.data;
        const usuarios = responseUsuario.data;
        const pessoasUsuarios = pessoas
          .filter(p => usuarios.some(u => u.Pessoa_idPessoa === p.idPessoa))
          .map(p => {
            const usuario = usuarios.find(u => u.Pessoa_idPessoa === p.idPessoa);
            return { ...p, idUsuario: usuario.idUsuario };
          });
        setUsuarios(pessoasUsuarios);
        setAutocompleteUsuarioVisible(true);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    } else {
      setAutocompleteUsuarioVisible(false);
    }
  };

  const selecionarCliente = async (cliente) => {
    setNomeCliente(cliente.nome);
    setAutocompleteVisible(false);
    setClienteSelecionado(cliente);
    setVendas([]);
    setVendaSelecionada(null);
    setProdutos([]);
    setSelecionados([]);
    setMotivo("");
    setHistoricoDevolucoes([]);
    setNomeUsuario("");
    setUsuarioSelecionado(null);
    try {
      const res = await axios.get(`http://localhost:8800/Venda/cliente/${cliente.idCliente}`);
      const vendasComTotais = await Promise.all(res.data.map(async (venda) => {
        const itensRes = await axios.get(`http://localhost:8800/Venda/itens/${venda.idVenda}`);
        const valorTotalCalculado = itensRes.data.reduce((acc, item) =>
          acc + (parseFloat(item.valor_unitario) * item.quantidade), 0);
        return { ...venda, valorTotalCalculado };
      }));
      setVendas(vendasComTotais);
    } catch (error) {
      console.error("Erro ao buscar vendas do cliente:", error);
    }
  };

  const selecionarVenda = async (venda, ignorarAlerta = false) => {
    const dias = (new Date() - new Date(venda.data)) / (1000 * 60 * 60 * 24);

    if (dias > 30 && !ignorarAlerta) {
      const continuar = window.confirm("Venda com mais de 30 dias. Deseja continuar?");
      if (!continuar) return;
    }

    setVendaSelecionada(venda);

    try {
      const res = await axios.get(`http://localhost:8800/Venda/itens/${venda.idVenda}`);
      const hist = await axios.get(`http://localhost:8800/Devolucao/${clienteSelecionado.idCliente}`);
      const devolucoesDaVenda = hist.data.filter(d => d.Itens_Vendas_Venda_idVenda === venda.idVenda);
      setProdutos(
        res.data
          .map(prod => {
            const devolvido = devolucoesDaVenda
              .filter(d => d.Itens_Vendas_Produto_idProduto === prod.Produto_idProduto)
              .reduce((acc, d) => acc + d.quantidade, 0);
            return { ...prod, devolvido };
          })
          .sort((a, b) => a.descricao.localeCompare(b.descricao))
      );
      setHistoricoDevolucoes(devolucoesDaVenda);
      setNomeUsuario("");
      setUsuarioSelecionado(null);
    } catch (error) {
      console.error("Erro ao buscar dados da venda:", error);
    }
  };



  const toggleProduto = (produto) => {
    const selecionado = selecionados.find(p => p.produtoId === produto.Produto_idProduto);
    if (selecionado) {
      setSelecionados(selecionados.filter(p => p.produtoId !== produto.Produto_idProduto));
    } else {
      setSelecionados([
        ...selecionados,
        {
          produtoId: produto.Produto_idProduto,
          quantidade: 1,
          valorUnitario: parseFloat(produto.valor_vendido)
        }
      ]);
    }
  };

  const alterarQuantidade = (produtoId, quantidade) => {
    setSelecionados(selecionados.map(p =>
      p.produtoId === produtoId ? { ...p, quantidade } : p
    ));
  };

  const confirmarDevolucao = async () => {
    if (!motivo.trim()) return alert("Motivo é obrigatório.");
    if (!usuarioSelecionado) return alert("Selecione um vendedor responsável.");
    if (selecionados.length === 0) return alert("Nenhum produto selecionado.");
    try {
      await axios.post("http://localhost:8800/Devolucao", {
        clienteId: clienteSelecionado.idCliente,
        pessoaId: clienteSelecionado.idPessoa,
        vendaId: vendaSelecionada.idVenda,
        motivo,
        usuarioNome: usuarioSelecionado.nome,
        produtos: selecionados
      });
      alert("Devolução registrada com sucesso.");
      setSelecionados([]);
      setMotivo("");
      setNomeUsuario("");
      setUsuarioSelecionado(null);
      selecionarVenda(vendaSelecionada, true); // reexecuta sem alertar
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao registrar devolução.");
    }
  };

  const excluirDevolucao = async (idDevolucao) => {
    const confirmar = window.confirm("Deseja realmente excluir esta devolução?");
    if (!confirmar) return;
    try {
      await axios.delete(`http://localhost:8800/Devolucao/${idDevolucao}`);
      setDevolucoesExcluidas([...devolucoesExcluidas, idDevolucao]);
      alert("Devolução excluída com sucesso.");
      selecionarVenda(vendaSelecionada, true);
    } catch (err) {
      alert("Erro ao excluir devolução.");
    }
  };

  const totalVoucher = selecionados.reduce((sum, item) => sum + (item.valorUnitario * item.quantidade), 0);
  const produtosDevolvidosAgrupados = produtos.map(prod => {
    const devolucoes = historicoDevolucoes.filter(dev => dev.Itens_Vendas_Produto_idProduto === prod.Produto_idProduto);
    return { ...prod, devolucoes };
  }).filter(p => p.devolucoes.length > 0);


  return (

    <>
      <h2>Devolução de Produtos</h2>

      <Label >Cliente:
        <Input
          type="text"
          value={nomeCliente}
          onChange={handleNomeClienteChange}
          placeholder="Digite o nome do cliente"
        />
        {autocompleteVisible && (
          <ul className="autocomplete-list">
            {clientes.length > 0 ? (
              clientes.map(cliente => (
                <li key={cliente.idPessoa} onClick={() => selecionarCliente(cliente)}>{cliente.nome}</li>
              ))
            ) : (
              <li>Cliente não encontrado</li>
            )}
          </ul>
        )}
      </Label>

      {clienteSelecionado && vendas.length > 0 && (
        <div>
          <div style={{ justifyContent: 'flex-start', gap: '35px', marginLeft: '-210px' }}>
            <h3>Compras do Cliente</h3>
          </div>

          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Valor Total</th>
                <th>Valor Pago</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map(v => (
                <tr key={v.idVenda}>
                  <td>{new Date(v.data).toLocaleDateString()}</td>
                  <td>R$ {parseFloat(v.valorTotalCalculado).toFixed(2)}</td>
                  <td>R$ {parseFloat(v.total).toFixed(2)}</td>
                  <td><button onClick={() => selecionarVenda(v)}>Selecionar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {vendaSelecionada && produtos.length > 0 && (
        <div>
          <div style={{ justifyContent: 'flex-start', gap: '35px', marginLeft: '-210px' }}>
            <h3>Produtos Comprados</h3>
          </div>

          <table>
            <thead>
              <tr>
                <th>Selecionar</th>
                <th>Produto</th>
                <th>Vendida</th>
                <th>Devolvida</th>
                <th>Valor Unitário</th>
                <th>Subtotal</th>
                <th>Qtd a Devolver</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map(p => {
                const devolvido = parseInt(p.devolvido) || 0;
                const saldo = p.quantidade - devolvido;
                const cor = saldo === 0 ? "#ffcccc" : saldo < p.quantidade ? "#fffacc" : "white";
                const isDisabled = saldo === 0;
                return (
                  <tr key={p.Produto_idProduto}>
                    <td><input type="checkbox" onChange={() => toggleProduto(p)} checked={selecionados.some(sel => sel.produtoId === p.Produto_idProduto)} disabled={isDisabled} /></td>
                    <td>{p.descricao}</td>
                    <td>{p.quantidade}</td>
                    <td>{devolvido}</td>
                    <td>R$ {parseFloat(p.valor_vendido).toFixed(2)}</td>
                    <td>R$ {(p.quantidade * parseFloat(p.valor_vendido)).toFixed(2)}</td>
                    <td><input type="number" min="1" max={saldo} value={selecionados.find(sel => sel.produtoId === p.Produto_idProduto)?.quantidade || 1} disabled={!selecionados.some(sel => sel.produtoId === p.Produto_idProduto) || isDisabled} onChange={(e) => alterarQuantidade(p.Produto_idProduto, Number(e.target.value))} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ display: 'inline-block', justifyContent: 'flex-start', gap: '35px', marginLeft: '999px' }}>
            <p>
              Total da devolução (voucher): R$ {totalVoucher.toFixed(2)}
            </p>
          </div>


          <Label>Vendedor:
            <Input value={nomeUsuario} onChange={handleNomeUsuarioChange} placeholder="Digite o nome do vendedor" />
            {autocompleteUsuarioVisible && (
              <ul className="autocomplete-list">
                {usuarios.length > 0 ? (
                  usuarios.map(usuario => (
                    <li key={usuario.idPessoa} onClick={() => {
                      setNomeUsuario(usuario.nome);
                      setUsuarioSelecionado(usuario);
                      setAutocompleteUsuarioVisible(false);
                    }}>{usuario.nome}</li>
                  ))
                ) : (
                  <li>Vendedor não encontrado</li>
                )}
              </ul>
            )}
          </Label>
          <Label>Motivo:
            <Input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Informe o motivo da devolução" />
          </Label>
          <div style={{ display: 'inline-block', justifyContent: 'flex-start', gap: '35px', marginLeft: '562px' }}>
            <button onClick={confirmarDevolucao}>Confirmar Devolução</button>
          </div>
        </div>
      )}

      {produtosDevolvidosAgrupados.length > 0 && (
        <div >
          <h3>Histórico de Devoluções</h3>
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Data</th>
                <th>Motivo</th>
                <th>Vendedor</th>
                <th>Voucher</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {produtosDevolvidosAgrupados.map((p, idx) =>
                p.devolucoes.map((d, i) => (
                  <tr key={`${idx}-${i}`}>
                    <td>{p.descricao}</td>
                    <td>{d.quantidade}</td>
                    <td>{new Date(d.dt_devolucao).toLocaleDateString()}</td>
                    <td>{d.motivo}</td>
                    <td>{d.vendedor_nome ?? d.usuarioNome ?? "Não informado"}</td>
                    <td>R$ {parseFloat(d.valor_voucher).toFixed(2)}</td>
                    <td>
                      {!devolucoesExcluidas.includes(d.idDevolucao) && (
                        <button onClick={() => excluirDevolucao(d.idDevolucao)}>Excluir</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Devolucao;