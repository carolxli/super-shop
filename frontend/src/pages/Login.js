import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height:50vh;
  background-color: #f5f5f5;
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 200px;
  background-color: #ffffff;
  padding: 60px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
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
  const { login: updateAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8800/usuario/login", {
        login,
        senha,
      });

      const { token, nome, cargo } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("nome", nome);
      localStorage.setItem("cargo", cargo);

      updateAuth();
      navigate("/");
    } catch (error) {
      setError("Credenciais incorretas.");
    }
  };

  return (
    <>
     <h2>Login</h2>
      <LoginContainer>
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
    </>
  );
};

export default Login;
