import React from "react";
import { MDBCard, MDBCardBody } from "mdbreact";

import "./loginPage.css";

const Card = ({ isLogin, setIsLogin }) => {
  return (
    <MDBCard
      className={`bg-primary ${isLogin ? "radius-left" : "radius-right"}`}
      style={{ height: "400px" }}
    >
      <MDBCardBody>
        <div className="d-flex flex-column  justify-content-center h-100 align-items-center">
          <h3 className="font-weight-bold text-white">Welcome Back!</h3>
          {isLogin ? (
            <>
              <span className="text-white mt-2">
                Register with your personal details to use all
              </span>
              <span className="text-white">of site features</span>
            </>
          ) : (
            <>
              <span className="text-white mt-2 ">
                Enter your personal details to use all of site
              </span>
              <span className="text-white"> features</span>
            </>
          )}
          <button
            className="btn-signup"
            type="button"
            onClick={() => setIsLogin(!isLogin)}
          >
            <span className="text-white">
              {isLogin ? "SIGN UP" : "SIGN IN"}
            </span>
          </button>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default Card;
