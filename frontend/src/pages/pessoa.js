// src/pages/pessoa.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Pessoa = () => {
    const [formData, setFormData] = useState({
        email: '',
        nome: '',
        end_rua: '',
        end_numero: '',
        end_bairro: '',
        end_complemento: '',
        cidade: '',
        estado: '',
        cep: '',
        telefone_1: '',
        telefone_2: '',
        data_nasc: '',
    });

    const navigate = useNavigate(); // Usando useNavigate para redirecionar

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8800/Pessoa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Pessoa cadastrada com sucesso!');
                navigate('/listar-pessoas'); // Redireciona para a lista de pessoas
            } else {
                alert('Erro ao cadastrar pessoa');
            }
        } catch (error) {
            console.error('Erro ao cadastrar pessoa:', error);
        }
    };

    return (
        <div>
            <h1>Cadastrar Pessoa</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="nome" placeholder="Nome" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="text" name="end_rua" placeholder="Rua" onChange={handleChange} required />
                <input type="text" name="end_numero" placeholder="Número" onChange={handleChange} required />
                <input type="text" name="end_bairro" placeholder="Bairro" onChange={handleChange} required />
                <input type="text" name="end_complemento" placeholder="Complemento" onChange={handleChange} />
                <input type="text" name="cidade" placeholder="Cidade" onChange={handleChange} required />
                <input type="text" name="estado" placeholder="Estado" onChange={handleChange} required />
                <input type="text" name="cep" placeholder="CEP" onChange={handleChange} required />
                <input type="text" name="telefone_1" placeholder="Telefone 1" onChange={handleChange} required />
                <input type="text" name="telefone_2" placeholder="Telefone 2" onChange={handleChange} />
                <input type="date" name="data_nasc" onChange={handleChange} required />
                <button type="submit">Cadastrar</button>
            </form>
            <Link to="/listar-pessoas">Listar pessoas cadastradas</Link>
        </div>
    );
};

export default Pessoa;
