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
      setComissoes(comissoes.filter((comissao) => comissao.idComissao !== idComissao));
    } catch (error) {
      console.error("Erro ao excluir comissão:", error);
    }
  };

  return (
    <div>
      <h2>Comissões</h2>
      <Link to="/cadastrarComissao">
        <button>Cadastrar Nova Comissão</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Mês</th>
            <th>Ano</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {comissoes.map((comissao) => (
            <tr key={comissao.idComissao}>
              <td>{comissao.idComissao}</td>
              <td>{comissao.mes}</td>
              <td>{comissao.ano}</td>
              <td>{comissao.valor}</td>
              <td>
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