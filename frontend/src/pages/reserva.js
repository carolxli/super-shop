// Reserva.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const Reserva = () => {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [nomeCliente, setNomeCliente] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [autocompleteClientes, setAutocompleteClientes] = useState([]);

  const [nomeProduto, setNomeProduto] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [autocompleteProdutos, setAutocompleteProdutos] = useState([]);

  const [nomeUsuario, setNomeUsuario] = useState("");
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [autocompleteUsuarios, setAutocompleteUsuarios] = useState([]);

  const [quantidade, setQuantidade] = useState(1);
  const [dataExpiracao, setDataExpiracao] = useState("");
  const [motivo, setMotivo] = useState("reserva para buscar");
  const [mensagem, setMensagem] = useState("");
  const [filtroClienteReservas, setFiltroClienteReservas] = useState("");

  useEffect(() => {
    fetchProdutos();
    fetchReservas();
    fetchClientes();
    fetchUsuarios();
  }, []);

  const fetchProdutos = async () => {
    try {
      const res = await axios.get("http://localhost:8800/Produto");
      const lista = res.data?.rows || res.data;
      setProdutos(Array.isArray(lista) ? lista : []);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setProdutos([]);
    }
  };

  const fetchReservas = async () => {
    const res = await axios.get("http://localhost:8800/Reserva");
    setReservas(res.data);
  };

  const fetchClientes = async () => {
    try {
      const resPessoas = await axios.get("http://localhost:8800/Pessoa");
      const resClientes = await axios.get("http://localhost:8800/Cliente");

      const pessoas = resPessoas.data;
      const clientes = resClientes.data;

      const lista = pessoas.filter(p =>
        clientes.some(c => c.Pessoa_idPessoa === p.idPessoa)
      ).map(p => {
        const cliente = clientes.find(c => c.Pessoa_idPessoa === p.idPessoa);
        return { ...p, idCliente: cliente.idCliente };
      });

      setClientes(lista);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const resPessoas = await axios.get("http://localhost:8800/Pessoa");
      const resUsuarios = await axios.get("http://localhost:8800/Usuario");

      const pessoas = resPessoas.data;
      const usuarios = resUsuarios.data;

      const lista = pessoas.filter(p =>
        usuarios.some(u => u.Pessoa_idPessoa === p.idPessoa)
      ).map(p => {
        const usuario = usuarios.find(u => u.Pessoa_idPessoa === p.idPessoa);
        return { ...p, idUsuario: usuario.idUsuario };
      });

      setUsuarios(lista);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    }
  };

  const handleNomeClienteChange = (e) => {
    const nome = e.target.value;
    setNomeCliente(nome);
    if (nome.length >= 2) {
      const lista = clientes.filter(cli =>
        cli.nome.toLowerCase().includes(nome.toLowerCase())
      );
      setAutocompleteClientes(lista);
    } else {
      setAutocompleteClientes([]);
    }
  };

  const selecionarCliente = (cliente) => {
    setClienteSelecionado(cliente);
    setNomeCliente(cliente.nome);
    setAutocompleteClientes([]);
  };

  const handleNomeProdutoChange = (e) => {
    const nome = e.target.value;
    setNomeProduto(nome);
    if (nome.length >= 2) {
      const lista = produtos.filter(p =>
        p.descricao.toLowerCase().includes(nome.toLowerCase())
      );
      setAutocompleteProdutos(lista);
    } else {
      setAutocompleteProdutos([]);
    }
  };

  const handleNomeUsuarioChange = (e) => {
    const nome = e.target.value;
    setNomeUsuario(nome);
    if (nome.length >= 2) {
      const lista = usuarios.filter(u =>
        u.nome.toLowerCase().includes(nome.toLowerCase())
      );
      setAutocompleteUsuarios(lista);
    } else {
      setAutocompleteUsuarios([]);
    }
  };

  const selecionarProduto = (produto) => {
    setNomeProduto(produto.descricao);
    setProdutoId(produto.idProduto);
    setAutocompleteProdutos([]);
  };

  const selecionarUsuario = (usuario) => {
    setNomeUsuario(usuario.nome);
    setUsuarioSelecionado(usuario);
    setAutocompleteUsuarios([]);
  };

  const salvarReserva = async () => {
    if (!clienteSelecionado || !produtoId || !dataExpiracao || !motivo || !usuarioSelecionado) {
      alert("Preencha todos os campos");
      return;
    }

    const hoje = new Date();
    const dataSelecionada = new Date(dataExpiracao);
    if (dataSelecionada < hoje.setHours(0, 0, 0, 0)) {
      alert("Data de expiração não pode ser inferior ao dia atual.");
      return;
    }

    try {
      await axios.post("http://localhost:8800/Reserva", {
        clienteId: clienteSelecionado.idCliente,
        pessoaId: clienteSelecionado.idPessoa,
        produtoId,
        dataReserva: new Date().toISOString().split("T")[0],
        dataExpiracao,
        motivo,
        quantidade,
        usuarioNome: usuarioSelecionado.nome
      });
      setMensagem("Reserva salva com sucesso!");
      setProdutoId("");
      setNomeProduto("");
      setDataExpiracao("");
      setMotivo("reserva para buscar");
      setQuantidade(1);
      setNomeUsuario("");
      setUsuarioSelecionado(null);
      fetchReservas();
    } catch (err) {
      const msg = err?.response?.data?.error || "Erro ao salvar reserva.";
      alert(msg);
      setMensagem(msg);
    }
  };

  const excluirReserva = async (id) => {
    if (!window.confirm("Deseja excluir esta reserva?")) return;
    await axios.delete(`http://localhost:8800/Reserva/${id}`);
    fetchReservas();
  };

  const concluirReserva = async (id) => {
    if (!window.confirm("Confirmar conclusão da reserva?")) return;
    await axios.put(`http://localhost:8800/Reserva/concluir/${id}`);
    fetchReservas();
  };

  const cancelarReserva = async (id) => {
    if (!window.confirm("Deseja cancelar esta reserva?")) return;
    await axios.put(`http://localhost:8800/Reserva/cancelar/${id}`);
    fetchReservas();
  };

  const reservasFiltradas = reservas.filter(r =>
    r.cliente_nome.toLowerCase().includes(filtroClienteReservas.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Nova Reserva</h2>

      <div>
        <label>Cliente:</label>
        <input value={nomeCliente} onChange={handleNomeClienteChange} />
        {autocompleteClientes.length > 0 && (
          <ul className="autocomplete-list">
            {autocompleteClientes.map(cli => (
              <li key={cli.idPessoa} onClick={() => selecionarCliente(cli)}>{cli.nome}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label>Produto:</label>
        <input value={nomeProduto} onChange={handleNomeProdutoChange} />
        {autocompleteProdutos.length > 0 && (
          <ul className="autocomplete-list">
            {autocompleteProdutos.map(p => (
              <li key={p.idProduto} onClick={() => selecionarProduto(p)}>{p.descricao}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label>Quantidade:</label>
        <input type="number" min="1" value={quantidade} onChange={e => setQuantidade(Number(e.target.value))} />
      </div>

      <div>
        <label>Data de Expiração:</label>
        <input type="date" value={dataExpiracao} onChange={(e) => setDataExpiracao(e.target.value)} />
      </div>

      <div>
        <label>Motivo:</label>
        <select value={motivo} onChange={(e) => setMotivo(e.target.value)}>
          <option value="reserva para buscar">Reserva para buscar</option>
          <option value="condicional">Condicional</option>
        </select>
      </div>

      <div>
        <label>Usuário responsável:</label>
        <input value={nomeUsuario} onChange={handleNomeUsuarioChange} />
        {autocompleteUsuarios.length > 0 && (
          <ul className="autocomplete-list">
            {autocompleteUsuarios.map(u => (
              <li key={u.idPessoa} onClick={() => selecionarUsuario(u)}>{u.nome}</li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={salvarReserva}>Salvar</button>
      {mensagem && <p>{mensagem}</p>}

      <h3 style={{ marginTop: 30 }}>Reservas Realizadas</h3>

      <div>
        <label>Filtrar por nome do cliente:</label>
        <input value={filtroClienteReservas} onChange={e => setFiltroClienteReservas(e.target.value)} />
      </div>

      <table border="1" cellPadding="6" style={{ width: "100%", marginTop: 10 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Produto</th>
            <th>Motivo</th>
            <th>Expiração</th>
            <th>Quantidade</th>
            <th>Usuário</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {reservasFiltradas.map(res => (
            <tr key={res.idReserva} style={{
              backgroundColor: res.status === "concluida" ? "#d4edda" :
                               res.status === "cancelada" ? "#f8d7da" : "white"
            }}>
              <td>{res.idReserva}</td>
              <td>{res.cliente_nome}</td>
              <td>{res.produto_nome}</td>
              <td>{res.motivo}</td>
              <td>{new Date(res.data_expiracao).toLocaleDateString()}</td>
              <td>{res.quantidade}</td>
              <td>{res.usuario_nome}</td>
              <td>{res.status}</td>
              <td>
                {res.status === "ativa" && (
                  <>
                    <button onClick={() => concluirReserva(res.idReserva)}>Concluir</button>
                    <button onClick={() => cancelarReserva(res.idReserva)}>Cancelar</button>
                  </>
                )}
                <button onClick={() => excluirReserva(res.idReserva)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reserva;