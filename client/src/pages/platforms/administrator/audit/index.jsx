import { MDBCard, MDBCardBody, MDBIcon, MDBTable } from "mdbreact";
import React from "react";

const Audit = () => {
  return (
    <MDBCard>
      <MDBCardBody>
        <div className="d-flex align-items-center">
          <MDBIcon icon="map" style={{ color: "blue" }} size="2x" />
          <h4 className="mt-2 ml-2">Audit Trails</h4>
        </div>
        <MDBTable>
          <thead>
            <tr>
              <th>#</th>
              <th>Date & Time</th>
              <th>Employee</th>
              <th>Action Type</th>
              <th>Amount</th>
            </tr>
          </thead>
        </MDBTable>
      </MDBCardBody>
    </MDBCard>
  );
};

export default Audit;
