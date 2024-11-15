import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const WelcomeMessage = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  font-weight: bold;
  color: #4caf50;
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 1s ease-out;
`;

const LogoffButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #d32f2f;
  }
`;

const Home = () => {
    const [nome, setNome] = useState("");
    const [showWelcome, setShowWelcome] = useState(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      // Recupera o nome (login) do usuário do localStorage
      const nomeUsuario = localStorage.getItem("nome");
      if (nomeUsuario) {
        setNome(nomeUsuario);
        setShowWelcome(true);
  
        // Depois de 4 segundos, faz a mensagem desaparecer
        setTimeout(() => {
          setShowWelcome(false);
        }, 4000);
      }
    }, []);

    const handleLogoff = () => {
        // Remove o token e o nome do localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("nome");
    
        // Redireciona para a página de login
        navigate("/login");
      };
  
    return (
      <div>
        <WelcomeMessage show={showWelcome}>
            Bem-vindo, {nome}!
        </WelcomeMessage>
        <h4>Sistema em construção!</h4>

        <LogoffButton onClick={handleLogoff}>Sair</LogoffButton>
      </div>
    );

    
  };  

export default Home;
