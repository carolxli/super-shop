// src/components/FormProduto.js
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
        <form onSubmit={handleSubmit}>
            <h2>Cadastrar Produto</h2>
            <input type="text" name="sku" placeholder="SKU" value={produto.sku} onChange={handleChange} required />
            <input type="text" name="descricao" placeholder="Descrição" value={produto.descricao} onChange={handleChange} required />
            <input type="number" name="valor_custo" placeholder="Valor Custo" value={produto.valor_custo} onChange={handleChange} required />
            <input type="number" name="valor_venda" placeholder="Valor Venda" value={produto.valor_venda} onChange={handleChange} required />
            <input type="number" name="estoque_min" placeholder="Estoque Mínimo" value={produto.estoque_min} onChange={handleChange} required />
            <input type="number" name="estoque_atual" placeholder="Estoque Atual" value={produto.estoque_atual} onChange={handleChange} required />
            <select name="status" value={produto.status} onChange={handleChange} required>
                <option value="">Selecione o Status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
            </select>
            <input type="text" name="Fornecedor_idFornecedor" placeholder="ID Fornecedor" value={produto.Fornecedor_idFornecedor} onChange={handleChange} required />
            <input type="text" name="Fornecedor_Pessoa_idPessoa" placeholder="ID Pessoa Fornecedor" value={produto.Fornecedor_Pessoa_idPessoa} onChange={handleChange} required />
            <input type="text" name="Marca_idMarca" placeholder="ID Marca" value={produto.Marca_idMarca} onChange={handleChange} required />
            <input type="text" name="Categoria_idCategoria" placeholder="ID Categoria" value={produto.Categoria_idCategoria} onChange={handleChange} required />
            <button type="submit">Cadastrar Produto</button>
        </form>
    );
};

export default FormProduto;
