import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduto = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/Produto/${idProduto}`);
                setProduto(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao buscar produto:", error);
                setLoading(false);
            }
        };
        fetchProduto();
    }, [idProduto]);

    const handleChange = (e) => {
        setProduto({ ...produto, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (window.confirm("Tem certeza que deseja atualizar este produto?")) {
            try {
                await axios.put(`http://localhost:8800/Produto/${idProduto}`, produto);
                alert("Produto atualizado com sucesso!");
                navigate("/listar-produtos"); // Redireciona após a edição
            } catch (error) {
                console.error("Erro ao atualizar produto:", error);
            }
        }
    };

    if (loading) return <div>Carregando...</div>;

    return (
        <div>
            <h1>Editar Produto</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    SKU:
                    <input type="text" name="sku" value={produto.sku} onChange={handleChange} />
                </label>
                <label>
                    Descrição:
                    <input type="text" name="descricao" value={produto.descricao} onChange={handleChange} />
                </label>
                <label>
                    Valor de Custo:
                    <input type="number" name="valor_custo" value={produto.valor_custo} onChange={handleChange} />
                </label>
                <label>
                    Valor de Venda:
                    <input type="number" name="valor_venda" value={produto.valor_venda} onChange={handleChange} />
                </label>
                <label>
                    Estoque Mínimo:
                    <input type="number" name="estoque_min" value={produto.estoque_min} onChange={handleChange} />
                </label>
                <label>
                    Estoque Atual:
                    <input type="number" name="estoque_atual" value={produto.estoque_atual} onChange={handleChange} />
                </label>
                <label>
                    Status:
                    <input type="text" name="status" value={produto.status} onChange={handleChange} />
                </label>
                <label>
                    Fornecedor ID:
                    <input type="text" name="Fornecedor_idFornecedor" value={produto.Fornecedor_idFornecedor} onChange={handleChange} />
                </label>
                <label>
                    Fornecedor Pessoa ID:
                    <input type="text" name="Fornecedor_Pessoa_idPessoa" value={produto.Fornecedor_Pessoa_idPessoa} onChange={handleChange} />
                </label>
                <label>
                    Marca ID:
                    <input type="text" name="Marca_idMarca" value={produto.Marca_idMarca} onChange={handleChange} />
                </label>
                <label>
                    Categoria ID:
                    <input type="text" name="Categoria_idCategoria" value={produto.Categoria_idCategoria} onChange={handleChange} />
                </label>
                <button type="submit">Confirmar Edição</button>
            </form>
        </div>
    );
};

export default EditarProduto;
