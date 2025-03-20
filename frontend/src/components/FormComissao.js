import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const FormComissao = () => {
  const { idComissao } = useParams();

  const [comissao, setComissao] = useState({
    mes: "",
    ano: "",
    valor: "",
    descricao: "",
  });

  useEffect(() => {
    if (idComissao) {
      const fetchComissao = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8800/comissao/${idComissao}`
          );
          setComissao(response.data);
        } catch (error) {
          console.error("Erro ao buscar comissão:", error);
        }
      };

      fetchComissao();
    }
  }, [idComissao]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComissao((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (idComissao) {
        response = await axios.put(
          `http://localhost:8800/comissao/${idComissao}`,
          comissao
        );
      } else {
        response = await axios.post("http://localhost:8800/comissao", comissao);
      }

      if ([200, 201].includes(response.status)) {
        alert("Operação realizada com sucesso!");
        setComissao({ mes: "", ano: "", valor: "", descricao: "" });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Já existe uma comissão cadastrada com a mesma descricao.");
      } else {
        console.error("Erro ao salvar comissão:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Mês:
        <input
          type="number"
          name="mes"
          value={comissao.mes}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Ano:
        <input
          type="number"
          name="ano"
          value={comissao.ano}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Valor:
        <input
          type="number"
          name="valor"
          value={comissao.valor}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Descrição:
        <input
          type="text"
          name="descricao"
          value={comissao.descricao}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">{idComissao ? "Atualizar" : "Cadastrar"}</button>
    </form>
  );
};

export default FormComissao;
