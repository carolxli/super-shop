import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ListarComissao = () => {
  const [comissoes, setComissoes] = useState([]);

  useEffect(() => {
    const fetchComissoes = async () => {
      try {
        const response = await axios.get("http://localhost:8800/comissao");
        setComissoes(response.data);
      } catch (error) {
        console.error("Erro ao buscar comissões:", error);
      }
    };

    fetchComissoes();
  }, []);

  const handleDelete = async (idComissao) => {
    if (!window.confirm("Deseja excluir esta comissão?")) return;

    try {
      await axios.delete(`http://localhost:8800/comissao/${idComissao}`);
      setComissoes(
        comissoes.filter((comissao) => comissao.idComissao !== idComissao)
      );
    } catch (error) {
      console.error("Erro ao excluir comissão:", error);
    }
  };

  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");

  const handleFilter = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/comissao/${mes}/${ano}`
      );
      setComissoes(response.data);
    } catch (error) {
      console.error("Erro ao filtrar comissões:", error);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Comissões</h2>
      <div style={{ display: "inline-block", textAlign: "left" }}>
        <label>
          Mês:
          <select
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            style={{ width: "100px", marginRight: "10px" }}
          >
            <option value="">Selecione</option>
            {[...Array(12).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
        <label>
          Ano:
          <input
            type="number"
            min="0"
            max="2100"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            style={{ width: "100px", marginRight: "10px" }}
          />
        </label>
        <button onClick={handleFilter} style={{ width: "150px" }}>
          Filtrar
        </button>
        <Link to="/cadastrarComissao">
          <button style={{ width: "200px", marginLeft: "10px" }}>
            Cadastrar Nova Comissão
          </button>
        </Link>
      </div>
      <div style={{ margin: "20px 0" }}></div>
      <table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "center", padding: "8px" }}>ID</th>
            <th style={{ textAlign: "center", padding: "8px" }}>Mês</th>
            <th style={{ textAlign: "center", padding: "8px" }}>Ano</th>
            <th style={{ textAlign: "center", padding: "8px" }}>Valor</th>
            <th style={{ textAlign: "center", padding: "8px" }}>Descrição</th>
            <th style={{ textAlign: "center", padding: "8px" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {comissoes.map((comissao) => (
            <tr key={comissao.idComissao}>
              <td style={{ textAlign: "center", padding: "8px" }}>
                {comissao.idComissao}
              </td>
              <td style={{ textAlign: "center", padding: "8px" }}>
                {comissao.mes}
              </td>
              <td style={{ textAlign: "center", padding: "8px" }}>
                {comissao.ano}
              </td>
              <td style={{ textAlign: "center", padding: "8px" }}>
                {comissao.valor}
              </td>
              <td style={{ textAlign: "center", padding: "8px" }}>
                {comissao.descricao}
              </td>
              <td style={{ textAlign: "center", padding: "8px" }}>
                <Link to={`/editarComissao/${comissao.idComissao}`}>
                  <button>Editar</button>
                </Link>
                <button onClick={() => handleDelete(comissao.idComissao)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarComissao;
