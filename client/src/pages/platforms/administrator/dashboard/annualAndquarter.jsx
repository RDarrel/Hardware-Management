import { MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBRow } from "mdbreact";
import React from "react";
import CustomSelect from "../../../../components/customSelect";

const AnnualAndQuarter = () => {
  return (
    <MDBRow className="mb-5">
      <MDBCol md="4">
        <MDBCard>
          <MDBCardHeader color="info-color">Monthly</MDBCardHeader>
          <MDBCardBody>
            <CustomSelect choices={["January"]} preValue="January" />
            <div className="d-flex align-items-center justify-content-between">
              <h6 className="font-weight-bold"> Sales: ₱5000</h6>
              <h6 className="font-weight-bold"> Income: ₱5000</h6>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol md="4">
        <MDBCard>
          <MDBCardHeader color="primary-color">Quarterly</MDBCardHeader>

          <MDBCardBody>
            <CustomSelect
              choices={["1st - January to April", "2nd - March to April"]}
              preValue="1st - January to April"
            />
            <div className="d-flex align-items-center justify-content-between">
              <h6 className="font-weight-bold"> Sales: ₱5000</h6>
              <h6 className="font-weight-bold"> Income: ₱5000</h6>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol md="4">
        <MDBCard>
          <MDBCardHeader color="warning-color">Annualy</MDBCardHeader>
          <MDBCardBody>
            <CustomSelect choices={["2024"]} preValue="2024" />
            <div className="d-flex align-items-center justify-content-between">
              <h6 className="font-weight-bold"> Sales: ₱5000</h6>
              <h6 className="font-weight-bold"> Income: ₱5000</h6>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
};

export default AnnualAndQuarter;
