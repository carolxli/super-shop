import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import InputMask from 'react-input-mask';

const EditarUsuario = () => {
    const { idUsuario } = useParams();
    const navigate = useNavigate();
    const [comissoes, setComissoes] = useState([]);
    const [usuario, setUsuario] = useState({
        Pessoa_idPessoa: null,
        senha: '',
        cargo: '',
        cpf: '',
        rg: '',
        login: '',
        dt_contratacao: '',
        Comissao_idComissao: null
    });
    const [nomePessoa, setNomePessoa] = useState('');
    const [pessoas, setPessoas] = useState([]);
    const [autocompleteVisible, setAutocompleteVisible] = useState(false);

    useEffect(() => {
        const fetchUsuarioData = async () => {
            try {
                const usuarioResponse = await axios.get(`http://localhost:8800/usuario/id/${idUsuario}`);
                const usuarioData = usuarioResponse.data;
    
                if (usuarioData) {
                    // Formata a data para o formato YYYY-MM-DD
                    const formattedDate = usuarioData.dt_contratacao
                        ? new Date(usuarioData.dt_contratacao).toISOString().split('T')[0]
                        : '';
    
                    setUsuario({
                        ...usuarioData,
                        dt_contratacao: formattedDate,
                    });
    
                    setNomePessoa(usuarioData.nome_pessoa || ''); // Preenche o nome da pessoa
                }
            } catch (err) {
                console.error("Erro ao carregar dados do usuario:", err);
                alert('Erro ao carregar dados do usuario');
            }
        };
    
        fetchUsuarioData();
    }, [idUsuario]);
    

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
        setUsuario((prevState) => ({
            ...prevState,
            Pessoa_idPessoa: pessoa.idPessoa
        }));
        setAutocompleteVisible(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!usuario.Pessoa_idPessoa) {
            alert('O campo Pessoa é obrigatório.');
            return;
        }

        try {
            await axios.put(`http://localhost:8800/usuario/${idUsuario}`, usuario);
            alert('Usuario atualizado com sucesso!');
            navigate('/listar-usuarios');
        } catch (err) {
            console.error("Erro ao atualizar usuario:", err);
            alert('Erro ao atualizar usuario');
        }
    };

    return (
        <>
            <h3>Editar Usuário</h3>
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

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '50px', marginLeft: '330px' }}>
                    <button type="submit">Atualizar</button>
                    <a href="/listar-usuarios">
                        <button type="button">Cancelar</button>
                    </a>
                </div>
            </form>
        </>
    );
};

export default EditarUsuario;
