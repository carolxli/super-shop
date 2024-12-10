import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditarCategoria = () => {
    const { idCategoria } = useParams();
    const [categoria, setCategoria] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoria = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/Categoria/${idCategoria}`);
                setCategoria(response.data);
            } catch (error) {
                console.error("Erro ao buscar categoria:", error);
                alert("Erro ao carregar a categoria. Tente novamente.");
            }
        };
        fetchCategoria();
    }, [idCategoria]);

    const handleChange = (e) => {
        setCategoria({ ...categoria, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const confirmEdit = window.confirm("Você tem certeza que deseja editar esta categoria?");
        if (confirmEdit) {
            try {
                await axios.put(`http://localhost:8800/Categoria/${idCategoria}`, categoria);
                alert("Categoria editada com sucesso!");
                navigate('/listar-categorias');
            } catch (error) {
                console.error("Erro ao editar categoria:", error);
                alert("Erro ao editar a categoria. Tente novamente.");
            }
        }
    };

    return (
        <>
            <h3>Editar Categoria</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Nome
                    <input
                        type="text"
                        name="nome"
                        value={categoria.nome || ''}
                        onChange={handleChange}
                        required
                    />
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '315px' }}>
                    <button type="submit">Editar</button>
                    <a href='/listar-categorias'>
                        <button type="button">Cancelar</button>
                    </a>
                </div>
            </form>
        </>
    );
};

export default EditarCategoria;
