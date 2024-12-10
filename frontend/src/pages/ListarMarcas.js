import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ListarMarcas = () => {
    const navigate = useNavigate();
    const [marcas, setMarcas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nomeFiltro, setNomeFiltro] = useState("");

    useEffect(() => {
        const fetchMarcas = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/marca?nome=${nomeFiltro}`);
                console.log("Resposta da API:", response.data);
                setMarcas(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao buscar marcas", err);
                setError("Erro ao carregar marcas.");
                setLoading(false);
            }
        };

        fetchMarcas();
    }, [nomeFiltro]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Você tem certeza que deseja deletar esta marca?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8800/marca/${id}`);
                setMarcas(marcas.filter(marca => marca.idMarca !== id));
            } catch (err) {
                console.error("Erro ao deletar marca", err);
                alert("Erro ao deletar marca. Tente novamente.");
            }
        }
    };

    const handleFilterChange = (e) => {
        setNomeFiltro(e.target.value);
    };

    if (loading) {
        return <div>Carregando marcas...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div>
                <h2>Lista de Marcas</h2>

                <table>
                    <thead>
                        <tr>
                            <th colSpan="2">
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
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marcas.length > 0 ? (
                            marcas.map((marca) => (
                                <tr key={marca.idMarca}>
                                    <td>{marca.nome}</td>
                                    <td>
                                        <button onClick={() => navigate(`/editarMarca/${marca.idMarca}`)}>Editar</button>
                                        <button onClick={() => handleDelete(marca.idMarca)}>Deletar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">Nenhuma marca encontrada.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ListarMarcas;
