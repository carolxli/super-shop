import { useState } from "react";
import styled from "styled-components";
import RelatorioVendas from "../pages/RelatorioVendas.js";
import RelatorioPerfilCliente from "../pages/RelatorioPerfilCliente.js";
import RelatorioPerfilFornecedor from "../pages/RelatorioPerfilFornecedor.js";
import RelatorioAcertoEstoque from "../pages/RelatorioAcertoEstoque.js";
import ExpenseReportComponent from "./ExpenseReportComponent.js";
import PurchaseReport from "./PurchaseReportComponent.js";

const Container = styled.div`
  display: flex;
  height: 89vh;
`;

const Sidebar = styled.div`
  width: 155px;
  background-color: #f4f4f4;
  padding: 20px;
  border-right: 1px solid #ccc;
  padding-top: 65px;
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
      case "perfilFornecedores":
        return <RelatorioPerfilFornecedor/>;
      case "purchase":
        return <ExpenseReportComponent />;
      case "purchase":
        return <PurchaseReport />;
      case "acertoEstoque":
        return <RelatorioAcertoEstoque/>;
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
          active={relatorioSelecionado === "perfilFornecedores"}
          onClick={() => setRelatorioSelecionado("perfilFornecedores")}
        >
          Relatório de Perfil de Fornecedores
        </SidebarItem>
        <SidebarItem
          active={relatorioSelecionado === "purchase"}
          onClick={() => setRelatorioSelecionado("purchase")}
        >
          Relatório de Despesas
        </SidebarItem>

        <SidebarItem
          active={relatorioSelecionado === "acertoEstoque"}
          onClick={() => setRelatorioSelecionado("acertoEstoque")}
        >
          Relatório de Acerto de Estoque
        </SidebarItem>
      </Sidebar>
      <Content>{renderConteudo()}</Content>
    </Container>
  );
};

export default Relatorios;
