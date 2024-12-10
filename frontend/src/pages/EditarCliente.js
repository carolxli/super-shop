import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import InputMask from 'react-input-mask';

const EditarCliente = () => {
    const { idCliente } = useParams();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState({
        Pessoa_idPessoa: null,
        cpf: '',
        rg: '',
        voucher: 0
    });

    const [nomePessoa, setNomePessoa] = useState('');
    const [pessoas, setPessoas] = useState([]);
    const [autocompleteVisible, setAutocompleteVisible] = useState(false);

    useEffect(() => {
        const fetchClienteData = async () => {
            try {
                const clienteResponse = await axios.get(`http://localhost:8800/cliente/id/${idCliente}`);
                const clienteData = clienteResponse.data;

                if (clienteData) {
                    setCliente(clienteData);
                    setNomePessoa(clienteData.nome_pessoa || ''); // Preenche o nome da pessoa
                }
            } catch (err) {
                console.error("Erro ao carregar dados do cliente:", err);
                alert('Erro ao carregar dados do cliente');
            }
        };

        fetchClienteData();
    }, [idCliente]);

    const handleNomePessoaChange = async (e) => {
        const nome = e.target.value;
        setNomePessoa(nome);

        if (nome.length >= 2) {
            try {
                const response = await axios.get(`http://localhost:8800/Pessoa?nome=${nome}`);
                setPessoas(response.data);
                setAutocompleteVisible(true);
            } catch (err) {
                console.error("Erro ao buscar pessoas:", err);
            }
        } else {
            setAutocompleteVisible(false);
        }
    };

    const handlePessoaSelect = (pessoa) => {
        setNomePessoa(pessoa.nome);
        setCliente((prevState) => ({
            ...prevState,
            Pessoa_idPessoa: pessoa.idPessoa
        }));
        setAutocompleteVisible(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cliente.Pessoa_idPessoa) {
            alert('O campo Pessoa é obrigatório.');
            return;
        }

        try {
            await axios.put(`http://localhost:8800/cliente/${idCliente}`, cliente);
            alert('Cliente atualizado com sucesso!');
            navigate('/listar-clientes');
        } catch (err) {
            console.error("Erro ao atualizar cliente:", err);
            alert('Erro ao atualizar cliente');
        }
    };

    return (
        <>
            <h3>Editar Cliente</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Nome da Pessoa
                    <input
                        type="text"
                        name="nomePessoa"
                        value={nomePessoa}
                        onChange={handleNomePessoaChange}
                        disabled
                        required
                    />
                    {autocompleteVisible && pessoas.length > 0 && (
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
                        disabled
                        required
                    />
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '50px', marginLeft: '330px' }}>
                    <button type="submit">Atualizar</button>
                    <a href="/">
                        <button type="button">Cancelar</button>
                    </a>
                </div>
            </form>
        </>
    );
};

export default EditarCliente;
