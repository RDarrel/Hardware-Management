import React from "react";
import { MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBIcon } from "mdbreact";
import Table from "./table";

const OutOfStocksProducts = ({ outOfStocks = [] }) => {
  return (
    <MDBCol lg="12" md="12">
      <MDBCard className="mb-4">
        <MDBCardHeader color="primary-color">
          <MDBIcon icon="exclamation-triangle" className="mr-1" />
          Nearly Product Out of Stocks
        </MDBCardHeader>
        <MDBCardBody>
          <Table
            products={outOfStocks}
            isStock={true}
            title={"Nearly out of stock"}
          />
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default OutOfStocksProducts;
