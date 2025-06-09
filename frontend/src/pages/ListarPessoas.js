import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ListarPessoas = () => {
    const navigate = useNavigate();
    const [pessoas, setPessoas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nomeFiltro, setNomeFiltro] = useState("");

    useEffect(() => {
        const fetchPessoas = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/Pessoa?nome=${nomeFiltro}`);
                console.log("Resposta da API:", response.data);
                setPessoas(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao buscar pessoas", err);
                setError("Erro ao carregar pessoas.");
                setLoading(false);
            }
        };

        fetchPessoas();
    }, [nomeFiltro]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Você tem certeza que deseja deletar esta pessoa?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8800/Pessoa/${id}`);
                setPessoas(pessoas.filter(pessoa => pessoa.idPessoa !== id));
            } catch (err) {
                console.error("Erro ao deletar pessoa", err);
                alert("Erro ao deletar pessoa. Tente novamente.");
            }
        }
    };

    const handleFilterChange = (e) => {
        setNomeFiltro(e.target.value);
    };

    if (loading) {
        return <div>Carregando pessoas...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div>
                <h2>Pessoas</h2>

                <table>
                    <thead>
                        <tr>
                            <th colSpan="11">
                                <input
                                    type="text"
                                    placeholder="Pesquisar por nome"
                                    value={nomeFiltro}
                                    onChange={handleFilterChange}
                                    style={{ width: "15%" }}
                                />
                            </th>
                        </tr>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Rua</th>
                            <th>Número</th>
                            <th>Bairro</th>
                            <th>Complemento</th>
                            <th>Cidade</th>
                            <th>Estado</th>
                            <th>Telefone 1</th>
                            <th>Telefone 2</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pessoas.length > 0 ? (
                            pessoas.map((pessoa) => (
                                <tr key={pessoa.idPessoa}>
                                    <td>{pessoa.nome}</td>
                                    <td>{pessoa.email}</td>
                                    <td>{pessoa.end_rua}</td>
                                    <td>{pessoa.end_numero}</td>
                                    <td>{pessoa.end_bairro}</td>
                                    <td>{pessoa.end_complemento}</td>
                                    <td>{pessoa.cidade}</td>
                                    <td>{pessoa.estado}</td>
                                    <td>{pessoa.telefone_1}</td>
                                    <td>{pessoa.telefone_2 || '-'}</td>
                                    <td>
                                        <button onClick={() => navigate(`/editarPessoa/${pessoa.idPessoa}`)}>Editar</button>
                                        <button onClick={() => handleDelete(pessoa.idPessoa)}>Deletar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11">Nenhuma pessoa encontrada.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ListarPessoas;