import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ListarTipoDespesa = () => {
  const [tiposDespesa, setTiposDespesa] = useState([]);

  useEffect(() => {
    const fetchTiposDespesa = async () => {
      try {
        const response = await axios.get("http://localhost:8800/tipos-despesa");
        console.log("Resposta da API para tipos de despesa:", response.data);
        setTiposDespesa(response.data);
      } catch (err) {
        console.error("Erro ao buscar tipos de despesa:", err);
        toast.error("Erro ao buscar tipos de despesa");
      }
    };

    fetchTiposDespesa();
  }, []);

  const handleDelete = async (idTipo) => {
    if (!window.confirm("Tem certeza que deseja deletar este tipo de despesa?"))
      return;

    try {
      await axios.delete(`http://localhost:8800/tipos-despesa/${idTipo}`);
      toast.success("Tipo de despesa deletado com sucesso!");
      setTiposDespesa(tiposDespesa.filter((tipo) => tipo.idTipo !== idTipo));
    } catch (err) {
      console.error("Erro ao deletar tipo de despesa:", err);
      toast.error("Erro ao deletar tipo de despesa.");
    }
  };

  return (
    <div>
      <h2>Listar Tipos de Despesa</h2>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/cadastrarTipoDespesa">
          <button>Cadastrar Novo Tipo de Despesa</button>
        </Link>
      </div>
      <table
        border="1"
        cellPadding="10"
        cellSpacing="0"
        style={{ width: "100%", textAlign: "left" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome do Tipo</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tiposDespesa.length > 0 ? (
            tiposDespesa.map((tipo) => (
              <tr key={tipo.idTipo}>
                <td>{tipo.idTipo}</td>
                <td>{tipo.nome_tipo}</td>
                <td>{tipo.descricao_tipo || "Não definido"}</td>
                <td>
                  <Link to={`/editarTipoDespesa/${tipo.idTipo}`}>
                    <button style={{ marginRight: "5px" }}>Editar</button>
                  </Link>
                  <button onClick={() => handleDelete(tipo.idTipo)}>
                    Deletar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Nenhum tipo de despesa encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListarTipoDespesa;
