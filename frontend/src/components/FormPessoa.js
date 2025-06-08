import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputMask from 'react-input-mask';

const FormPessoa = () => {
    const [isRuaEditable, setIsRuaEditable] = useState(false);
    const [isBairroEditable, setIsBairroEditable] = useState(false);

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

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === 'cep') {
            const cleanedCep = value.replace(/\D/g, '');
            if (cleanedCep.length === 8) {
                fetchAddress(cleanedCep);
            } else {

                setFormData((prevData) => ({
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

            const {
                logradouro: end_rua,
                bairro: end_bairro,
                localidade: cidade,
                uf: estado,
            } = response.data;

            // Verifica se veio rua ou bairro; se não veio, libera a edição
            setIsRuaEditable(!end_rua);
            setIsBairroEditable(!end_bairro);

            setFormData((prevData) => ({
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
        try {
            const response = await fetch('http://localhost:8800/Pessoa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const responseBody = await response.json();

            if (response.ok) {
                alert('Pessoa cadastrada com sucesso!');
                navigate('/listar-pessoas');
            } else {
                alert(responseBody); // Mostra a mensagem de erro enviada pelo backend (ex: idade inválida)
            }
        } catch (error) {
            console.error('Erro ao cadastrar pessoa:', error);
            alert('Erro ao cadastrar pessoa. Tente novamente mais tarde.');
        }
    };


    return (
        <>
            <h3>Cadastrar Pessoa</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Nome
                    <input
                        type="text"
                        name="nome"
                        onChange={handleChange}
                        onKeyDown={(e) => {
                            if (/\d/.test(e.key)) {
                                e.preventDefault(); // Bloqueia teclas numéricas
                            }
                        }}
                        required
                    />
                </label>


                <label>
                    Email
                    <input type="email" name="email" onChange={handleChange} required />
                </label>

                <label>
                    Telefone 1
                    <InputMask
                        mask="(99) 99999-9999"
                        name="telefone_1"
                        value={formData.telefone_1}
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
                        value={formData.telefone_2}
                        onChange={handleChange}
                        className="input-mask"
                    />
                </label>

                <label>
                    Data de Nascimento
                    <input type="date" name="data_nasc" onChange={handleChange} required />
                </label>

                <label>
                    CEP
                    <InputMask
                        mask="99999-999"
                        name="cep"
                        value={formData.cep}
                        onChange={handleChange}
                        required
                        className="input-mask"
                    />
                </label>

                <label>
                    Rua
                    <input
                        type="text"
                        name="end_rua"
                        value={formData.end_rua}
                        onChange={handleChange}
                        required
                        readOnly={!isRuaEditable}
                    />
                </label>
                <label>
                    Número
                    <input type="text" name="end_numero" onChange={handleChange} required />
                </label>

                <label>
                    Bairro
                    <input
                        type="text"
                        name="end_bairro"
                        value={formData.end_bairro}
                        onChange={handleChange}
                        required
                        readOnly={!isBairroEditable}
                    />
                </label>


                <label>
                    Complemento
                    <input type="text" name="end_complemento" onChange={handleChange} />
                </label>

                <label>
                    Cidade
                    <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} required readOnly />
                </label>

                <label>
                    Estado
                    <input type="text" name="estado" value={formData.estado} onChange={handleChange} required readOnly />
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '35px', marginLeft: '300px' }}>
                    <a href="/listar-pessoas" style={{ display: 'inline-block' }}>
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

export default FormPessoa;