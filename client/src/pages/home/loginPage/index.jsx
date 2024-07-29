import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBContainer,
  MDBInput,
} from "mdbreact";
import React, { useEffect, useState } from "react";
import logo from "../../../assets/logo/navbar.jpg";
import Swal from "sweetalert2";
import { useHistory, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN, RESET, SETROUTE } from "../../../services/redux/slices/auth";
import { SAVE } from "../../../services/redux/slices/users";

const _form = { email: "", confirmPassword: "", password: "" };

export default function LoginPage() {
  const {
      auth,
      isSuccess,
      message: baseMessage = "",
      role,
    } = useSelector(({ auth }) => auth),
    { message: userMessage, isSuccess: isSuccessRegister } = useSelector(
      ({ users }) => users
    ),
    [form, setForm] = useState({}),
    [message, setMessage] = useState([]),
    [isLogin, setIsLogin] = useState(true),
    history = useHistory(),
    location = useLocation(),
    dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) return dispatch(LOGIN(form));
    const { password, confirmPassword } = form;
    if (password !== confirmPassword) {
      setMessage("Password and Confirm Password do not match.");
    } else {
      dispatch(
        SAVE({
          ...form,
          role: "CUSTOMER",
        })
      );
    }
  };

  useEffect(() => {
    setMessage(baseMessage || userMessage);
  }, [baseMessage, userMessage]);

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
    setForm(_form);
  }, [isLogin]);

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

  const handleChange = (target, key) =>
    setForm({ ...form, [key]: target.value });
  return (
    <MDBContainer
      fluid
      className="vh-100 d-flex justify-content-center align-items-center"
    >
      <div className="w-50 d-flex justify-content-center">
        <MDBCard className="w-50">
          <MDBCardBody>
            <form onSubmit={handleSubmit}>
              <div className="d-flex justify-content-center">
                <MDBCardImage src={logo} style={{ height: "110px" }} />
              </div>
              <h4 className="text-center font-weight-bolder">
                Liberty Hardware
              </h4>
              <MDBInput
                label="Email"
                required
                type="email"
                icon="envelope"
                value={form.email}
                onChange={({ target }) => handleChange(target, "email")}
              />
              <MDBInput
                label="Password"
                icon="lock"
                required
                type="password"
                value={form.password}
                onChange={({ target }) => handleChange(target, "password")}
              />
              {!isLogin && (
                <MDBInput
                  required
                  label="Confirm Password"
                  type="password"
                  icon="lock"
                  value={form.confirmPassword}
                  onChange={({ target }) =>
                    handleChange(target, "confirmPassword")
                  }
                />
              )}
              {message && (
                <div
                  className={`text-nowrap alert alert-${
                    isSuccess ? "success" : "warning"
                  } text-center`}
                >
                  {message}
                </div>
              )}
              <MDBBtn color="info" block rounded type="submit">
                {isLogin ? " SIGIN IN" : "REGISTER"}
              </MDBBtn>
              <h6 className="text-center mt-4">
                {isLogin
                  ? " Do you have an account"
                  : "Already have an account"}
                ? &nbsp;
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  style={{
                    padding: 0,
                    border: "none",
                    background: "none",
                    textDecoration: "none",
                    color: "blue",
                    cursor: "pointer",
                  }}
                  type="button"
                >
                  {isLogin ? "Create account" : "Login"}
                </button>
              </h6>
            </form>
          </MDBCardBody>
        </MDBCard>
      </div>
    </MDBContainer>
  );
}
