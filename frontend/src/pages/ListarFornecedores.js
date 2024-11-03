import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ListarFornecedores = () => {
    const navigate = useNavigate();
    const [fornecedores, setFornecedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFornecedores = async () => {
            try {
                const response = await axios.get("http://localhost:8800/Fornecedor");
                console.log("Resposta da API:", response.data);
                setFornecedores(response.data.rows || response.data);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao buscar fornecedores", err);
                setError("Erro ao carregar fornecedores.");
                setLoading(false);
            }
        };

        fetchFornecedores();
    }, []);

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
                        <th>CNPJ</th>
                        <th>Razão Social</th>
                        <th>Quantidade Mínima de Pedido</th>
                        <th>Prazos de Entrega (dias)</th>
                        <th>Data de Início de Fornecimento</th>
                        <th>Observação</th>
                        <th>ID Pessoa</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {fornecedores.length > 0 ? (
                        fornecedores.map((fornecedor) => (
                            <tr key={fornecedor.idFornecedor}>
                                <td>{fornecedor.cnpj}</td>
                                <td>{fornecedor.razao_social}</td>
                                <td>{fornecedor.qtd_min_pedido}</td>
                                <td>{fornecedor.prazo_entrega}</td>
                                <td>{fornecedor.dt_inicio_fornecimento}</td>
                                <td>{fornecedor.observacao}</td>
                                <td>{fornecedor.Pessoa_idPessoa}</td>
                                <td>
                                    <button onClick={() => navigate(`/editarFornecedor/${fornecedor.idFornecedor}`)}>Editar</button>
                                    <button onClick={() => handleDelete(fornecedor.idFornecedor)}>Deletar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">Nenhum fornecedor encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
};

export default ListarFornecedores;
