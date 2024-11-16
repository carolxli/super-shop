import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ListarDespesa = () => {
  const [despesas, setDespesas] = useState([]); // Estado inicial como array vazio
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const fetchDespesas = async () => {
      try {
        const response = await axios.get("http://localhost:8800/despesa");
        console.log("Resposta da API para despesas:", response.data); // Log da resposta

        // Ajuste para acessar o array correto
        if (response.data && Array.isArray(response.data.rows)) {
          setDespesas(response.data.rows);
        } else {
          console.error("Resposta da API não é um array:", response.data);
          setDespesas([]);
          toast.error("Erro ao buscar despesas.");
        }
      } catch (err) {
        console.error("Erro ao buscar despesas:", err);
        toast.error("Erro ao buscar despesas");
        setDespesas([]);
      }
    };

    fetchDespesas();
  }, []);

  const handleDelete = async (idDespesa) => {
    if (!window.confirm("Tem certeza que deseja deletar esta despesa?")) return;

    try {
      await axios.delete(`http://localhost:8800/despesa/${idDespesa}`);
      toast.success("Despesa deletada com sucesso!");
      setDespesas((prevDespesas) =>
        prevDespesas.filter((despesa) => despesa.idDespesa !== idDespesa)
      );
    } catch (err) {
      console.error("Erro ao deletar despesa:", err);
      toast.error("Erro ao deletar despesa.");
    }
  };

  const handleFilterChange = (e) => {
    setFiltro(e.target.value);
  };

  const despesasFiltradas = despesas.filter((despesa) =>
    despesa.descricao.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <h2>Listar Despesas</h2>
      <input
        type="text"
        placeholder="Pesquisar por nome"
        value={filtro}
        onChange={handleFilterChange}
      />
      <Link to="/cadastrarDespesa">
        <button>Cadastrar Nova Despesa</button>
      </Link>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome da Despesa</th>
            <th>Tipo de Despesa</th>
            <th>Valor</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {despesasFiltradas.length > 0 ? (
            despesasFiltradas.map((despesa) => (
              <tr key={despesa.idDespesa}>
                <td>{despesa.idDespesa}</td>
                <td>{despesa.descricao}</td>
                <td>{despesa.Tipo_idTipo}</td>{" "}
                {/* Idealmente, exibir o nome do tipo */}
                <td>{despesa.valor}</td>
                <td>{despesa.dt_despesa}</td>
                <td>
                  <Link to={`/editarDespesa/${despesa.idDespesa}`}>
                    <button>Editar</button>
                  </Link>
                  <button onClick={() => handleDelete(despesa.idDespesa)}>
                    Deletar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Nenhuma despesa encontrada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListarDespesa;
