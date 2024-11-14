import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { NumericFormat } from 'react-number-format';

const EditarFornecedor = () => {
    const { idFornecedor } = useParams();
    const navigate = useNavigate();
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
        const fetchFornecedor = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/Fornecedor/${idFornecedor}`);
                const fornecedorData = response.data;
                fornecedorData.dt_inicio_fornecimento = new Date(fornecedorData.dt_inicio_fornecimento).toString().split('T')[0];
                
                setNomePessoa(fornecedorData.pessoa_nome || '');
            } catch (err) {
                console.error(err);
                alert('Erro ao buscar fornecedor');
            }
        };

        // Buscar as marcas
        const fetchMarcas = async () => {
            try {
                const response = await axios.get('http://localhost:8800/marca');
                setMarcas(response.data);
            } catch (err) {
                console.error("Erro ao buscar marcas:", err);
            }
        };

        fetchFornecedor();
        fetchMarcas();
    }, [idFornecedor]);

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
                return { ...prevFornecedor, marcas: marcasSelecionadas };
            });
        } else {
            setFornecedor({ ...fornecedor, [name]: value });
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
            } catch (err) {
                console.error("Erro ao buscar pessoas:", err);
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
        const confirmUpdate = window.confirm("Você tem certeza que deseja atualizar este fornecedor?");
        if (!confirmUpdate) return;
        
        try {
            await axios.put(`http://localhost:8800/fornecedor/${idFornecedor}`, fornecedor);
            alert('Fornecedor atualizado com sucesso!');
            navigate('/listar-fornecedores');
        } catch (err) {
            console.error("Erro ao atualizar fornecedor:", err);
            alert('Erro ao atualizar fornecedor');
        }
    };

    return (
        <>
            <h3>Editar Fornecedor</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    CNPJ
                    <InputMask
                        mask="99.999.999/9999-99"
                        name="cnpj"
                        value={fornecedor.cnpj}
                        onChange={(e) => setFornecedor({ ...fornecedor, cnpj: e.target.value })}
                        required
                        maskChar={null}
                    />
                </label>

                <label>
                    Razão Social
                    <input
                        type="text"
                        name="razao_social"
                        value={fornecedor.razao_social}
                        readOnly
                    />
                </label>

                <label>
                    Valor Mínimo de Pedido
                    <NumericFormat
                        thousandSeparator
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale
                        name="qtd_min_pedido"
                        value={fornecedor.qtd_min_pedido}
                        onValueChange={(values) => {
                            setFornecedor({ ...fornecedor, qtd_min_pedido: values.value });
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
                        value={nomePessoa}
                        onChange={handleNomePessoaChange}
                        required
                    />
                    {autocompleteVisible && (
                        <ul className="autocomplete-list">
                            {pessoas.map((pessoa) => (
                                <li key={pessoa.idPessoa} onClick={() => handlePessoaSelect(pessoa)}>
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
                    <button type="submit">Atualizar</button>
                    <a href='/'>
                        <button type="button">Cancelar</button>
                    </a>
                </div>
            </form>
        </>
    );
};

export default EditarFornecedor;
