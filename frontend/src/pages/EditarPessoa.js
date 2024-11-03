// src/pages/EditarPessoa.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditarPessoa = () => {
    const { idPessoa } = useParams();
    const [pessoa, setPessoa] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPessoa = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/Pessoa/${idPessoa}`);
                const pessoaData = response.data;
                // Converte a data para o formato YYYY-MM-DD para o input date
                pessoaData.data_nasc = new Date(pessoaData.data_nasc).toISOString().split('T')[0];
                setPessoa(pessoaData);
            } catch (error) {
                console.error("Erro ao buscar pessoa:", error);
            }
        };
        fetchPessoa();
    }, [idPessoa]);

    const handleChange = (e) => {
        setPessoa({ ...pessoa, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const confirmEdit = window.confirm("Você tem certeza que deseja editar esta pessoa?");
        if (confirmEdit) {
            try {
                await axios.put(`http://localhost:8800/Pessoa/${idPessoa}`, pessoa);
                navigate('/listar-pessoas'); // Redireciona para a página de pessoas após a edição
            } catch (error) {
                console.error("Erro ao editar pessoa:", error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="nome" value={pessoa.nome || ''} onChange={handleChange} placeholder="Nome" required />
            <input type="email" name="email" value={pessoa.email || ''} onChange={handleChange} placeholder="Email" required />
            <input type="text" name="end_rua" value={pessoa.end_rua || ''} onChange={handleChange} placeholder="Rua" required />
            <input type="number" name="end_numero" value={pessoa.end_numero || ''} onChange={handleChange} placeholder="Número" required />
            <input type="text" name="end_bairro" value={pessoa.end_bairro || ''} onChange={handleChange} placeholder="Bairro" required />
            <input type="text" name="end_complemento" value={pessoa.end_complemento || ''} onChange={handleChange} placeholder="Complemento" />
            <input type="text" name="cidade" value={pessoa.cidade || ''} onChange={handleChange} placeholder="Cidade" required />
            <input type="text" name="estado" value={pessoa.estado || ''} onChange={handleChange} placeholder="Estado" required />
            <input type="text" name="cep" value={pessoa.cep || ''} onChange={handleChange} placeholder="CEP" required />
            <input type="text" name="telefone_1" value={pessoa.telefone_1 || ''} onChange={handleChange} placeholder="Telefone 1" required />
            <input type="text" name="telefone_2" value={pessoa.telefone_2 || ''} onChange={handleChange} placeholder="Telefone 2" />
            <input type="date" name="data_nasc" value={pessoa.data_nasc || ''} onChange={handleChange} placeholder="Data de Nascimento" required />
            <button type="submit">Confirmar Edição</button>
        </form>
    );
};

export default EditarPessoa;
