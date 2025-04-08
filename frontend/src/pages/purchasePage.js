import React from "react";
import styled from "styled-components";
import PurchaseComponent from "../components/PurchaseComponent";
import PurchaseListComponent from "../components/PurchaseListComponent";

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const purchasePage = () => {
  return (
    <Container>
      <PurchaseComponent />
      <PurchaseListComponent />{" "}
    </Container>
  );
};

export default purchasePage;
