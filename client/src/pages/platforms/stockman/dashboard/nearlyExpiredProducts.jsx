import React from "react";
import { MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBIcon } from "mdbreact";
import Spinner from "../../../widgets/spinner";
import Table from "./table";

const NearlyExpiredProducts = ({ nearlyExpired, isLoading }) => {
  return (
    <MDBCol lg="12" md="12">
      <MDBCard className="mb-3">
        <MDBCardHeader color="info-color">
          <MDBIcon icon="exclamation-triangle" /> Nearly Expired Products
        </MDBCardHeader>
        <MDBCardBody>
          {!isLoading ? (
            <Table
              products={nearlyExpired}
              title={"Nearly Products Expired"}
              hasPlural={false}
            />
          ) : (
            <Spinner />
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default NearlyExpiredProducts;
