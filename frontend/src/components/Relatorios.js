import { useState } from "react";
import styled from "styled-components";
import RelatorioVendas from "../pages/RelatorioVendas.js";
import RelatorioPerfilCliente from "../pages/RelatorioPerfilCliente.js";
import ExpenseReportComponent from "./ExpenseReportComponent.js";

const Container = styled.div`
  display: flex;
  height: 89vh;
`;

const Sidebar = styled.div`
  width: 150px;
  background-color: #f4f4f4;
  padding: 10px;
  border-right: 1px solid #ccc;
  padding-top: 40px;
`;

const SidebarItem = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  background-color: ${(props) => (props.active ? "#ddd" : "transparent")};
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #e1e1e1;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

const Relatorios = () => {
  const [relatorioSelecionado, setRelatorioSelecionado] = useState("vendas");

  const renderConteudo = () => {
    switch (relatorioSelecionado) {
      case "vendas":
        return <RelatorioVendas />;
      case "perfilClientes":
        return <RelatorioPerfilCliente />;
      case "purchase":
        return <ExpenseReportComponent />;
      default:
        return <p>Selecione um relatório no menu.</p>;
    }
  };

  return (
    <Container>
      <Sidebar>
        <SidebarItem
          active={relatorioSelecionado === "vendas"}
          onClick={() => setRelatorioSelecionado("vendas")}
        >
          Relatório de Vendas
        </SidebarItem>
        <SidebarItem
          active={relatorioSelecionado === "perfilClientes"}
          onClick={() => setRelatorioSelecionado("perfilClientes")}
        >
          Relatório de Perfil de Clientes
        </SidebarItem>
        <SidebarItem
          active={relatorioSelecionado === "purchase"}
          onClick={() => setRelatorioSelecionado("purchase")}
        >
          Relatório de Compras
        </SidebarItem>
      </Sidebar>
      <Content>{renderConteudo()}</Content>
    </Container>
  );
};

export default Relatorios;
