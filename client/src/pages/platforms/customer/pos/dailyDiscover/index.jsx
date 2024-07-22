import React from "react";
import { MDBCard, MDBCardBody } from "mdbreact";

const DailyDiscover = () => {
  return (
    <div className="mt-3 daily-discover">
      <div className="d-flex justify-content-center">
        <div className="w-75">
          <MDBCard
            style={{ borderBottom: "5px solid red" }}
            className="boxshadow-none"
          >
            <MDBCardBody>
              <h6 className="text-center text-danger">DAILY DISCOVER</h6>
            </MDBCardBody>
          </MDBCard>
        </div>
      </div>
    </div>
  );
};

export default DailyDiscover;
