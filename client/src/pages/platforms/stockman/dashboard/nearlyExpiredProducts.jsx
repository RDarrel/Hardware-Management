import React from "react";
import { MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBIcon } from "mdbreact";
import Table from "./table";

const NearlyExpiredProducts = ({ nearlyExpired }) => {
  return (
    <MDBCol lg="12" md="12">
      <MDBCard className="mb-4">
        <MDBCardHeader color="danger-color">
          <MDBIcon icon="exclamation-triangle" /> Nearly Products Expired
        </MDBCardHeader>
        <MDBCardBody>
          <Table products={nearlyExpired} />
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default NearlyExpiredProducts;
