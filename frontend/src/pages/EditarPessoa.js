import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputMask from 'react-input-mask';

const EditarPessoa = () => {
  const { idPessoa } = useParams();
  const navigate = useNavigate();
  const [pessoa, setPessoa] = useState({
    email: '',
    nome: '',
    end_rua: '',
    end_numero: '',
    end_bairro: '',
    end_complemento: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone_1: '',
    telefone_2: '',
    data_nasc: ''
  });

  useEffect(() => {
    const fetchPessoa = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/Pessoa/${idPessoa}`);
        setPessoa(response.data);

      } catch (error) {
        console.error("Erro ao buscar pessoa:", error);
        alert("Erro ao carregar dados da pessoa.");
      }
    };

    fetchPessoa();
  }, [idPessoa]);

  const fetchAddress = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.data.erro) {
        alert("CEP não encontrado.");
        return;
      }

      const { logradouro, bairro, localidade, uf } = response.data;
      setPessoa(prevData => ({
        ...prevData,
        end_rua: logradouro || '',
        end_bairro: bairro || '',
        cidade: localidade || '',
        estado: uf || '',
      }));
    } catch (error) {
      console.error("Erro ao buscar o CEP:", error);
      alert("Erro ao buscar o CEP.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPessoa(prev => ({ ...prev, [name]: value }));

    if (name === 'cep') {
      const cleanedCep = value.replace(/\D/g, '');
      if (cleanedCep.length === 8) {
        fetchAddress(cleanedCep);
      } else {
        setPessoa(prev => ({
          ...prev,
          end_rua: '',
          end_bairro: '',
          cidade: '',
          estado: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmEdit = window.confirm("Você tem certeza que deseja editar esta pessoa?");
    if (confirmEdit) {
      try {
        await axios.put(`http://localhost:8800/Pessoa/${idPessoa}`, pessoa);
        alert("Pessoa editada com sucesso!");
        navigate('/listar-pessoas');
      } catch (error) {
        console.error("Erro ao editar pessoa:", error);
        alert("Erro ao editar pessoa.");
      }
    }
  };

  return (
    <>
      <h3>Editar Pessoa</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Nome
          <input type="text" name="nome" value={pessoa.nome} onChange={handleChange} required />
        </label>

        <label>
          Email
          <input type="email" name="email" value={pessoa.email} onChange={handleChange} required />
        </label>

        <label>
          Telefone 1
          <InputMask
            mask="(99) 99999-9999"
            name="telefone_1"
            value={pessoa.telefone_1}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Telefone 2
          <InputMask
            mask="(99) 99999-9999"
            name="telefone_2"
            value={pessoa.telefone_2}
            onChange={handleChange}
          />
        </label>

        <label>
          Data de Nascimento
          <input type="date" name="data_nasc" value={pessoa.data_nasc} onChange={handleChange} required />
        </label>

        <label>
          CEP
          <InputMask
            mask="99999-999"
            name="cep"
            value={pessoa.cep}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Rua
          <input type="text" name="end_rua" value={pessoa.end_rua} onChange={handleChange} required />
        </label>

        <label>
          Número
          <input type="text" name="end_numero" value={pessoa.end_numero} onChange={handleChange} required />
        </label>

        <label>
          Bairro
          <input type="text" name="end_bairro" value={pessoa.end_bairro} onChange={handleChange} required />
        </label>

        <label>
          Complemento
          <input type="text" name="end_complemento" value={pessoa.end_complemento} onChange={handleChange} />
        </label>

        <label>
          Cidade
          <input type="text" name="cidade" value={pessoa.cidade} onChange={handleChange} required />
        </label>

        <label>
          Estado
          <input type="text" name="estado" value={pessoa.estado} onChange={handleChange} required />
        </label>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit">Editar</button>
          <button type="button" onClick={() => navigate('/listar-pessoas')}>Cancelar</button>
        </div>
      </form>
    </>
  );
};

export default EditarPessoa;
