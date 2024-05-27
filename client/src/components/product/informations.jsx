import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBIcon,
} from "mdbreact";
import { useState } from "react";

function Informations() {
  const [enableVariations, setEnableVariations] = useState(false);

  return (
    <MDBRow className="mt-3">
      <MDBCol md="12">
        <MDBCard>
          <MDBCardBody>
            <h4 className="font-weight-bold">Sales Information</h4>
            {!enableVariations ? (
              <>
                <MDBRow className="mt-5">
                  <MDBCol
                    md="2"
                    className="d-flex justify-content-end align-items-center"
                  >
                    <h5>* Price</h5>
                  </MDBCol>
                  <MDBCol md="10">
                    <MDBInput label="Price" type="number" />
                  </MDBCol>
                </MDBRow>

                <MDBRow className="mt-5">
                  <MDBCol
                    md="2"
                    className="d-flex justify-content-end align-items-center"
                  >
                    <h5>* Variations</h5>
                  </MDBCol>
                  <MDBCol md="10">
                    <MDBBtn
                      color="white"
                      className="add-price-tier-button  d-flex align-items-center justify-content-center"
                      block
                      onClick={() => setEnableVariations(true)}
                    >
                      <MDBIcon icon="plus" className="blue-text" />
                      <span className="blue-text ">Enable Variations</span>
                    </MDBBtn>
                  </MDBCol>
                </MDBRow>
              </>
            ) : (
              <h2>Variations</h2>
            )}
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
}

export default Informations;
