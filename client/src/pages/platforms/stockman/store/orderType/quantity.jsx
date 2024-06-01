import { MDBCol, MDBRow, MDBIcon, MDBBtn, MDBInputGroup } from "mdbreact";
import React from "react";

export const Quantity = ({ toggleView }) => {
  return (
    <MDBRow className="d-flex align-items-center mt-3">
      <MDBCol md="2">Quantity:</MDBCol>
      <MDBCol md="4">
        <MDBInputGroup
          type="number"
          className="text-center border border-light"
          style={{ width: "70%" }}
          size="sm"
          prepend={
            <MDBBtn
              className="m-0 px-2 py-0"
              size="sm"
              color="light"
              style={{ boxShadow: "0px 0px 0px 0px" }}
              outline
            >
              <MDBIcon icon="minus" style={{ color: "black" }} />
            </MDBBtn>
          }
          append={
            <MDBBtn
              className="m-0 px-2  py-0"
              size="sm"
              color="light"
              style={{ boxShadow: "0px 0px 0px 0px" }}
              outline
            >
              <MDBIcon icon="plus" style={{ color: "black" }} />
            </MDBBtn>
          }
        />
      </MDBCol>
      <MDBCol>
        <MDBBtn color="danger" onClick={() => toggleView()}>
          ADD TO CART
        </MDBBtn>
      </MDBCol>
    </MDBRow>
  );
};
