import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputMask from 'react-input-mask';

const FormUsuario = () => {
    const [usuario, setUsuario] = useState({
        Pessoa_idPessoa: '',
        senha: '',
        cargo: '',
        cpf: '',
        rg: '',
        login: '',
        dt_contratacao: '',
        Comissao_idComissao: ''
    });

    const [nomePessoa, setNomePessoa] = useState('');
    const [pessoas, setPessoas] = useState([]);
    const [autocompleteVisible, setAutocompleteVisible] = useState(false);
    const [comissoes, setComissoes] = useState([]);

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
    useEffect(() => {
        const fetchComissoes = async () => {
            try {
                const response = await axios.get('http://localhost:8800/comissao');
                setComissoes(response.data);
            } catch (error) {
                console.error("Erro ao buscar comissões:", error);
            }
        };

        fetchComissoes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handlePessoaSelect = (pessoa) => {
        setNomePessoa(pessoa.nome);
        setUsuario({
            ...usuario,
            Pessoa_idPessoa: pessoa.idPessoa
        });
        setAutocompleteVisible(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataContratacao = new Date(usuario.dt_contratacao);
        const dataMinima = new Date('2024-01-01');
        const hoje = new Date();
        const dataMaxima = new Date();
        dataMaxima.setDate(hoje.getDate() + 7);

        // Zerando horas para comparar só a data
        dataContratacao.setHours(0, 0, 0, 0);
        dataMinima.setHours(0, 0, 0, 0);
        dataMaxima.setHours(0, 0, 0, 0);

        if (dataContratacao < dataMinima || dataContratacao > dataMaxima) {
            alert('Insira uma data de contratação válida.');
            return; // interrompe o envio
        }

        try {
            const usuarioData = { ...usuario };

            await axios.post(`http://localhost:8800/usuario`, usuarioData);
            alert('Usuário cadastrado com sucesso!');
            setUsuario({
                Pessoa_idPessoa: '',
                senha: '',
                cargo: '',
                cpf: '',
                rg: '',
                login: '',
                dt_contratacao: '',
                Comissao_idComissao: ''
            });
            setNomePessoa('');
        } catch (err) {
            console.error(err);
            alert('Erro ao cadastrar usuário');
        }
    };


    return (
        <>
            <h3>Cadastrar Usuário</h3>
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
                    Login
                    <input
                        type="text"
                        name="login"
                        value={usuario.login}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Senha
                    <input
                        type='password'
                        name="senha"
                        value={usuario.senha}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Cargo
                    <select
                        name="cargo"
                        value={usuario.cargo}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione o cargo</option>
                        <option value="vendedor">Vendedor</option>
                        <option value="gerente">Gerente</option>
                        <option value="admin">Administrador</option>
                    </select>
                </label>

                <label>
                    CPF
                    <InputMask
                        mask="999.999.999-99"
                        name="cpf"
                        value={usuario.cpf}
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
                        value={usuario.rg}
                        onChange={handleChange}
                        maskChar={null}
                        required
                        className="input-mask"
                    />
                </label>

                <label>
                    Data de Contratação
                    <input type="date" name="dt_contratacao" value={usuario.dt_contratacao} onChange={handleChange} required />
                </label>

                <label>
                    Comissão:
                    <select
                        name="Comissao_idComissao"
                        value={usuario.Comissao_idComissao}
                        onChange={handleChange}>
                        <option value="">Selecione uma comissão</option>
                        {comissoes.map((comissao) => (
                            <option key={comissao.idComissao} value={comissao.idComissao}>
                                {comissao.valor}
                            </option>
                        ))}
                    </select>
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '35px', marginLeft: '300px' }}>
                    <a href="/listar-usuarios" style={{ display: 'inline-block' }}>
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

export default FormUsuario;
