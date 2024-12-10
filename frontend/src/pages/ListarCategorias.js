import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ListarCategorias = () => {
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nomeFiltro, setNomeFiltro] = useState("");

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/Categoria?nome=${nomeFiltro}`);
                console.log("Resposta da API:", response.data);
                setCategorias(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao buscar categorias", err);
                setError("Erro ao carregar categorias.");
                setLoading(false);
            }
        };

        fetchCategorias();
    }, [nomeFiltro]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Você tem certeza que deseja deletar esta categoria?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8800/Categoria/${id}`);
                setCategorias(categorias.filter(categoria => categoria.idCategoria !== id));
            } catch (err) {
                console.error("Erro ao deletar categoria", err);
                alert("Erro ao deletar categoria. Tente novamente.");
            }
        }
    };

    const handleFilterChange = (e) => {
        setNomeFiltro(e.target.value);
    };

    if (loading) {
        return <div>Carregando categorias...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div>
                <h2>Lista de Categorias</h2>

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
                        {categorias.length > 0 ? (
                            categorias.map((categoria) => (
                                <tr key={categoria.idCategoria}>
                                    <td>{categoria.nome}</td>
                                    <td>
                                        <button onClick={() => navigate(`/editarCategoria/${categoria.idCategoria}`)}>Editar</button>
                                        <button onClick={() => handleDelete(categoria.idCategoria)}>Deletar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">Nenhuma categoria encontrada.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ListarCategorias;
