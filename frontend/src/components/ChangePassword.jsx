import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("http://localhost:8800/usuario/reset-password", {
        email,
        senha
      });
  
      if (response.status === 200) {
        setMessage('Senha alterada com sucesso!');
        setEmail('');
        setSenha('');
        setTimeout(() => {
        navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error("Erro detalhado:", error);
      setMessage(error.response?.data?.error || 'Erro ao alterar a senha');
    }
  };

  return (
    <div className="change-password-container">
      <form onSubmit={handleSubmit}>
        <h2>Alterar Senha</h2>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua nova senha"
            required
          />
        </div>
        <button type="submit">Alterar Senha</button>
        {message && <p className={message.includes('sucesso') ? 'success' : 'error'}>{message}</p>}
      </form>
    </div>
  );
};

export default ChangePassword;