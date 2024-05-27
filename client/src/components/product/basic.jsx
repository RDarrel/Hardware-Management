import React from "react";
import { MDBRow, MDBCol, MDBCardBody, MDBCard, MDBInput } from "mdbreact";
import { categories } from "../../services/fakeDb";

function Basic() {
  return (
    <MDBRow>
      <MDBCol md="12">
        <MDBCard>
          <MDBCardBody>
            <h4 className="font-weight-bold">Basic Information</h4>
            <MDBRow className="mt-5">
              <MDBCol
                md="2"
                className="d-flex justify-content-end align-items-center"
              >
                <h5>* Product Name</h5>
              </MDBCol>
              <MDBCol md="10">
                <MDBInput label="Product Name" />
              </MDBCol>
            </MDBRow>
            <MDBRow className="mt-5">
              <MDBCol
                md="2"
                className="d-flex justify-content-end align-items-center"
              >
                <h5>* Product Description</h5>
              </MDBCol>
              <MDBCol md="10">
                <MDBInput label="Description" type="textarea" />
              </MDBCol>
            </MDBRow>
            <MDBRow className="mt-5">
              <MDBCol
                md="2"
                className="d-flex justify-content-end align-items-center"
              >
                <h5>* Category</h5>
              </MDBCol>
              <MDBCol md="10">
                <select
                  className="form-control"
                  style={{ height: 50, borderRadius: 20 }}
                >
                  {categories.map((categorie, index) => (
                    <option value={categorie} key={index}>
                      {categorie}
                    </option>
                  ))}
                </select>
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
}

export default Basic;
