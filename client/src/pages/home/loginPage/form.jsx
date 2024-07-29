import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN, RESET } from "../../../services/redux/slices/auth";
import {
  SAVE,
  RESET as RESET_USERMESSAGE,
} from "../../../services/redux/slices/users";
import { MDBBtn, MDBCardImage, MDBInput } from "mdbreact";

import logo from "../../../assets/logo/navbar.jpg";

const _form = { email: "", confirmPassword: "", password: "" };

const Form = ({ isLogin, setIsLogin }) => {
  const { message: baseMessage = "" } = useSelector(({ auth }) => auth),
    { message: userMessage, isSuccess: isSuccessRegister } = useSelector(
      ({ users }) => users
    ),
    [form, setForm] = useState({}),
    dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) return dispatch(LOGIN(form));
    const { password, confirmPassword } = form;
    if (password !== confirmPassword) {
      Swal.fire({
        title: `<h4>Password and Confirm Password do not match.</h4>`,
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else {
      dispatch(
        SAVE({
          ...form,
          role: "CUSTOMER",
        })
      );
    }

    handleClearMessage();
  };

  const handleClearMessage = useCallback(() => {
    dispatch(RESET_USERMESSAGE());
    dispatch(RESET());
  }, [dispatch]);

  useEffect(() => {
    const _message = baseMessage || userMessage;
    if (_message && _message !== "Login Success") {
      Swal.fire({
        title: `<h4>${_message}</h4>`,
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
    return () => handleClearMessage();
  }, [baseMessage, userMessage, handleClearMessage]);

  useEffect(() => {
    if (isSuccessRegister) {
      Swal.fire({
        title: "Successfully Registered!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setIsLogin(true);
    }
  }, [isSuccessRegister, setIsLogin]);

  useEffect(() => {
    setForm(_form);
  }, [isLogin]);

  const handleChange = (target, key) =>
    setForm({ ...form, [key]: target.value });
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "400px" }}
    >
      <div className="w-75 ">
        <form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-center">
            <MDBCardImage src={logo} style={{ height: "90px" }} />
          </div>
          <h4 className="text-center font-weight-bolder">Liberty Hardware</h4>
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
              onChange={({ target }) => handleChange(target, "confirmPassword")}
            />
          )}

          <div className="d-flex justify-content-center">
            <MDBBtn
              color="primary"
              type="submit"
              size="sm"
              className="btn-login"
            >
              {isLogin ? " SIGIN IN" : "SIGN UP"}
            </MDBBtn>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
