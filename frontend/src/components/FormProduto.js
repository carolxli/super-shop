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
    const [marcas, setMarcas] = useState([]);
    const [categorias, setCategorias] = useState([]);

    // Busca fornecedores e categorias ao carregar o formulário
    useEffect(() => {
        const fetchFornecedores = async () => {
            try {
                const response = await axios.get('http://localhost:8800/Produto/fornecedores');
                setFornecedores(response.data);
            } catch (error) {
                console.error("Erro ao buscar fornecedores:", error);
            }
        };

        const fetchCategorias = async () => {
            try {
                const response = await axios.get('http://localhost:8800/Produto/categorias');
                setCategorias(response.data);
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            }
        };

        fetchFornecedores();
        fetchCategorias();
    }, []);

    // Busca marcas com base no fornecedor selecionado
    const fetchMarcas = async (idFornecedor) => {
        try {
            const response = await axios.get(`http://localhost:8800/Produto/marcas/${idFornecedor}`);
            setMarcas(response.data);
        } catch (error) {
            console.error("Erro ao buscar marcas:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "Fornecedor_idFornecedor") {
            setProduto({ ...produto, Fornecedor_idFornecedor: value });
            fetchMarcas(value);  // Atualiza as marcas ao selecionar um fornecedor
        } else {
            setProduto({ ...produto, [name]: value });
        }
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
                    <input type="text" name="descricao" value={produto.descricao} onChange={handleChange} required style={{ width: '100%' }} />
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
                    <input type="number" name="estoque_min" value={produto.estoque_min} onChange={handleChange} required />
                </label>

                <label>
                    Estoque Atual:
                    <input type="number" name="estoque_atual" value={produto.estoque_atual} onChange={handleChange} required />
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
                    <select name="Fornecedor_idFornecedor" value={produto.Fornecedor_idFornecedor} onChange={handleChange} required>
                        <option value="">Selecione o Fornecedor</option>
                        {fornecedores.map(fornecedor => (
                            <option key={fornecedor.idFornecedor} value={fornecedor.idFornecedor}>
                                {fornecedor.razao_social}
                            </option>
                        ))}
                    </select>
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
                    <a href='/'>
                        <button type="button">Cancelar</button>
                    </a>
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

