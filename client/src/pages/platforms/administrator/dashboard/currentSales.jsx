import React from "react";
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBIcon,
  MDBProgress,
} from "mdbreact";

function CurrentSales() {
  return (
    <section className="mt-2">
      <MDBRow>
        <MDBCol xl="3" md="6" className="mb-4">
          <MDBCard>
            <MDBCardHeader color="primary-color">Yearly Sales</MDBCardHeader>
            <h6 className="ml-4 mt-5 dark-grey-text font-weight-bold">
              <MDBIcon icon="long-arrow-alt-up" className="blue-text mr-3" />{" "}
              2000
            </h6>
            <MDBCardBody>
              <MDBProgress value={45} barClassName="grey darken-2" />
              <p className="font-small grey-text">
                Better than last week (25%)
              </p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol xl="3" md="6" className="mb-4">
          <MDBCard>
            <MDBCardHeader color="warning-color">Monthly Sales</MDBCardHeader>
            <h6 className="ml-4 mt-5 dark-grey-text font-weight-bold">
              <MDBIcon icon="long-arrow-alt-up" className="blue-text mr-3" />$
              2000
            </h6>
            <MDBCardBody>
              <MDBProgress value={45} barClassName="grey darken-2" />
              <p className="font-small grey-text">
                Better than last week (25%)
              </p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol xl="3" md="6" className="mb-4">
          <MDBCard>
            <MDBCardHeader color="info-color">Weekly Sales</MDBCardHeader>
            <h6 className="ml-4 mt-5 dark-grey-text font-weight-bold">
              <MDBIcon icon="long-arrow-alt-down" className="red-text mr-3" />$
              2000
            </h6>
            <MDBCardBody>
              <MDBProgress value={45} barClassName="grey darken-2" />
              <p className="font-small grey-text">
                Better than last week (25%)
              </p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol xl="3" md="6" className="mb-4">
          <MDBCard>
            <MDBCardHeader color="danger-color">Daily Sales</MDBCardHeader>
            <h6 className="ml-4 mt-5 dark-grey-text font-weight-bold">
              <MDBIcon icon="long-arrow-alt-down" className="red-text mr-3" />$
              2000
            </h6>
            <MDBCardBody>
              <MDBProgress value={45} barClassName="grey darken-2" />
              <p className="font-small grey-text">
                Better than last week (25%)
              </p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </section>
  );
}

export default CurrentSales;
