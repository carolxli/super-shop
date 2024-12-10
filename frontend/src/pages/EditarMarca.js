import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditarMarca = () => {
    const { idMarca } = useParams();
    const [marca, setMarca] = useState({});  // Inicializa como objeto vazio
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMarca = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/marca/${idMarca}`);
                setMarca(response.data);  // Assume que a resposta é um objeto e não um array
            } catch (error) {
                console.error("Erro ao buscar marca:", error);
                alert("Erro ao carregar a marca. Tente novamente.");
            }
        };
        fetchMarca();
    }, [idMarca]);

    const handleChange = (e) => {
        setMarca({ ...marca, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const confirmEdit = window.confirm("Você tem certeza que deseja editar esta marca?");
        if (confirmEdit) {
            try {
                await axios.put(`http://localhost:8800/marca/${idMarca}`, marca);
                alert("Marca editada com sucesso!");
                navigate('/listar-marcas');
            } catch (error) {
                console.error("Erro ao editar marca:", error);
                alert("Erro ao editar a marca. Tente novamente.");
            }
        }
    };

    return (
        <>
            <h3>Editar Marca</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Nome
                    <input
                        type="text"
                        name="nome"
                        value={marca.nome || ''}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label style={{ marginTop: '10px' }}>
                    Descrição
                    <textarea
                        name="descricao"
                        value={marca.descricao || ''}
                        onChange={handleChange}
                        required
                    />
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px' }}>
                    <button type="submit">Editar</button>
                    <a href='/listar-marcas'>
                        <button type="button">Cancelar</button>
                    </a>
                </div>
            </form>
        </>
    );
};

export default EditarMarca;
