// src/pages/ListarPessoas.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ListarPessoas = () => {
    const navigate = useNavigate();
    const [pessoas, setPessoas] = useState([]);
    const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
    const [error, setError] = useState(null); // Estado para erros

    useEffect(() => {
        const fetchPessoas = async () => {
            try {
                const response = await axios.get("http://localhost:8800/Pessoa");
                console.log("Resposta da API:", response.data); // Log da resposta
                setPessoas(response.data.rows); // Ajustar para acessar o array correto
                setLoading(false);
            } catch (err) {
                console.error("Erro ao buscar pessoas", err);
                setError("Erro ao carregar pessoas.");
                setLoading(false);
            }
        };

        fetchPessoas();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Você tem certeza que deseja deletar esta pessoa?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8800/Pessoa/${id}`);
                setPessoas(pessoas.filter(pessoa => pessoa.idPessoa !== id)); // Atualiza o estado
            } catch (err) {
                console.error("Erro ao deletar pessoa", err);
                alert("Erro ao deletar pessoa. Tente novamente.");
            }
        }
    };

    if (loading) {
        return <div>Carregando pessoas...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Lista de Pessoas</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Rua</th>
                        <th>Número</th>
                        <th>Bairro</th>
                        <th>Complemento</th>
                        <th>Cidade</th>
                        <th>Estado</th>
                        <th>CEP</th>
                        <th>Telefone 1</th>
                        <th>Telefone 2</th>
                        <th>Data de Nascimento</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {pessoas.length > 0 ? (
                        pessoas.map((pessoa) => (
                            <tr key={pessoa.idPessoa}>
                                <td>{pessoa.idPessoa}</td>
                                <td>{pessoa.nome}</td>
                                <td>{pessoa.email}</td>
                                <td>{pessoa.end_rua}</td>
                                <td>{pessoa.end_numero}</td>
                                <td>{pessoa.end_bairro}</td>
                                <td>{pessoa.end_complemento}</td>
                                <td>{pessoa.cidade}</td>
                                <td>{pessoa.estado}</td>
                                <td>{pessoa.cep}</td>
                                <td>{pessoa.telefone_1}</td>
                                <td>{pessoa.telefone_2 || '-'}</td> {/* Exibe '-' se telefone_2 for null */}
                                <td>{new Date(pessoa.data_nasc).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => navigate(`/editarPessoa/${pessoa.idPessoa}`)}>Editar</button>
                                    <button onClick={() => handleDelete(pessoa.idPessoa)}>Deletar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="14">Nenhuma pessoa cadastrada.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListarPessoas;
