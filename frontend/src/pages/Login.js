import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login: updateAuth } = useAuth(); // Atualiza o contexto de autenticação

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8800/usuario/login", {
        login,
        senha,
      });

      const { token, nome, cargo } = response.data;

      // Armazena os dados no localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("nome", nome);
      localStorage.setItem("cargo", cargo);

      updateAuth(); // Atualiza o contexto de autenticação
      navigate("/"); // Redireciona para a página inicial
    } catch (error) {
      setError("Credenciais incorretas.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Login:
          <input
            type="text"
            placeholder="Digite seu login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </label>
        <label>
          Senha:
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </label>
        <button type="submit">Entrar</button>
        {error && (
          <p style={{ color: "red", fontSize: "14px", marginTop: "10px" }}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
