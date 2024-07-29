import React, { useEffect, useState } from "react";
import {
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBBtn,
  MDBInput,
} from "mdbreact";
import { CHANGE_PASSWORD, RESET } from "../../../services/redux/slices/auth";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";

const ChangePassword = () => {
  const { auth, token, message } = useSelector(({ auth }) => auth),
    [form, setForm] = useState({}),
    dispatch = useDispatch();

  const handleChange = (target, key) =>
    setForm({ ...form, [key]: target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = form;
    if (newPassword !== confirmPassword) {
      return Swal.fire({
        title:
          " <h4 class='mt-3'>Password and Confirm Password do not match.</h4>",
        icon: "warning",
      });
    }

    dispatch(CHANGE_PASSWORD({ token, data: { ...form, _id: auth._id } }));
  };

  useEffect(() => {
    if (message) {
      Swal.fire({
        title: `<h4 class='mt-3'>${message}</h4>`,
        icon: "warning",
      });
    }
    return () => dispatch(RESET());
  }, [message, dispatch]);

  return (
    <MDBCol>
      <MDBCard>
        <MDBCardHeader color="white">
          <span className="text-dark font-weight-bold">Change Password</span>
        </MDBCardHeader>
        <MDBCardBody>
          <form onSubmit={handleSubmit}>
            <MDBInput
              label="Old Password"
              value={form.oldPassword}
              type="password"
              required
              onChange={({ target }) => handleChange(target, "oldPassword")}
            />
            <MDBInput
              label="New Password"
              value={form.newPassword}
              type="password"
              required
              onChange={({ target }) => handleChange(target, "newPassword")}
            />
            <MDBInput
              label="Confirm Password"
              required
              type="password"
              value={form.confirmPassword}
              onChange={({ target }) => handleChange(target, "confirmPassword")}
            />
            <div className="d-flex justify-content-center">
              <MDBBtn color="info" rounded type="submit" size="md">
                Apply
              </MDBBtn>
            </div>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default ChangePassword;
