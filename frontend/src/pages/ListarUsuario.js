import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ListarUsuarios = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8800/Usuario`, {
                    params: { nome: search },
                });
                setUsuarios(response.data);
            } catch (err) {
                console.error("Erro ao buscar Usuarios:", err);
                setError("Erro ao carregar os Usuarios.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, [search]);

   const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Você tem certeza que deseja deletar este Usuario?");
    if (confirmDelete) {
        try {
            await axios.delete(`http://localhost:8800/Usuario/${id}`);
            setUsuarios(usuarios.filter(usuarios => usuarios.idUsuario !== id));
        } catch (err) {
            console.error("Erro ao deletar Usuario", err);
            const msg = err.response?.data?.error || "Erro ao deletar Usuario. Tente novamente.";
            alert(msg);  // EXIBE A MENSAGEM DE ERRO VINDO DO BACKEND
        }
    }
};



    return (
        <>
            <h2>Usuários</h2>
            <table>
                <thead>
                    <tr>
                        <th colSpan="6">
                            <input
                                type="text"
                                placeholder="Pesquisar por Nome"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ width: "15%" }}
                            />
                        </th>
                    </tr>
                    <tr>
                        <th>Nome</th>
                        <th>Data contratação</th>
                        <th>Cargo</th>
                        <th>Última Venda</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6">Carregando...</td>
                        </tr>
                    ) : usuarios.length > 0 ? (
                        usuarios.map((usuario) => (
                            <tr key={usuario.idUsuario}>
                                <td>{usuario.pessoa_nome}</td>
                                <td>
                                    {usuario.dt_contratacao
                                        ? new Date(usuario.dt_contratacao).toLocaleDateString("pt-BR")
                                        : "Data não disponível"}
                                </td>
                                <td>{usuario.cargo}</td>
                                <td>
                                    {usuario.ultima_venda
                                        ? new Date(usuario.ultima_venda).toLocaleDateString("pt-BR")
                                        : "Sem vendas"}
                                </td>
                                <td>
                                    <button onClick={() => navigate(`/editarUsuario/${usuario.idUsuario}`)}>Editar</button>
                                    <button onClick={() => handleDelete(usuario.idUsuario)}>Deletar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">Nenhum usuário encontrado.</td>
                        </tr>
                    )}
                </tbody>

            </table>
        </>
    );
};

export default ListarUsuarios;
