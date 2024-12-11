import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const FormComissao = () => {
  const { idComissao } = useParams();
  const navigate = useNavigate();

  const [comissao, setComissao] = useState({
    mes: "",
    ano: "",
    valor: "",
  });

  useEffect(() => {
    if (idComissao) {
      const fetchComissao = async () => {
        try {
          const response = await axios.get(`http://localhost:8800/comissao/${idComissao}`);
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
      if (idComissao) {
        await axios.put(`http://localhost:8800/comissao/${idComissao}`, comissao);
      } else {
        await axios.post("http://localhost:8800/comissao", comissao);
      }
      navigate("/listarComissao");
    } catch (error) {
      console.error("Erro ao salvar comissão:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Mês:
        <input type="number" name="mes" value={comissao.mes} onChange={handleChange} required />
      </label>
      <label>
        Ano:
        <input type="number" name="ano" value={comissao.ano} onChange={handleChange} required />
      </label>
      <label>
        Valor:
        <input type="number" name="valor" value={comissao.valor} onChange={handleChange} required />
      </label>
      <button type="submit">{idComissao ? "Atualizar" : "Cadastrar"}</button>
    </form>
  );
};

export default FormComissao;