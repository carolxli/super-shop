// RelatorioDevolucoes.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const RelatorioDevolucoes = () => {
  const [filtro, setFiltro] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [nomeCliente, setNomeCliente] = useState("");
  const [nomeProduto, setNomeProduto] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [devolucoes, setDevolucoes] = useState([]);
  const [detalhe, setDetalhe] = useState(null);
  const [autocompleteClientes, setAutocompleteClientes] = useState([]);
  const [autocompleteProdutos, setAutocompleteProdutos] = useState([]);

  useEffect(() => {
    buscarClientes();
    buscarProdutos();
  }, []);

  const buscarClientes = async () => {
    try {
      const pessoas = await axios.get("http://localhost:8800/Pessoa");
      const clientes = await axios.get("http://localhost:8800/Cliente");
      const filtrados = pessoas.data
        .filter(p => clientes.data.some(c => c.Pessoa_idPessoa === p.idPessoa))
        .map(p => {
          const c = clientes.data.find(c => c.Pessoa_idPessoa === p.idPessoa);
          return { ...p, idCliente: c.idCliente };
        });
      setClientes(filtrados);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
      setClientes([]);
    }
  };

  const buscarProdutos = async () => {
    try {
      const res = await axios.get("http://localhost:8800/Produto");
      const lista = res.data?.rows || res.data;
      if (Array.isArray(lista)) {
        setProdutos(lista);
      } else {
        setProdutos([]);
      }
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setProdutos([]);
    }
  };

  const buscarPorCliente = async (idCliente) => {
    try {
        const res = await axios.get(`http://localhost:8800/Devolucao/cliente/${idCliente}`);
      setDevolucoes(res.data);
    } catch (err) {
      alert("Erro ao buscar devoluções por cliente.");
    }
  };

  const buscarPorProduto = async (idProduto) => {
    try {
      const res = await axios.get(`http://localhost:8800/Devolucao/por-produto/${idProduto}`);
      setDevolucoes(res.data);
    } catch (err) {
      alert("Erro ao buscar devoluções por produto.");
    }
  };

  const buscarPorPeriodo = async () => {
    if (!inicio || !fim) return alert("Informe o período completo.");
  
    // Tenta converter as datas para o formato YYYY-MM-DD
    const inicioFormatado = new Date(inicio).toISOString().split("T")[0];
    const fimFormatado = new Date(fim).toISOString().split("T")[0];
  
    if (isNaN(new Date(inicioFormatado)) || isNaN(new Date(fimFormatado))) {
      return alert("Datas inválidas. Verifique os valores informados.");
    }
  
    try {
      const res = await axios.get(`http://localhost:8800/Devolucao/por-periodo?inicio=${inicioFormatado}&fim=${fimFormatado}`);
      setDevolucoes(res.data);
    } catch (err) {
        console.error("❌ Erro completo:", err); // já mostra o erro completo no console
      
        // Tenta mostrar a mensagem detalhada que o backend retornou (se tiver)
        if (err.response && err.response.data && err.response.data.error) {
          alert(`Erro do servidor: ${err.response.data.error}`);
        } else {
          alert("Erro ao buscar devoluções por período.");
        }
      }      
  };
  
  const buscarDetalhe = async (id) => {
    try {
        const res = await axios.get(`http://localhost:8800/Devolucao/detalhe/${id}`);
      setDetalhe(res.data);
    } catch (err) {
      alert("Erro ao buscar detalhes.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Relatório de Devoluções</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => setFiltro("cliente")}>Cliente</button>
        <button onClick={() => setFiltro("produto")}>Produto</button>
        <button onClick={() => setFiltro("periodo")}>Período</button>
      </div>

      {filtro === "cliente" && (
        <div>
          <input
            placeholder="Digite o nome do cliente"
            value={nomeCliente}
            onChange={(e) => {
              setNomeCliente(e.target.value);
              setAutocompleteClientes(clientes.filter(c => c.nome.toLowerCase().includes(e.target.value.toLowerCase())));
            }}
          />
          {autocompleteClientes.length > 0 && (
            <ul className="autocomplete-list">
              {autocompleteClientes.map(c => (
                <li key={c.idCliente} onClick={() => {
                  setNomeCliente(c.nome);
                  setAutocompleteClientes([]);
                  buscarPorCliente(c.idCliente);
                }}>{c.nome}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {filtro === "produto" && (
        <div>
          <input
            placeholder="Digite o nome do produto"
            value={nomeProduto}
            onChange={(e) => {
              setNomeProduto(e.target.value);
              setAutocompleteProdutos(produtos.filter(p => p.descricao.toLowerCase().includes(e.target.value.toLowerCase())));
            }}
          />
          {autocompleteProdutos.length > 0 && (
            <ul className="autocomplete-list">
              {autocompleteProdutos.map(p => (
                <li key={p.idProduto} onClick={() => {
                  setNomeProduto(p.descricao);
                  setAutocompleteProdutos([]);
                  buscarPorProduto(p.idProduto);
                }}>{p.descricao}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {filtro === "periodo" && (
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <input
            type="date"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            placeholder="Data inicial"
            />
            <input
            type="date"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
            placeholder="Data final"
            />
          <button onClick={buscarPorPeriodo}>Buscar</button>
        </div>
      )}

      {devolucoes.length > 0 && (
        <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Cliente</th>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Voucher</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {devolucoes.map(dev => (
              <tr key={dev.idDevolucao}>
                <td>{dev.idDevolucao}</td>
                <td>{new Date(dev.dt_devolucao).toLocaleDateString()}</td>
                <td>{dev.cliente_nome || dev.Cliente_idCliente}</td>
                <td>{dev.produto_nome || dev.Itens_Vendas_Produto_idProduto}</td>
                <td>{dev.quantidade}</td>
                <td>R$ {parseFloat(dev.valor_voucher).toFixed(2)}</td>
                <td><button onClick={() => buscarDetalhe(dev.idDevolucao)}>Detalhes</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {detalhe && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', padding: 20, borderRadius: 10, width: '400px' }}>
            <h3>Detalhes da Devolução</h3>
            <p><strong>Data:</strong> {new Date(detalhe.dt_devolucao).toLocaleDateString()}</p>
            <p><strong>Cliente:</strong> {detalhe.cliente_nome || detalhe.Cliente_idCliente}</p>
            <p><strong>Produto:</strong> {detalhe.produto_nome || detalhe.Itens_Vendas_Produto_idProduto}</p>
            <p><strong>Venda:</strong> {detalhe.Itens_Vendas_Venda_idVenda}</p>
            <p><strong>Quantidade:</strong> {detalhe.quantidade}</p>
            <p><strong>Voucher:</strong> R$ {parseFloat(detalhe.valor_voucher).toFixed(2)}</p>
            <p><strong>Motivo:</strong> {detalhe.motivo}</p>
            <p><strong>Vendedor:</strong> {detalhe.vendedor_nome || '-'}</p>
            <div style={{ textAlign: 'right' }}>
              <button onClick={() => setDetalhe(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatorioDevolucoes;