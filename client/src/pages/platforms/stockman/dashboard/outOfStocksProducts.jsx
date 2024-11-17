import React from "react";
import { MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBIcon } from "mdbreact";
import Table from "./table";
import Spinner from "../../../widgets/spinner";

const OutOfStocksProducts = ({ outOfStocks = [], isLoading }) => {
  return (
    <MDBCol lg="12" md="12">
      <MDBCard className="mb-4">
        <MDBCardHeader color="danger-color">
          <MDBIcon icon="exclamation-triangle" className="mr-1" />
          Out of Stock Products
        </MDBCardHeader>
        <MDBCardBody>
          {!isLoading ? (
            <Table
              products={outOfStocks}
              isStock={true}
              isExpired={false}
              title={"Out of Stock Product"}
            />
          ) : (
            <Spinner />
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default OutOfStocksProducts;
