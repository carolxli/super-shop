import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FormCategoria = () => {
    const [formData, setFormData] = useState({
        nome: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8800/Categoria', formData);

            if (response.status === 201 || response.status === 200) {
                alert('Categoria cadastrada com sucesso!');
                navigate('/listar-categorias');
            } else {
                alert('Erro ao cadastrar categoria');
            }
        } catch (error) {
            console.error('Erro ao cadastrar categoria:', error);
            alert('Erro ao cadastrar categoria.');
        }
    };

    return (
        <>
            <h3>Cadastrar Categoria</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Nome da Categoria
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                    />
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px' }}>
                    <button type="submit">Cadastrar</button>
                    <a href="/">
                        <button type="button">Cancelar</button>
                    </a>
                </div>
            </form>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px' }}>
                <a href="/listar-categorias">
                    <button>Listar Categorias Cadastradas</button>
                </a>
            </div>
        </>
    );
};

export default FormCategoria;
