import { MDBRow, MDBCol, MDBBtn } from "mdbreact";
import React from "react";

const Kilo = ({ toggleView }) => {
  return (
    <MDBRow className="mt-4 d-flex align-items-center">
      <MDBCol md="2">
        <h6>Kilo:</h6>
      </MDBCol>
      <MDBCol md="6" className="m-0 d-flex align-items-center">
        <input label="kilo" type="number" className="form-control mr-2" />
        <select className="form-control">
          <option>kl</option>
          <option>1/2 kl</option>
          <option>1/4 kl</option>
          <option>1/3 kl</option>
        </select>
      </MDBCol>
      <MDBCol>
        <MDBBtn color="danger" onClick={() => toggleView()}>
          ADD TO CART
        </MDBBtn>
      </MDBCol>
    </MDBRow>
  );
};

export default Kilo;
