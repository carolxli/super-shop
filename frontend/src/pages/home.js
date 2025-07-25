import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 30px;
`;

const WelcomeMessage = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #1976d2;
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 1s ease-out;
  text-align: center;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 400px;
  margin-top: -180px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, rgb(17, 123, 230), #87ceeb);
  color: white;
  font-size: 1.2rem;
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);

  &:hover {
    background: linear-gradient(135deg, #2196f3, #87ceeb);
    transform: scale(1.05);
  }
`;

const Home = () => {
  const [nome, setNome] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const nomeUsuario = localStorage.getItem("nome");
    const cargoUsuario = localStorage.getItem("cargo");
    const justLoggedIn = localStorage.getItem("justLoggedIn");

    if (nomeUsuario) {
      setNome(nomeUsuario);

      if (justLoggedIn === "true") {
        setShowWelcome(true);
        localStorage.removeItem("justLoggedIn");

        setTimeout(() => {
          setShowWelcome(false);
        }, 4000);
      }
    }

    console.log("Cargo do usuário:", cargoUsuario);
  }, []);

  return (
    <>
      <WelcomeMessage show={showWelcome}>Bem-vindo(a), {nome}!</WelcomeMessage>
      <Container>
        <ButtonGrid>
          <Button type="button" onClick={() => navigate("/venda")}>
            Venda
          </Button>
           <Button type="button" onClick={() => navigate("/caixa")}>
            Caixa
          </Button>
          <Button type="button" onClick={() => navigate("/purchasePage")}>
            Compra
          </Button>
          <Button type="button" onClick={() => navigate("/relatorios")}>
            Relatórios
          </Button>
          <Button type="button" onClick={() => navigate("/devolucao")}>
            Devolução
          </Button>
          <Button type="button" onClick={() => navigate("/reserva")}>
            Reserva
          </Button>
        </ButtonGrid>
      </Container>
    </>
  );
};

export default Home;
