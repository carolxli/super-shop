import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ListarTipoDespesa = () => {
  const [tiposDespesa, setTiposDespesa] = useState([]);
  const [filteredTiposDespesa, setFilteredTiposDespesa] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("nome"); // 'nome' ou 'id'

  useEffect(() => {
    const fetchTiposDespesa = async () => {
      try {
        const response = await axios.get("http://localhost:8800/tipos-despesa");
        console.log("Resposta da API para tipos de despesa:", response.data);
        const sortedData = response.data.sort((a, b) =>
          a.nome_tipo.localeCompare(b.nome_tipo)
        );
        setTiposDespesa(sortedData);
        setFilteredTiposDespesa(sortedData);
      } catch (err) {
        console.error("Erro ao buscar tipos de despesa:", err);
        toast.error("Erro ao buscar tipos de despesa");
      }
    };

    fetchTiposDespesa();
  }, []);

  useEffect(() => {
    const handleSearch = () => {
      if (searchTerm.trim() === "") {
        // Se não há termo de busca, ordena alfabeticamente por nome
        const sorted = [...tiposDespesa].sort((a, b) =>
          a.nome_tipo.localeCompare(b.nome_tipo)
        );
        setFilteredTiposDespesa(sorted);
      } else {
        let filtered = [];

        if (filterType === "nome") {
          filtered = tiposDespesa.filter((tipo) =>
            tipo.nome_tipo.toLowerCase().includes(searchTerm.toLowerCase())
          );
        } else if (filterType === "id") {
          filtered = tiposDespesa.filter((tipo) =>
            tipo.idTipo.toString().includes(searchTerm)
          );
        }

        // Ordena os resultados filtrados alfabeticamente por nome
        const sortedFiltered = filtered.sort((a, b) =>
          a.nome_tipo.localeCompare(b.nome_tipo)
        );

        setFilteredTiposDespesa(sortedFiltered);
      }
    };

    handleSearch();
  }, [searchTerm, tiposDespesa, filterType]);

  const handleDelete = async (idTipo) => {
    if (!window.confirm("Tem certeza que deseja deletar este tipo de despesa?"))
      return;

    try {
      await axios.delete(`http://localhost:8800/tipos-despesa/${idTipo}`);
      toast.success("Tipo de despesa deletado com sucesso!");
      window.alert("Tipo de despesa deletado com sucesso!");
      const updatedTiposDespesa = tiposDespesa.filter(
        (tipo) => tipo.idTipo !== idTipo
      );
      setTiposDespesa(updatedTiposDespesa);
      // Reaplica ordenação alfabética após remoção
      const sortedUpdated = updatedTiposDespesa.sort((a, b) =>
        a.nome_tipo.localeCompare(b.nome_tipo)
      );
      setFilteredTiposDespesa(sortedUpdated);
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
        <h2>Gerenciamento de Tipos de Despesa</h2>
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: "8px",
                marginRight: "5px",
              }}
            >
              <option value="nome">Filtrar por Nome</option>
              <option value="id">Filtrar por ID</option>
            </select>
            <input
              type="text"
              placeholder={
                filterType === "nome"
                  ? "Digite o nome do tipo de despesa..."
                  : "Digite o ID..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "8px",
                width: "300px",
              }}
            />
          </div>
          <Link to="/cadastrarTipoDespesa">
            <button style={{ width: "300px", padding: "8px" }}>
              Cadastrar Novo Tipo de Despesa
            </button>
          </Link>
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
              <th>Tipo de Despesa ↑</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredTiposDespesa.length > 0 ? (
              filteredTiposDespesa.map((tipo) => (
                <tr key={tipo.idTipo}>
                  <td>{tipo.idTipo}</td>
                  <td>{tipo.nome_tipo}</td>
                  <td>{tipo.descricao_tipo || "Não definido"}</td>
                  <td>
                    <Link to={`/editarTipoDespesa/${tipo.idTipo}`}>
                      <button
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#4CAF50",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          marginRight: "5px",
                        }}
                      >
                        Editar
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(tipo.idTipo)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#FF6347",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                      }}
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">
                  {searchTerm.trim() === ""
                    ? "Nenhum tipo de despesa encontrado."
                    : `Nenhum resultado encontrado para "${searchTerm}".`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
          Mostrando {filteredTiposDespesa.length} de {tiposDespesa.length} tipos
          de despesa
        </div>
      </div>
    </div>
  );
};

export default ListarTipoDespesa;
