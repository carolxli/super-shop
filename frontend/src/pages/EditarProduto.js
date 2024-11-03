import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditarProduto = () => {
    const { idProduto } = useParams();
    const [produto, setProduto] = useState({});
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
        if (window.confirm("Tem certeza que deseja editar este produto?")) {
            try {
                await axios.put(`http://localhost:8800/Produto/${idProduto}`, produto);
                alert("Produto atualizado com sucesso!");
                navigate("/listarProdutos.js");
            } catch (error) {
                console.error("Erro ao atualizar produto:", error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Editar Produto</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="sku"
                    value={produto.sku}
                    onChange={handleChange}
                    placeholder="SKU"
                />
                <input
                    type="text"
                    name="descricao"
                    value={produto.descricao}
                    onChange={handleChange}
                    placeholder="Descrição"
                />
                <input
                    type="number"
                    name="valor_custo"
                    value={produto.valor_custo}
                    onChange={handleChange}
                    placeholder="Valor de Custo"
                />
                <input
                    type="number"
                    name="valor_venda"
                    value={produto.valor_venda}
                    onChange={handleChange}
                    placeholder="Valor de Venda"
                />
                <input
                    type="number"
                    name="estoque_min"
                    value={produto.estoque_min}
                    onChange={handleChange}
                    placeholder="Estoque Mínimo"
                />
                <input
                    type="number"
                    name="estoque_atual"
                    value={produto.estoque_atual}
                    onChange={handleChange}
                    placeholder="Estoque Atual"
                />
                <input
                    type="text"
                    name="status"
                    value={produto.status}
                    onChange={handleChange}
                    placeholder="Status"
                />
                {/* Outros campos conforme necessário */}
                <button type="submit">Confirmar Edição</button>
            </form>
        </div>
    );
};

export default EditarProduto;
