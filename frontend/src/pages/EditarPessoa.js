import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputMask from 'react-input-mask';

const EditarPessoa = () => {
    const { idPessoa } = useParams();
    const [pessoa, setPessoa] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPessoa = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/Pessoa/${idPessoa}`);
                const pessoaData = response.data;
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

        if (e.target.name === 'cep') {
            const cleanedCep = e.target.value.replace(/\D/g, '');
            if (cleanedCep.length === 8) {
                fetchAddress(cleanedCep);
            } else {
                setPessoa((prevData) => ({
                    ...prevData,
                    end_rua: '',
                    end_bairro: '',
                    cidade: '',
                    estado: '',
                }));
            }
        }
    };

    const fetchAddress = async (cep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (response.data.erro) {
                alert("CEP não encontrado.");
                return;
            }

            const { logradouro: end_rua, bairro: end_bairro, localidade: cidade, uf: estado } = response.data;
            setPessoa((prevData) => ({
                ...prevData,
                end_rua,
                end_bairro,
                cidade,
                estado,
            }));
        } catch (error) {
            console.error("Erro ao buscar o CEP:", error);
            alert("Erro ao buscar o CEP.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const confirmEdit = window.confirm("Você tem certeza que deseja editar esta pessoa?");
        if (confirmEdit) {
            try {
                await axios.put(`http://localhost:8800/Pessoa/${idPessoa}`, pessoa);
                navigate('/listar-pessoas');
            } catch (error) {
                console.error("Erro ao editar pessoa:", error);
            }
        }
    };

    return (
        <>
            <h3>Editar Pessoa</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Nome
                    <input type="text" name="nome" value={pessoa.nome || ''} onChange={handleChange} required />
                </label>

                <label>
                    Email
                    <input type="email" name="email" value={pessoa.email || ''} onChange={handleChange} required />
                </label>

                <label>
                    Telefone 1
                    <InputMask
                        mask="(99) 99999-9999"
                        name="telefone_1"
                        value={pessoa.telefone_1 || ''}
                        onChange={handleChange}
                        required
                        className="input-mask"
                    />
                </label>

                <label>
                    Telefone 2
                    <InputMask
                        mask="(99) 99999-9999"
                        name="telefone_2"
                        value={pessoa.telefone_2 || ''}
                        onChange={handleChange}
                        className="input-mask"
                    />
                </label>

                <label>
                    Data de Nascimento
                    <input type="date" name="data_nasc" value={pessoa.data_nasc || ''} onChange={handleChange} required />
                </label>

                <label>
                    CEP
                    <InputMask
                        mask="99999-999"
                        name="cep"
                        value={pessoa.cep || ''}
                        onChange={handleChange}
                        required
                        className="input-mask"
                    />
                </label>

                <label>
                    Rua
                    <input type="text" name="end_rua" value={pessoa.end_rua || ''} onChange={handleChange} required readOnly />
                </label>

                <label>
                    Número
                    <input type="text" name="end_numero" value={pessoa.end_numero || ''} onChange={handleChange} required />
                </label>

                <label>
                    Bairro
                    <input type="text" name="end_bairro" value={pessoa.end_bairro || ''} onChange={handleChange} required readOnly />
                </label>

                <label>
                    Complemento
                    <input type="text" name="end_complemento" value={pessoa.end_complemento || ''} onChange={handleChange} />
                </label>

                <label>
                    Cidade
                    <input type="text" name="cidade" value={pessoa.cidade || ''} onChange={handleChange} required readOnly />
                </label>

                <label>
                    Estado
                    <input type="text" name="estado" value={pessoa.estado || ''} onChange={handleChange} required readOnly />
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '315px' }}>
                    <button type="submit">Editar</button>
                    <a href='/listar-pessoas'>
                        <button type="button">Cancelar</button>
                    </a>
                </div>
            </form>
        </>
    );
};

export default EditarPessoa;