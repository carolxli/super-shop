import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Pessoa = () => {
    const navigate = useNavigate();
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8800/Pessoa', formData);
            alert('Pessoa cadastrada com sucesso!');
            // Limpa o formulário após o envio
            setFormData({
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
        } catch (error) {
            console.error('Erro ao cadastrar pessoa:', error);
            alert('Erro ao cadastrar pessoa');
        }
    };

    return (
        <div>
            <h1>Cadastrar Pessoa</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="end_rua" placeholder="Rua" value={formData.end_rua} onChange={handleChange} required />
                <input type="text" name="end_numero" placeholder="Número" value={formData.end_numero} onChange={handleChange} required />
                <input type="text" name="end_bairro" placeholder="Bairro" value={formData.end_bairro} onChange={handleChange} required />
                <input type="text" name="end_complemento" placeholder="Complemento" value={formData.end_complemento} onChange={handleChange} />
                <input type="text" name="cidade" placeholder="Cidade" value={formData.cidade} onChange={handleChange} required />
                <input type="text" name="estado" placeholder="Estado" value={formData.estado} onChange={handleChange} required />
                <input type="text" name="cep" placeholder="CEP" value={formData.cep} onChange={handleChange} required />
                <input type="text" name="telefone_1" placeholder="Telefone 1" value={formData.telefone_1} onChange={handleChange} required />
                <input type="text" name="telefone_2" placeholder="Telefone 2" value={formData.telefone_2} onChange={handleChange} />
                <input type="date" name="data_nasc" value={formData.data_nasc} onChange={handleChange} required />
                <button type="submit">Cadastrar</button>
            </form>
            <button onClick={() => navigate('/listar-pessoas')}>Listar pessoas cadastradas</button> {/* Botão para listar pessoas */}
        </div>
    );
};

export default Pessoa;
