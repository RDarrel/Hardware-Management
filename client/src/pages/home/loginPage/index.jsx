import {
  MDBAnimation,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdbreact";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useHistory, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { RESET, SETROUTE } from "../../../services/redux/slices/auth";

import Form from "./form";
import Card from "./card";

export default function LoginPage() {
  const { auth, isSuccess, role } = useSelector(({ auth }) => auth),
    { isSuccess: isSuccessRegister } = useSelector(({ users }) => users),
    [isLogin, setIsLogin] = useState(true),
    history = useHistory(),
    location = useLocation(),
    dispatch = useDispatch();

  useEffect(() => {
    if (isSuccessRegister) {
      Swal.fire({
        title: "Successfully Registered!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setIsLogin(true);
    }
  }, [isSuccessRegister]);

  useEffect(() => {
    if (auth._id && isSuccess) {
      if (role === "CASHIER") {
        history.push("/pos");
        dispatch(RESET());
      } else if (role === "CUSTOMER") {
        history.push("/quotation");
        dispatch(RESET());
      } else {
        history.push("/dashboard");
        dispatch(SETROUTE("Dashboard"));
        dispatch(RESET());
      }
    }
  }, [auth, isSuccess, history, location, dispatch, role]);

  return (
    <MDBContainer
      fluid
      className="vh-100 d-flex justify-content-center align-items-center"
    >
      <div className="w-75 d-flex justify-content-center">
        <MDBCard className="w-75 base-card">
          <MDBCardBody className="m-0 p-0">
            <MDBRow>
              <MDBCol md="6">
                <MDBAnimation
                  reveal
                  type="fadeInRight"
                  key={isLogin ? "form" : "card"}
                >
                  {isLogin ? (
                    <Form isLogin={isLogin} setIsLogin={setIsLogin} />
                  ) : (
                    <Card isLogin={isLogin} setIsLogin={setIsLogin} />
                  )}
                </MDBAnimation>
              </MDBCol>
              <MDBCol md="6">
                <MDBAnimation
                  reveal
                  type="fadeInLeft"
                  key={isLogin ? "card" : "form"}
                >
                  {isLogin ? (
                    <Card isLogin={isLogin} setIsLogin={setIsLogin} />
                  ) : (
                    <Form setIsLogin={setIsLogin} />
                  )}
                </MDBAnimation>
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </div>
    </MDBContainer>
  );
}
