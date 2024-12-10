import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ListarClientes = () => {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState(""); 

    useEffect(() => {
        const fetchClientes = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8800/Cliente`, {
                    params: { nome: search },
                });
                setClientes(response.data);
            } catch (err) {
                console.error("Erro ao buscar clientes:", err);
                setError("Erro ao carregar os clientes.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchClientes();
    }, [search]);
    
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Você tem certeza que deseja deletar este cliente?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8800/Cliente/${id}`);
                setClientes(clientes.filter(cliente => cliente.idCliente !== id));
            } catch (err) {
                console.error("Erro ao deletar cliente", err);
                alert("Erro ao deletar cliente. Tente novamente.");
            }
        }
    };

    return (
        <>
            <h2>Lista de Clientes</h2>
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
                        <th>CPF</th>
                        <th>RG</th>
                        <th>Voucher</th>
                        <th>Última Compra</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6">Carregando...</td>
                        </tr>
                    ) : clientes.length > 0 ? (
                        clientes.map((cliente) => (
                            <tr key={cliente.idCliente}>
                                <td>{cliente.pessoa_nome}</td>
                                <td>{cliente.cpf}</td>
                                <td>{cliente.rg}</td>
                                <td>{cliente.voucher}</td>
                                <td>{cliente.ultima_compra ? new Date(cliente.ultima_compra).toLocaleDateString() : "Sem compras"}</td>
                                <td>
                                    <button onClick={() => navigate(`/editarCliente/${cliente.idCliente}`)}>Editar</button>
                                    <button onClick={() => handleDelete(cliente.idCliente)}>Deletar</button>
                                    <button>Ver Compras</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">Nenhum cliente encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
};

export default ListarClientes;
