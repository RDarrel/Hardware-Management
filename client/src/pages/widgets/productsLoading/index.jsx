import React from "react";
import { MDBCard, MDBCardBody, MDBCol, MDBRow } from "mdbreact";
import "./productsLoadin.css";
const ProductsLoading = () => {
  const CARDS = Array(12).fill("");
  return (
    <MDBRow>
      {CARDS.map((_, index) => (
        <MDBCol md="3" key={index} className="mt-1">
          <MDBCard className="blinking-card">
            <MDBCardBody className="d-flex justify-content-center align-items-center">
              Loading..
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      ))}
    </MDBRow>
  );
};

export default ProductsLoading;
