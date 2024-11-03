// src/pages/EditarFornecedor.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditarFornecedor = () => {
    const { idFornecedor } = useParams();
    const navigate = useNavigate();
    const [fornecedor, setFornecedor] = useState({
        cnpj: '',
        razao_social: '',
        qtd_min_pedido: '',
        prazo_entrega: '',
        dt_inicio_fornecimento: '', // Garantir que a data esteja neste formato
        observacao: '',
        Pessoa_idPessoa: '',
    });

    useEffect(() => {
        const fetchFornecedor = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/fornecedor/${idFornecedor}`);
                // Preencher o estado com os dados retornados
                const fornecedorData = response.data;
                setFornecedor({
                    ...fornecedorData,
                    dt_inicio_fornecimento: fornecedorData.dt_inicio_fornecimento.split('T')[0] // Formatar a data
                });
            } catch (err) {
                console.error(err);
                alert('Erro ao buscar fornecedor');
            }
        };
        fetchFornecedor();
    }, [idFornecedor]);

    const handleChange = (e) => {
        setFornecedor({
            ...fornecedor,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const confirmUpdate = window.confirm("Você tem certeza que deseja atualizar este fornecedor?");
        if (!confirmUpdate) {
            return; // Se o usuário não confirmar, sai da função
        }
    
        try {
            await axios.put(`http://localhost:8800/fornecedor/${idFornecedor}`, fornecedor);
            alert('Fornecedor atualizado com sucesso!');
            navigate('/listar-fornecedores');
        } catch (err) {
            console.error(err);
            alert('Erro ao atualizar fornecedor');
        }
    };
    
    return (
        <div>
            <h2>Editar Fornecedor</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="cnpj" placeholder="CNPJ" value={fornecedor.cnpj} onChange={handleChange} required />
                <input type="text" name="razao_social" placeholder="Razão Social" value={fornecedor.razao_social} onChange={handleChange} required />
                <input type="number" name="qtd_min_pedido" placeholder="Quantidade Mínima de Pedido" value={fornecedor.qtd_min_pedido} onChange={handleChange} required />
                <input type="number" name="prazo_entrega" placeholder="Prazo de Entrega (dias)" value={fornecedor.prazo_entrega} onChange={handleChange} required />
                <input type="date" name="dt_inicio_fornecimento" placeholder="Data de Início" value={fornecedor.dt_inicio_fornecimento} onChange={handleChange} required />
                <textarea name="observacao" placeholder="Observação" value={fornecedor.observacao} onChange={handleChange} />
                <input type="number" name="Pessoa_idPessoa" placeholder="ID da Pessoa" value={fornecedor.Pessoa_idPessoa} onChange={handleChange} required />
                <button type="submit">Atualizar Fornecedor</button>
            </form>
        </div>
    );
};

export default EditarFornecedor;
