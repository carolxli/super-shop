import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ListarProdutos = () => {
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await axios.get("http://localhost:8800/Produto");
                console.log("Resposta da API:", response.data);
                setProdutos(response.data.rows);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao buscar produtos", err);
                setError("Erro ao carregar produtos.");
                setLoading(false);
            }
        };

        fetchProdutos();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Você tem certeza que deseja deletar este produto?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8800/Produto/${id}`);
                setProdutos(produtos.filter(produto => produto.idProduto !== id));
            } catch (err) {
                console.error("Erro ao deletar produto", err);
                alert("Erro ao deletar produto. Tente novamente.");
            }
        }
    };

    if (loading) {
        return <div>Carregando produtos...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div>
                <h2>Lista de Produtos</h2>
                <table>
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Descrição</th>
                            <th>Valor Custo</th>
                            <th>Valor Venda</th>
                            <th>Estoque Mínimo</th>
                            <th>Estoque Atual</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.length > 0 ? (
                            produtos.map((produto) => (
                                <tr key={produto.idProduto}>
                                    <td>{produto.sku}</td>
                                    <td>{produto.descricao}</td>
                                    <td>{produto.valor_custo}</td>
                                    <td>{produto.valor_venda}</td>
                                    <td>{produto.estoque_min}</td>
                                    <td>{produto.estoque_atual}</td>
                                    <td>{produto.status}</td>
                                    <td>
                                        <button onClick={() => navigate(`/editarProduto/${produto.idProduto}`)}>Editar</button>
                                        <button onClick={() => handleDelete(produto.idProduto)}>Deletar</button>
                                        <button onClick={() => navigate(`/acertoEstoque/${produto.idProduto}`)}>Acertar estoque</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">Nenhum produto encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ListarProdutos;