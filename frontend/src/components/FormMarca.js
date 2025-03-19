import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FormMarca = () => {
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
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
            const response = await axios.post('http://localhost:8800/marca', formData);

            if (response.status === 201 || response.status === 200) {
                alert('Marca cadastrada com sucesso!');
                navigate('/listar-marcas');
            } else {
                alert('Erro ao cadastrar marca');
            }
        } catch (error) {
            console.error('Erro ao cadastrar marca:', error);
            alert('Erro ao cadastrar marca.');
        }
    };

    return (
        <>
            <h3>Cadastrar Marca</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Nome da Marca
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label style={{ marginTop: '10px' }}>
                    Descrição
                    <textarea
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        required
                    />
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '35px', marginLeft: '300px' }}>
                    <a href="/listar-marcas" style={{ display: 'inline-block' }}>
                        <button type="button">Listar</button>
                    </a>
                    <button type="submit">Cadastrar</button>
                </div>
                <a href='/' style={{ display: 'inline-block' }}>
                    <button type="button">Cancelar</button>
                </a>
            </form>
        </>
    );
};

export default FormMarca;
