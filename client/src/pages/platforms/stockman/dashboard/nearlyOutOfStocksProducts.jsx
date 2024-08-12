import React from "react";
import { MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBIcon } from "mdbreact";
import Table from "./table";
import Spinner from "../../../widgets/spinner";

const NearlyOutOfStocksProducts = ({ outOfStocks = [], isLoading }) => {
  return (
    <MDBCol lg="12" md="12">
      <MDBCard className="mb-4">
        <MDBCardHeader color="primary-color">
          <MDBIcon icon="exclamation-triangle" className="mr-1" />
          Nearly Out of Stock Products
        </MDBCardHeader>
        <MDBCardBody>
          {!isLoading ? (
            <Table
              products={outOfStocks}
              isStock={true}
              title={"Nearly out of stock"}
            />
          ) : (
            <Spinner />
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default NearlyOutOfStocksProducts;
