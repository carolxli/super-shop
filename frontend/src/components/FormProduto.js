import React, { useState } from 'react';
import axios from 'axios';

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
        Fornecedor_Pessoa_idPessoa: '',
        Marca_idMarca: '',
        Categoria_idCategoria: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduto({
            ...produto,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8800/Produto', produto);
            alert(response.data);
            setProduto({ sku: '', descricao: '', valor_custo: '', valor_venda: '', estoque_min: '', estoque_atual: '', status: '', Fornecedor_idFornecedor: '', Fornecedor_Pessoa_idPessoa: '', Marca_idMarca: '', Categoria_idCategoria: '' });
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

                <label>
                    Descrição:
                    <input type="text" name="descricao" value={produto.descricao} onChange={handleChange} required />
                </label>

                <label>
                    Valor Custo:
                    <input type="number" name="valor_custo" value={produto.valor_custo} onChange={handleChange} required />
                </label>

                <label>
                    Valor Venda:
                    <input type="number" name="valor_venda" value={produto.valor_venda} onChange={handleChange} required />
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
                    ID Fornecedor:
                    <input type="text" name="Fornecedor_idFornecedor" value={produto.Fornecedor_idFornecedor} onChange={handleChange} required />
                </label>

                <label>
                    ID Pessoa Fornecedor:
                    <input type="text" name="Fornecedor_Pessoa_idPessoa" value={produto.Fornecedor_Pessoa_idPessoa} onChange={handleChange} required />
                </label>

                <label>
                    ID Marca:
                    <input type="text" name="Marca_idMarca" value={produto.Marca_idMarca} onChange={handleChange} required />
                </label>

                <label>
                    ID Categoria:
                    <input type="text" name="Categoria_idCategoria" value={produto.Categoria_idCategoria} onChange={handleChange} required />
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
