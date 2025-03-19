import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { NumericFormat } from "react-number-format";

const EditarProduto = () => {
    const { idProduto } = useParams();
    const [produto, setProduto] = useState({
        sku: '',
        descricao: '',
        valor_custo: '',
        valor_venda: '',
        estoque_min: '',
        estoque_atual: '',
        status: '',
        Fornecedor_idFornecedor: '',
        Fornecedor_Pessoa_idPessoa: '',
        Marca_idMarca: '',
        Categoria_idCategoria: ''
    });
    const [fornecedores, setFornecedores] = useState([]);
    const [fornecedorNome, setFornecedorNome] = useState('');
    const [autocompleteVisible, setAutocompleteVisible] = useState(false);
    const [marcas, setMarcas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Função para buscar o produto
    useEffect(() => {
        const fetchProduto = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/Produto/${idProduto}`);
                setProduto(response.data);

                if (response.data.Fornecedor_idFornecedor) {
                    const fornecedorResponse = await axios.get(
                        `http://localhost:8800/Fornecedor/id/${response.data.Fornecedor_idFornecedor}`
                    );
                    setFornecedorNome(fornecedorResponse.data.razao_social);
                }

                setLoading(false);
            } catch (error) {
                console.error("Erro ao buscar produto:", error);
                setLoading(false);
            }
        };

        fetchProduto();
    }, [idProduto]);  // Agora o useEffect depende apenas de idProduto

    // Função para buscar marcas
    useEffect(() => {
        if (!produto.Fornecedor_idFornecedor) return;
        const fetchMarcas = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/marca/${produto.Fornecedor_idFornecedor}`);
                setMarcas(response.data);
            } catch (error) {
                console.error("Erro ao buscar marcas:", error);
            }
        };

        fetchMarcas();
    }, [produto.Fornecedor_idFornecedor]); 

   
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get('http://localhost:8800/categoria');
                setCategorias(response.data);
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            }
        };

        fetchCategorias();
    }, []);

    
    useEffect(() => {
        const fetchFornecedores = async () => {
            try {
                const response = await axios.get('http://localhost:8800/Fornecedor');
                setFornecedores(response.data);
            } catch (error) {
                console.error("Erro ao buscar fornecedores:", error);
            }
        };

        fetchFornecedores();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduto({
            ...produto,
            [name]: value,
        });
    };

    const handleFornecedorChange = async (e) => {
        const razao_social = e.target.value;
        setFornecedorNome(razao_social);

        if (razao_social.length >= 2) {
            try {
                const response = await axios.get(`http://localhost:8800/Fornecedor/${razao_social}`);
                setFornecedores(response.data);
                setAutocompleteVisible(true);
            } catch (error) {
                console.error("Erro ao buscar fornecedores:", error);
            }
        } else {
            setAutocompleteVisible(false);
        }
    };

    const handleFornecedorSelect = (fornecedor) => {
        setFornecedorNome(fornecedor.razao_social);
        setProduto({
            ...produto, 
            Fornecedor_idFornecedor: fornecedor.idFornecedor,
            Fornecedor_Pessoa_idPessoa: fornecedor.Pessoa_idPessoa,
        });
        setAutocompleteVisible(false); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const confirmUpdate = window.confirm("Você tem certeza que deseja atualizar este produto?");
        if (!confirmUpdate) return;

        try {
            await axios.put(`http://localhost:8800/Produto/${idProduto}`, produto);
            alert('Produto atualizado com sucesso!');
            navigate('/listar-produtos');
        } catch (err) {
            console.error("Erro ao atualizar produto:", err);
            alert('Erro ao atualizar produto');
        }
    };

    if (loading) return <div>Carregando...</div>;

    return (
        <>
            <h3>Editar Produto</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    SKU:
                    <input type="text" name="sku" value={produto.sku} onChange={handleChange} required />
                </label>

                <label>
                    Descrição:
                    <input
                        type="text"
                        name="descricao"
                        value={produto.descricao}
                        onChange={handleChange}
                        required
                        style={{ width: '100%' }}
                    />
                </label>

                <label>
                    Valor Custo:
                    <NumericFormat
                        name="valor_custo"
                        value={produto.valor_custo}
                        onValueChange={(values) => setProduto({ ...produto, valor_custo: values.value })}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        allowNegative={false}
                        required
                    />
                </label>

                <label>
                    Valor Venda:
                    <NumericFormat
                        name="valor_venda"
                        value={produto.valor_venda}
                        onValueChange={(values) => setProduto({ ...produto, valor_venda: values.value })}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        allowNegative={false}
                        required
                    />
                </label>

                <label>
                    Estoque Mínimo:
                    <input
                        type="number"
                        name="estoque_min"
                        value={produto.estoque_min}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                </label>

                <label>
                    Estoque Atual:
                    <input
                        type="number"
                        name="estoque_atual"
                        value={produto.estoque_atual}
                        onChange={handleChange}
                        required
                        min="0"
                        disabled style={{ cursor: "not-allowed" }}
                    />
                </label>

                <label>
                    Status:
                    <select name="status" value={produto.status} onChange={handleChange} className="select-campo" required >
                        <option value="">Selecione</option>
                        <option value="disponivel">Disponível</option>
                        <option value="indisponivel">Indisponível</option>
                    </select>
                </label>

                <label>
                    Fornecedor:
                    <input
                        type="text"
                        name="fornecedorNome"
                        value={fornecedorNome || ''}
                        onChange={handleFornecedorChange}
                        required
                    />
                    {autocompleteVisible && (
                        <ul className="autocomplete-list">
                            {fornecedores.map((fornecedor) => (
                                <li
                                    key={fornecedor.idFornecedor}
                                    onClick={() => handleFornecedorSelect(fornecedor)}
                                >
                                    {fornecedor.razao_social}
                                </li>
                            ))}
                        </ul>
                    )}
                </label>

                <label>
                    Marca:
                    <select
                        name="Marca_idMarca"
                        value={produto.Marca_idMarca}
                        onChange={handleChange}
                        required className="select-campo"
                    >
                        <option value="">Selecione uma marca</option>
                        {marcas.map((marca) => (
                            <option key={marca.idMarca} value={marca.idMarca}>
                                {marca.nome}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Categoria:
                    <select
                        name="Categoria_idCategoria"
                        value={produto.Categoria_idCategoria}
                        onChange={handleChange}
                        required className="select-campo"
                    >
                        <option value="">Selecione uma categoria</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.idCategoria} value={categoria.idCategoria}>
                                {categoria.nome}
                            </option>
                        ))}
                    </select>
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '315px' }}>
                    <button type="submit">Editar</button>
                    <a href='/listar-produtos'>
                        <button type="button">Cancelar</button>
                    </a>
                </div>
            </form>
        </>
    );
};

export default EditarProduto;
