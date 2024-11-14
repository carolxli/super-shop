import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ListarFornecedores = () => {
    const navigate = useNavigate();
    const [fornecedores, setFornecedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [razaoSocialFiltro, setRazaoSocialFiltro] = useState("");

    useEffect(() => {
        const fetchFornecedores = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/Fornecedor?razao_social=${razaoSocialFiltro}`);
                console.log("Resposta da API:", response.data);
                setFornecedores(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao buscar fornecedores", err);
                setError("Erro ao carregar fornecedores.");
                setLoading(false);
            }
        };

        fetchFornecedores();
    }, [razaoSocialFiltro]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Você tem certeza que deseja deletar este fornecedor?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8800/Fornecedor/${id}`);
                setFornecedores(fornecedores.filter(fornecedor => fornecedor.idFornecedor !== id));
            } catch (err) {
                console.error("Erro ao deletar fornecedor", err);
                alert("Erro ao deletar fornecedor. Tente novamente.");
            }
        }
    };

    const handleFilterChange = (e) => {
        setRazaoSocialFiltro(e.target.value);
    };

    if (loading) {
        return <div>Carregando fornecedores...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <h2>Lista de Fornecedores</h2>
            <table>
                <thead>
                    <tr>
                        <th colSpan="11">
                            <input
                                type="text"
                                placeholder="Pesquisar por Razão Social"
                                value={razaoSocialFiltro}
                                onChange={handleFilterChange}
                                style={{ width: "15%" }}
                            />
                        </th>
                    </tr>
                    <tr>
                        <th>CNPJ</th>
                        <th>Nome</th>
                        <th>Razão Social</th>
                        <th>Marcas</th>
                        <th>Observação</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {fornecedores.length > 0 ? (
                        fornecedores.map((fornecedor) => (
                            <tr key={fornecedor.idFornecedor}>
                                <td>{fornecedor.cnpj}</td>
                                <td>{fornecedor.pessoa_nome}</td>
                                <td>{fornecedor.razao_social}</td>
                                <td>{fornecedor.marcas_nome}</td>
                                <td>{fornecedor.observacao}</td>
                                <td>
                                    <button onClick={() => navigate(`/editarFornecedor/${fornecedor.idFornecedor}`)}>Editar</button>
                                    <button onClick={() => handleDelete(fornecedor.idFornecedor)}>Deletar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9">Nenhum fornecedor encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
};

export default ListarFornecedores;
