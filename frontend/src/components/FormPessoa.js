import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';

const FormPessoa = () => {
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

    const navigate = useNavigate();

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
                navigate('/listar-pessoas');
            } else {
                alert('Erro ao cadastrar pessoa');
            }
        } catch (error) {
            console.error('Erro ao cadastrar pessoa:', error);
        }
    };

    return (
        <>
            <h3>Cadastrar Pessoa</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Nome
                    <input type="text" name="nome" onChange={handleChange} required />
                </label>

                <label>
                    Email
                    <input type="email" name="email" onChange={handleChange} required />
                </label>

                <label>
                    Rua
                    <input type="text" name="end_rua" onChange={handleChange} required />
                </label>

                <label>
                    Número
                    <input type="text" name="end_numero" onChange={handleChange} required />
                </label>

                <label>
                    Bairro
                    <input type="text" name="end_bairro" onChange={handleChange} required />
                </label>

                <label>
                    Complemento
                    <input type="text" name="end_complemento" onChange={handleChange} />
                </label>

                <label>
                    Cidade
                    <input type="text" name="cidade" onChange={handleChange} required />
                </label>

                <label>
                    Estado
                    <input type="text" name="estado" onChange={handleChange} required />
                </label>

                <label>
                    CEP
                    <input type="text" name="cep" onChange={handleChange} required />
                </label>

                <label>
                    Telefone 1
                    <input type="text" name="telefone_1" onChange={handleChange} required />
                </label>

                <label>
                    Telefone 2
                    <input type="text" name="telefone_2" onChange={handleChange} />
                </label>

                <label>
                    Data de Nascimento
                    <input type="date" name="data_nasc" onChange={handleChange} required />
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '315px' }}>
                    <button type="submit">Cadastrar</button>
                    <a href='/'>
                        <button type="button">Cancelar</button>
                    </a>
                </div>
            </form>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px', marginLeft: '256px' }}>
                <a href="/listar-pessoas">
                    <button>Listar Pessoas Cadastradas</button>
                </a>
            </div>
        </>
    );
};

export default FormPessoa;
