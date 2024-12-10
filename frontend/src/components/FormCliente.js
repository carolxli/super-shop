import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputMask from 'react-input-mask';

const FormCliente = () => {
    const [cliente, setCliente] = useState({
        Pessoa_idPessoa: '',
        cpf: '',
        rg: '',
        voucher: ''
    });

    const [nomePessoa, setNomePessoa] = useState('');
    const [pessoas, setPessoas] = useState([]);
    const [autocompleteVisible, setAutocompleteVisible] = useState(false);

    useEffect(() => {
       
    }, []);

    const handleNomePessoaChange = async (e) => {
        const nome = e.target.value;
        setNomePessoa(nome);

        if (nome.length >= 2) {
            try {
                const response = await axios.get(`http://localhost:8800/Pessoa?nome=${nome}`);
                setPessoas(response.data);
                setAutocompleteVisible(true);
            } catch (error) {
                console.error("Erro ao buscar pessoas:", error);
            }
        } else {
            setAutocompleteVisible(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    

    const handlePessoaSelect = (pessoa) => {
        setNomePessoa(pessoa.nome);
        setCliente({
            ...cliente,
            Pessoa_idPessoa: pessoa.idPessoa
        });
        setAutocompleteVisible(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const clienteData = {
                ...cliente,
            };
            
            await axios.post(`http://localhost:8800/cliente`, clienteData);
            alert('Cliente cadastrado com sucesso!');
            setCliente({
                Pessoa_idPessoa: '',
                cpf: '',
                rg: '',
                voucher: ''
            });
            setNomePessoa('');
        } catch (err) {
            console.error(err);
            alert('Erro ao cadastrar cliente');
        }
    };
    
    

    return (
        <>
            <h3>Cadastrar Cliente</h3>
            <form onSubmit={handleSubmit}>
            <label>
                    Nome da Pessoa
                    <input
                        type="text"
                        name="nomePessoa"
                        value={nomePessoa}
                        onChange={handleNomePessoaChange}
                        required
                    />
                    {autocompleteVisible && (
                        <ul className="autocomplete-list">
                            {pessoas.map((pessoa) => (
                                <li
                                    key={pessoa.idPessoa}
                                    onClick={() => handlePessoaSelect(pessoa)}
                                >
                                    {pessoa.nome}
                                </li>
                            ))}
                        </ul>
                    )}
                </label>

                <label>
                    CPF
                    <InputMask
                        mask="999.999.999-99"
                        name="cpf"
                        value={cliente.cpf}
                        onChange={handleChange}
                        maskChar={null}
                        required
                        className="input-mask"
                    />
                </label>

                <label>
                    RG
                    <InputMask
                        mask="99.999.999-99"
                        name="rg"
                        value={cliente.rg}
                        onChange={handleChange}
                        maskChar={null}
                        required
                        className="input-mask"
                    />
                </label>
                
                <label>
                   Voucher (carteira)
                    <input
                        type="number"
                        name="voucher"
                        value={cliente.voucher}
                        onChange={handleChange}
                        min="0" 
                        required
                    />
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '50px', marginLeft: '330px' }}>
                    <button type="submit">Cadastrar</button>
                    <a href='/'>
                        <button type="button">Cancelar</button>
                    </a>
                </div>
            </form>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px', marginLeft: '256px' }}>
                <a href="/listar-clientes">
                    <button type="button">Listar Clientes</button>
                </a>
            </div>
        </>
    );
};

export default FormCliente;
