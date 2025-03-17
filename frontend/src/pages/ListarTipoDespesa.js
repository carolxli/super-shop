import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ListarTipoDespesa = () => {
  const [tiposDespesa, setTiposDespesa] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      toast.error("Por favor, insira um termo de busca.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8800/tipos-despesa/nome/${searchTerm}`
      );
      console.log(
        "Resposta da API para busca de tipos de despesa:",
        response.data
      );

      if (response.data.length === 0) {
        toast.info("Nenhum tipo de despesa encontrado.");
      }
      setTiposDespesa(response.data);
    } catch (err) {
      console.error("Erro ao buscar tipos de despesa:", err);
      toast.error("Erro ao buscar tipos de despesa.");
    }
  };

  const handleDelete = async (idTipo) => {
    if (!window.confirm("Tem certeza que deseja deletar este tipo de despesa?"))
      return;

    try {
      await axios.delete(`http://localhost:8800/tipos-despesa/${idTipo}`);
      toast.success("Tipo de despesa deletado com sucesso!");
      window.alert("Tipo de despesa deletado com sucesso!");
      setTiposDespesa(tiposDespesa.filter((tipo) => tipo.idTipo !== idTipo));
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.error(err.response.data.message);
        window.alert(
          "Não é possível deletar este tipo de despesa, pois está associado a uma ou mais despesas."
        );
      } else {
        console.error("Erro ao deletar tipo de despesa:", err);
        toast.error("Erro ao deletar tipo de despesa.");
      }
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "800px", width: "100%", textAlign: "center" }}>
        <h2>Listar Tipos de Despesa</h2>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Pesquisar tipos de despesa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px",
              width: "300px",
              marginBottom: "10px",
            }}
          />
          <div>
            <button
              onClick={handleSearch}
              style={{ marginRight: "10px", width: "300px", padding: "8px" }}
            >
              Buscar
            </button>
            <button
              onClick={() => setSearchTerm("")}
              style={{ marginRight: "10px", width: "300px", padding: "8px" }}
            >
              Limpar
            </button>
            <Link to="/cadastrarTipoDespesa">
              <button style={{ width: "300px", padding: "8px" }}>
                Cadastrar Novo Tipo de Despesa
              </button>
            </Link>
          </div>
        </div>
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          style={{ width: "100%", textAlign: "left", margin: "0 auto" }}
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
    </div>
  );
};

export default ListarTipoDespesa;
