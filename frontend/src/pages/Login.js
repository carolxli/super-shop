import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const LoginContainer = styled.div`
  /* Estilização da tela */
`;

const LoginForm = styled.form`
  /* Estilização do formulário */
`;

const LoginInput = styled.input`
  /* Estilização dos inputs */
`;

const LoginButton = styled.button`
  /* Estilização do botão */
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
`;

const Login = () => {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:8800/usuario/login", {
        login,
        senha,
      });
  
      const { token, nome } = response.data;  // Aqui, 'nome' é o login do usuário
      localStorage.setItem("token", token);
      localStorage.setItem("nome", nome);  // Salva o login como nome
      navigate("/"); // Redireciona para a página Home
    } catch (error) {
      setError("Credenciais incorretas.");
    }
  };  

  return (
    <LoginContainer>
      <h2>Login</h2>
      <LoginForm onSubmit={handleSubmit}>
        <LoginInput
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <LoginInput
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <LoginButton type="submit">Entrar</LoginButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
