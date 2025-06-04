import { useState } from "react";
import styled from "styled-components";

// Importar os relatórios
import RelatorioVendas from "../pages/RelatorioVendas.js";
import RelatorioPerfilCliente from "../pages/RelatorioPerfilCliente.js";
import RelatorioPerfilFornecedor from "../pages/RelatorioPerfilFornecedor.js";
import RelatorioEstoque from "../pages/RelatorioEstoque.js";
import RelatorioAcertoEstoque from "../pages/RelatorioAcertoEstoque.js";
import RelatorioGiroEstoque from "../pages/RelatorioGiroEstoque.js";
import RelatorioDevolucoes from "../pages/RelatorioDevolucoes.js";
import ExpenseReportComponent from "./ExpenseReportComponent.js";
import PurchaseReport from "./PurchaseReportComponent.js";

const Container = styled.div`
  display: flex;
  height: 89vh;
`;

const Sidebar = styled.div`
  width: 150px;
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
        return <RelatorioPerfilFornecedor />;
      case "estoque":
        return <RelatorioEstoque />;
      case "acertoEstoque":
        return <RelatorioAcertoEstoque />;
      case "giroEstoque":
        return <RelatorioGiroEstoque />;
      case "devolucoes":
        return <RelatorioDevolucoes />;
      case "purchase":
        return <ExpenseReportComponent />;
      case "compras":
        return <PurchaseReport />;
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
          Perfil de Clientes
        </SidebarItem>
        <SidebarItem
          active={relatorioSelecionado === "perfilFornecedores"}
          onClick={() => setRelatorioSelecionado("perfilFornecedores")}
        >
          Perfil de Fornecedores
        </SidebarItem>
        <SidebarItem
          active={relatorioSelecionado === "estoque"}
          onClick={() => setRelatorioSelecionado("estoque")}
        >
          Relatório de Estoque
        </SidebarItem>
        <SidebarItem
          active={relatorioSelecionado === "acertoEstoque"}
          onClick={() => setRelatorioSelecionado("acertoEstoque")}
        >
          Acerto de Estoque
        </SidebarItem>
        <SidebarItem
          active={relatorioSelecionado === "giroEstoque"}
          onClick={() => setRelatorioSelecionado("giroEstoque")}
        >
          Giro de Estoque
        </SidebarItem>
        <SidebarItem
          active={relatorioSelecionado === "devolucoes"}
          onClick={() => setRelatorioSelecionado("devolucoes")}
        >
          Relatório de Devoluções
        </SidebarItem>
        <SidebarItem
          active={relatorioSelecionado === "compras"}
          onClick={() => setRelatorioSelecionado("compras")}
        >
          Relatório de Compras
        </SidebarItem>
      </Sidebar>
      <Content>{renderConteudo()}</Content>
    </Container>
  );
};

export default Relatorios;