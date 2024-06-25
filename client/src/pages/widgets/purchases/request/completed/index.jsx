import { MDBCard, MDBCardBody, MDBCol, MDBRow } from "mdbreact";
import React from "react";
import CustomSelect from "../../../../../components/customSelect";

export const Completed = () => {
  return (
    <>
      <MDBRow className="ml-3  text-white">
        <MDBCol className="m-0 p-0">
          <div className="w-25">
            <CustomSelect
              className="m-0 p-0"
              inputClassName="text-center text-white m-0"
              preValue="--"
            />
            <h6 className="mb-2 p-0 text-center mt-1">Supplier</h6>
          </div>
        </MDBCol>
      </MDBRow>
      <MDBCard>
        <MDBCardBody></MDBCardBody>
      </MDBCard>
    </>
  );
};
