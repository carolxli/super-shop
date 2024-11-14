import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { NumericFormat } from 'react-number-format';

const FormProduto = () => {
    const [produto, setProduto] = useState({
        sku: '',
        descricao: '',
        valor_custo: '',
        valor_venda: '',
        estoque_min: '',
        estoque_atual: '',
        status: '',
        Fornecedor_idFornecedor: '',
        Marca_idMarca: '',
        Categoria_idCategoria: ''
    });

    const [fornecedores, setFornecedores] = useState([]);
    const [fornecedorNome, setFornecedorNome] = useState(''); // Nome do fornecedor para a busca
    const [autocompleteVisible, setAutocompleteVisible] = useState(false); // Controla a visibilidade do autocomplete
    const [marcas, setMarcas] = useState([]); // Estado para armazenar marcas
    const [categorias, setCategorias] = useState([]); // Estado para armazenar categorias

    // Carregar marcas e categorias ao montar o componente
    // useEffect(() => {
    //     // Carregar marcas
    //     axios.get('http://localhost:8800/marcas') // Ajuste a URL conforme necessário
    //         .then(response => setMarcas(response.data))
    //         .catch(error => console.error("Erro ao carregar marcas:", error));

    //     // Carregar categorias
    //     axios.get('http://localhost:8800/categorias') // Ajuste a URL conforme necessário
    //         .then(response => setCategorias(response.data))
    //         .catch(error => console.error("Erro ao carregar categorias:", error));
    // }, []);

    // Função para tratar mudanças no campo do fornecedor (busca com autocomplete)
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
        setFornecedorNome(fornecedor.razao_social); // Define o nome do fornecedor selecionado no campo
        setProduto({
            ...produto,
            Fornecedor_idFornecedor: fornecedor.idProduto, // Armazena o ID do fornecedor
        });
        setAutocompleteVisible(false); // Fecha o autocomplete
    };

    const handleChange = (e) => {
        const { razao_social, value } = e.target;
        setProduto({ ...produto, [razao_social]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8800/Produto', produto);
            alert(response.data);
            setProduto({
                sku: '',
                descricao: '',
                valor_custo: '',
                valor_venda: '',
                estoque_min: '',
                estoque_atual: '',
                status: '',
                Fornecedor_idFornecedor: '',
                Marca_idMarca: '',
                Categoria_idCategoria: ''
            });
        } catch (error) {
            console.error("Erro ao cadastrar produto:", error);
            alert("Erro ao cadastrar produto");
        }
    };

    return (
        <>
            <h3>Cadastrar Produto</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    SKU:
                    <input type="text" name="sku" value={produto.sku} onChange={handleChange} required />
                </label>

                <label style={{ display: 'block' }}>
                    Descrição:
                    <input 
                        type="text" 
                        name="descricao" 
                        value={produto.descricao} 
                        onChange={handleChange} 
                        required 
                        style={{ width: '100%', whiteSpace: 'nowrap' }} 
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
                    />
                </label>

                <label>
                    Status:
                    <select name="status" value={produto.status} onChange={handleChange} required>
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
                        value={fornecedorNome}
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
                    <select name="Marca_idMarca" value={produto.Marca_idMarca} onChange={handleChange} required>
                        <option value="">Selecione a Marca</option>
                        {marcas.map(marca => (
                            <option key={marca.idMarca} value={marca.idMarca}>
                                {marca.nome}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Categoria:
                    <select name="Categoria_idCategoria" value={produto.Categoria_idCategoria} onChange={handleChange} required>
                        <option value="">Selecione a Categoria</option>
                        {categorias.map(categoria => (
                            <option key={categoria.idCategoria} value={categoria.idCategoria}>
                                {categoria.nome}
                            </option>
                        ))}
                    </select>
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '315px' }}>
                    <button type="submit">Cadastrar</button>
                    <a href='/'><button type="button">Cancelar</button></a>
                </div>
            </form>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px', marginLeft: '256px' }}>
                <a href="/listar-produtos">
                    <button>Listar Produtos Cadastrados</button>
                </a>
            </div>
        </>
    );
};

export default FormProduto;