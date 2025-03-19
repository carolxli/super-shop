import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext.js";

const AcertoEstoque = () => {
    const { usuarioLogado } = useAuth(); // Pegando usuário autenticado

    const { idProduto } = useParams();
    const navigate = useNavigate();

    const [produto, setProduto] = useState(null);
    const [estoqueNovo, setEstoqueNovo] = useState(0);
    const [motivo, setMotivo] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduto = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/Produto/${idProduto}`);
                setProduto(response.data);
                setEstoqueNovo(response.data.estoque_atual); // Preenche estoqueNovo com o estoque atual
                setLoading(false);
            } catch (err) {
                console.error("Erro ao buscar produto", err);
                setError("Erro ao carregar produto.");
                setLoading(false);
            }
        };

        fetchProduto();
    }, [idProduto]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const acertoData = {
            Produto_idProduto: idProduto,
            estoqueAnterior: produto.estoque_atual,
            estoqueNovo,
            motivo,
            usuario: usuarioLogado?.nome || "Usuário Desconhecido",
        };

        try {
            const response = await axios.post("http://localhost:8800/acertoEstoque/", acertoData);

            // Se o backend retornar um aviso, exibir um alerta antes de continuar
            if (response.data.warning) {
                const confirmar = window.confirm(response.data.message);
                if (!confirmar) return; // Se o usuário cancelar, interrompe o processo

                // Reenvia os dados sem a verificação, confirmando a operação
                await axios.post("http://localhost:8800/acertoEstoque/", { ...acertoData, confirmado: true });
            }

            alert("Estoque ajustado com sucesso!");
            navigate("/listar-produtos");
        } catch (err) {
            console.error("Erro ao ajustar estoque", err);
            alert("Erro ao ajustar estoque. Tente novamente.");
        }
    };

    if (loading) {
        return <div>Carregando dados do produto...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Estilos com styled-components
    const FormRow = styled.form`
        width: 80%;
        padding: 5px;
        font-size: 14px;
    `;

    const Input = styled.input`
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        transition: border-color 0.3s;
    `;

    const Button = styled.button`
        background-color: #87CEEB;
        color: #fff;
        border: none;
        padding: 5px;
        border-radius: 4px;
        cursor: pointer; 
        font-size: 14px; 
        transition: background-color 0.3s;
        width: 150px;
        margin: 5px;
    `;

    return (
        <>
            <h2>Acertar Estoque - {produto.descricao}</h2>
            <FormRow onSubmit={handleSubmit}>

                <label>ID Produto
                    <Input type="text" value={produto.idProduto} disabled style={{ cursor: "not-allowed" }} />
                </label>
                <label>Estoque Anterior
                    <Input type="text" value={produto.estoque_atual} disabled style={{ cursor: "not-allowed" }} />
                </label>
                <label>Estoque Novo
                    <Input
                        type="number"
                        min={0}
                        value={estoqueNovo}
                        onChange={(e) => setEstoqueNovo(e.target.value)}
                    /></label>

                <label htmlFor="motivo">Motivo
                    <select
                        id="motivo"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        required
                    >
                        <option value=""></option>
                        <option value="Perda">Perda</option>
                        <option value="Roubo">Roubo</option>
                        <option value="Avaria">Avaria</option>
                        <option value="Erro">Erro de lançamento</option>
                        <option value="Extravio">Extravio</option>
                        <option value="Danificacao">Danificação</option>
                        <option value="Obsoleto">Produto obsoleto</option>
                        <option value="Contagem">Divergência na contagem física</option>
                        <option value="Ajuste">Ajuste contábil/fiscal</option>
                    </select>
                </label>

                <Button type="submit">Salvar Acerto</Button>
                <Button type="button" onClick={() => navigate("/listar-produtos")}>Cancelar</Button>

            </FormRow>
        </>
    );
};

export default AcertoEstoque;