import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputMask from 'react-input-mask';
import { NumericFormat } from 'react-number-format';

const FormFornecedor = () => {
    const [fornecedor, setFornecedor] = useState({
        cnpj: '',
        razao_social: '',
        qtd_min_pedido: '',
        prazo_entrega: '',
        dt_inicio_fornecimento: '',
        observacao: '',
        Pessoa_idPessoa: '',
        marcas: [] 
    });

    const [nomePessoa, setNomePessoa] = useState('');
    const [pessoas, setPessoas] = useState([]);
    const [autocompleteVisible, setAutocompleteVisible] = useState(false);

    const [marcas, setMarcas] = useState([]);

    useEffect(() => {
        const fetchMarcas = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/marca`);
                console.log(response.data);
                setMarcas(response.data);
            } catch (error) {
                console.error("Erro ao buscar marcas:", error);
            }
        };

        fetchMarcas();
    }, []);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
    
        if (name === 'marcaSelecionada') {
            setFornecedor((prevFornecedor) => {
                const marcasSelecionadas = [...prevFornecedor.marcas];
                const marcaId = Number(value); 
                if (checked) {
                    marcasSelecionadas.push(marcaId);
                } else {
                    const index = marcasSelecionadas.indexOf(marcaId);
                    if (index > -1) {
                        marcasSelecionadas.splice(index, 1);
                    }
                }
    
                console.log("Marcas selecionadas:", marcasSelecionadas);  
                return { ...prevFornecedor, marcas: marcasSelecionadas };
            });
        } else {
            setFornecedor({
                ...fornecedor,
                [name]: value,
            });
        }
    };
    


    const fetchRazaoSocial = async (cnpj) => {
        if (cnpj.length === 14) {
            try {
                const response = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
                if (response.data && response.data.razao_social) {
                    setFornecedor((prevFornecedor) => ({
                        ...prevFornecedor,
                        razao_social: response.data.razao_social,
                    }));
                } else {
                    alert('Razão Social não encontrada');
                }
            } catch (error) {
                console.error("Erro ao buscar razão social:", error);
                alert('Erro ao buscar razão social');
            }
        }
    };

    const handleCnpjChange = (e) => {
        const cnpj = e.target.value.replace(/[^\d]/g, '');
        setFornecedor((prevFornecedor) => ({
            ...prevFornecedor,
            cnpj,
            razao_social: ''
        }));
        if (cnpj.length === 14) {
            fetchRazaoSocial(cnpj);
        }
    };

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

    const handlePessoaSelect = (pessoa) => {
        setNomePessoa(pessoa.nome);
        setFornecedor({
            ...fornecedor,
            Pessoa_idPessoa: pessoa.idPessoa
        });
        setAutocompleteVisible(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fornecedorData = {
                ...fornecedor,
                marcas_fornecedor: fornecedor.marcas
            };
            
            await axios.post(`http://localhost:8800/fornecedor`, fornecedorData);
            alert('Fornecedor cadastrado com sucesso!');
            setFornecedor({
                cnpj: '',
                razao_social: '',
                qtd_min_pedido: '',
                prazo_entrega: '',
                dt_inicio_fornecimento: '',
                observacao: '',
                Pessoa_idPessoa: '',
                marcas: []  
            });
            setNomePessoa('');
        } catch (err) {
            console.error(err);
            alert('Erro ao cadastrar fornecedor');
        }
    };
    
    

    return (
        <>
            <h3>Cadastrar Fornecedor</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    CNPJ
                    <InputMask
                        mask="99.999.999/9999-99"
                        name="cnpj"
                        value={fornecedor.cnpj}
                        onChange={handleCnpjChange}
                        maskChar={null}
                        required
                        className="input-mask"
                    />
                </label>

                <label>
                    Razão Social
                    <input
                        type="text"
                        name="razao_social"
                        value={fornecedor.razao_social}
                        onChange={handleChange}
                        required
                        readOnly
                    />
                </label>

                <label>
                    Valor Mínimo de Pedido
                    <NumericFormat
                        thousandSeparator={true}
                        prefix={'R$ '}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        name="qtd_min_pedido"
                        value={fornecedor.qtd_min_pedido}
                        onValueChange={(values) => {
                            const { value } = values;
                            setFornecedor({ ...fornecedor, qtd_min_pedido: value });
                        }}
                        required
                    />
                </label>

                <label>
                    Prazo de Entrega (dias)
                    <input
                        type="number"
                        name="prazo_entrega"
                        value={fornecedor.prazo_entrega}
                        onChange={handleChange}
                        min="0" 
                        required
                    />
                </label>

                <label>
                    Data de Início
                    <input
                        type="date"
                        name="dt_inicio_fornecimento"
                        value={fornecedor.dt_inicio_fornecimento}
                        onChange={handleChange}
                        required
                    />
                </label>

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
                    Marcas Trabalhadas
                    <table>
                        <thead>
                            <tr>
                                <th>Selecionar</th>
                                <th>Marca</th>
                            </tr>
                        </thead>
                        <tbody>
                            {marcas.map((marca) => (
                                <tr key={marca.idMarca}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="marcaSelecionada"
                                            value={marca.idMarca}
                                            checked={fornecedor.marcas.includes(marca.idMarca)}
                                            onChange={handleChange}
                                        />

                                    </td>
                                    <td>{marca.nome}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </label>

                <label>
                    Observação
                    <textarea name="observacao" value={fornecedor.observacao} onChange={handleChange} />
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '50px', marginLeft: '330px' }}>
                    <button type="submit">Cadastrar</button>
                    <a href='/'>
                        <button type="button">Cancelar</button>
                    </a>
                </div>
            </form>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px', marginLeft: '256px' }}>
                <a href="/listar-fornecedores">
                    <button type="button">Listar Fornecedores</button>
                </a>
            </div>
        </>
    );
};

export default FormFornecedor;
