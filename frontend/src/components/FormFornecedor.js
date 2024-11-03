import React, { useState } from 'react';
import axios from 'axios';

const FormFornecedor = () => {
    const [fornecedor, setFornecedor] = useState({
        cnpj: '',
        razao_social: '',
        qtd_min_pedido: '',
        prazo_entrega: '',
        dt_inicio_fornecimento: '',
        observacao: '',
        Pessoa_idPessoa: '',
    });

    const handleChange = (e) => {
        setFornecedor({
            ...fornecedor,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8800/fornecedor', fornecedor);
            alert('Fornecedor cadastrado com sucesso!');
            setFornecedor({
                cnpj: '',
                razao_social: '',
                qtd_min_pedido: '',
                prazo_entrega: '',
                dt_inicio_fornecimento: '',
                observacao: '',
                Pessoa_idPessoa: '',
            });
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
                    <input type="text" name="cnpj" value={fornecedor.cnpj} onChange={handleChange} required />
                </label>

                <label>
                    Razão Social
                    <input type="text" name="razao_social" value={fornecedor.razao_social} onChange={handleChange} required />
                </label>

                <label>
                    Quantidade Mínima de Pedido
                    <input type="number" name="qtd_min_pedido" value={fornecedor.qtd_min_pedido} onChange={handleChange} required />
                </label>

                <label>
                    Prazo de Entrega (dias)
                    <input type="number" name="prazo_entrega" value={fornecedor.prazo_entrega} onChange={handleChange} required />
                </label>

                <label>
                    Data de Início
                    <input type="date" name="dt_inicio_fornecimento" value={fornecedor.dt_inicio_fornecimento} onChange={handleChange} required />
                </label>

                <label>
                    ID da Pessoa
                    <input type="number" name="Pessoa_idPessoa" value={fornecedor.Pessoa_idPessoa} onChange={handleChange} required />
                </label>

                <label>
                    Observação
                    <textarea name="observacao" value={fornecedor.observacao} onChange={handleChange} />
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '90px', marginLeft: '90px' }}>
                    <button type="submit">Cadastrar</button>
                    <a href='/'>
                        <button type="button">Cancelar</button>
                    </a>
                </div>
            </form>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px', marginLeft: '256px' }}>
                <a href="/listar-fornecedores">
                    <button>Listar Fornecedores Cadastradas</button>
                </a>
            </div>
        </>
    );
};

export default FormFornecedor;
