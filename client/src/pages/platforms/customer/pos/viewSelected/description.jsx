import React from "react";
import { MDBCard, MDBCardBody, MDBCol, MDBRow } from "mdbreact";
import GET from "./GET";
import { formattedDate } from "../../../../../services/utilities";
import capitalize from "../../../../../services/utilities/capitalize";

const Description = ({ selected = {}, safeRender }) => {
  return (
    <MDBRow className="mt-2">
      <MDBCol md="12">
        <MDBCard className="boxshadow-none">
          <MDBCardBody>
            <MDBRow className="bg-gray">
              <MDBCol>
                <h5 className="mt-2">Product Specifications</h5>
              </MDBCol>
            </MDBRow>
            <MDBRow className="mt-3">
              <MDBCol md="1">
                <h6 className=" grey-text text-start text-nowrap">Category</h6>
              </MDBCol>
              <MDBCol>
                <h6 className="ml-5 text-start">
                  {safeRender(
                    capitalize.firstLetter(selected?.category?.name)
                  ) || ""}
                </h6>
              </MDBCol>
            </MDBRow>
            <MDBRow className="mt-3">
              <MDBCol md="1">
                <h6 className=" grey-text text-start text-nowrap">Stock</h6>
              </MDBCol>
              <MDBCol>
                <h6 className="ml-5 text-start">
                  {selected.isPerKilo
                    ? GET.converterKilo(GET.totalStocks(selected))
                    : GET.totalStocks(selected)}
                </h6>
              </MDBCol>
            </MDBRow>
            <MDBRow className="mt-3">
              <MDBCol md="1">
                <h6 className=" grey-text text-start text-nowrap">Material</h6>
              </MDBCol>
              <MDBCol>
                <h6 className="ml-5 text-start">
                  {safeRender(
                    capitalize.firstLetter(selected?.material?.name)
                  ) || ""}
                </h6>
              </MDBCol>
            </MDBRow>
            {selected?.hasExpiration && (
              <MDBRow className="mt-3">
                <MDBCol md="1">
                  <h6 className=" grey-text text-start text-nowrap">
                    Expiration Date
                  </h6>
                </MDBCol>
                <MDBCol>
                  <h6 className="ml-5 text-start">
                    {formattedDate(safeRender(selected?.expirationDate)) || ""}
                  </h6>
                </MDBCol>
              </MDBRow>
            )}
            <MDBRow className="bg-gray mt-5">
              <MDBCol>
                <h5 className="mt-2">Product Description</h5>
              </MDBCol>
            </MDBRow>
            <h6 className="mt-3">{selected.description}</h6>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
};

export default Description;
