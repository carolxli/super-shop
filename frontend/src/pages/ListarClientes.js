import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ListarClientes = () => {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search] = useState("");
    const [modalOpen, setModalOpen] = useState(false); // Estado para controlar o modal
    const [vendas, setVendas] = useState([]); // Estado para armazenar as vendas do cliente
    const [selectedCliente, setSelectedCliente] = useState(null); // Cliente selecionado

    useEffect(() => {
        const fetchClientes = async () => {
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

    const handleViewVendas = async (idCliente) => {
        try {
            const response = await axios.get(`http://localhost:8800/vendasCliente/${idCliente}`);
            console.log('Vendas do Cliente:', response.data);
            if (response.data.length === 0) {
                alert("Nenhuma venda encontrada para este cliente.");
            }
            setVendas(response.data);
            setSelectedCliente(idCliente);
            setModalOpen(true);
        } catch (err) {
            console.error("Erro ao buscar vendas:", err);
            alert("Erro ao carregar as vendas.");
        }
    };
    
    

    const closeModal = () => {
        setModalOpen(false);
        setVendas([]);
    };

    if (loading) {
        return <div>Carregando Clientes...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <h2>Lista de Clientes</h2>
            <table>
                <thead>
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
                    {clientes.length > 0 ? (
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
                                    <button onClick={() => handleViewVendas(cliente.idCliente)}>Ver Compras</button>
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

            {/* Modal para exibir as vendas */}
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Vendas do Cliente {selectedCliente}</h3>
                        <button onClick={closeModal}>Fechar</button>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID Venda</th>
                                    <th>Data</th>
                                    <th>Valor Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendas.length > 0 ? (
                                    vendas.map((venda) => (
                                        <tr key={venda.idVenda}>
                                            <td>{venda.idVenda}</td>
                                            <td>{new Date(venda.data).toLocaleDateString()}</td>
                                            <td>{venda.valor_total}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3">Nenhuma venda encontrada.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};

export default ListarClientes;
