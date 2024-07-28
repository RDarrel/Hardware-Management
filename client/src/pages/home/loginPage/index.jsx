import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBContainer,
  MDBInput,
} from "mdbreact";
import React from "react";
import logo from "../../../assets/logo/navbar.jpg";

const LoginPage = () => {
  return (
    <MDBContainer
      fluid
      className="vh-100 d-flex justify-content-center align-items-center"
    >
      <div className="w-50 d-flex justify-content-center">
        <MDBCard className="w-50">
          <MDBCardBody>
            <div className="d-flex justify-content-center">
              <MDBCardImage src={logo} style={{ height: "120px" }} />
            </div>
            <h4 className="text-center font-weight-bold">Liberty Hardware</h4>
            <MDBInput label="Email" icon="envelope" />
            <MDBInput label="Password" icon="lock" />
            <MDBBtn color="primary" block>
              SIGIN IN
            </MDBBtn>
            <h6 className="text-center mt-4">
              Not a member? <a href="Register">Register</a>
            </h6>
          </MDBCardBody>
        </MDBCard>
      </div>
    </MDBContainer>
  );
};

export default LoginPage;
