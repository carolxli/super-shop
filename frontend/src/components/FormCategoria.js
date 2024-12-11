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
            <h3 style={{marginLeft: "35%", marginTop: "8%" }}>Cadastrar Categoria</h3>
            <div style={{ width: "100%", display: 'flex' }}>
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

                    <div>
                        <button type="submit">Cadastrar</button>
                        <a href="/">
                            <button type="button" >Cancelar</button>
                        </a>
                    </div>
                </form>
                </div>
                <div style={{ width: "17%", display: 'flex', marginLeft: "35%" }}>
                    <a href="/listar-categorias">
                        <button>Listar Categorias Cadastradas</button>
                    </a>
                </div>
            
        </>
    );
};

export default FormCategoria;
