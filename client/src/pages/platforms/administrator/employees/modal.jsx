import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
  MDBRow,
  MDBCol,
  MDBTypography,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import {
  SAVE,
  UPDATE,
} from "../../../../services/redux/slices/administrator/employees";
import { isEqual } from "lodash";
import CustomSelect from "../../../../components/customSelect";
import Swal from "sweetalert2";
import { isValid } from "../../../../services/utilities";

const _form = {
  fullName: {
    fname: "",
    mname: "",
    lname: "",
  },
  role: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Modal({
  show,
  toggle,
  selected,
  willCreate,
  collections,
}) {
  const { token } = useSelector(({ auth }) => auth),
    [isDuplicate, setIsDuplicate] = useState(false),
    [form, setForm] = useState(_form),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  useEffect(() => {
    if (!willCreate && selected._id) setForm(selected);
  }, [willCreate, selected]);

  useEffect(() => {
    if (form.email) {
      setIsDuplicate(isValid(collections, form.email, "email"));
    }
  }, [form, collections]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!willCreate) {
      if (isEqual(form, selected)) {
        addToast("No changes found, skipping update.", {
          appearance: "info",
        });
      } else {
        dispatch(
          UPDATE({
            data: form,
            token,
          })
        );
      }
    } else {
      const { password, confirmPassword } = form;
      if (password !== confirmPassword)
        return Swal.fire({
          title: "Password Mismatch",
          text: "Your password and confirmation password do not match. Please try again.",
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Try Again",
        });
      dispatch(SAVE({ data: form, token }));
    }

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Successfully added employee!",
      showConfirmButton: false,
      timer: 1500,
    });

    setForm(_form);
    toggle();
  };

  const handleClose = () => {
    setForm(_form);
    toggle();
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="lg">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {!willCreate ? "Update" : "Create"} a Employee
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol md="4">
              <MDBInput
                type="text"
                label="First Name"
                value={form.fname}
                required
                onChange={(e) =>
                  setForm({
                    ...form,
                    fullName: { ...form.fullName, fname: e.target.value },
                  })
                }
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                type="text"
                label="Middle Name"
                value={form.mname}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fullName: { ...form.fullName, mname: e.target.value },
                  })
                }
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                type="text"
                label="Last Name"
                required
                value={form.lname}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fullName: { ...form.fullName, lname: e.target.value },
                  })
                }
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="12">
              <CustomSelect
                choices={["STOCKMAN", "CASHIER", "STAFF"]}
                label={"Role"}
                onChange={(value) => setForm({ ...form, role: value })}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="12">
              <MDBInput
                type="email"
                label="Email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="12">
              <MDBInput
                type="password"
                label="Password"
                value={form.password}
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </MDBCol>
          </MDBRow>

          <MDBRow className="d-flex align-items-center">
            <MDBCol md="12">
              <MDBInput
                type="password"
                label="Confirm Password"
                value={form.confirmPassword}
                required
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
            </MDBCol>
          </MDBRow>

          <div
            className={`d-flex justify-content-${
              isDuplicate ? "between" : "end"
            } mb-1-half mt-4 align-items-center`}
          >
            {isDuplicate && (
              <MDBTypography
                variant="h2"
                className="mb-0 text-black-50"
                noteColor="danger"
                note
                noteTitle="Warning: "
              >
                Sorry But this email is Already Exist
              </MDBTypography>
            )}
            <MDBBtn
              type="submit"
              disabled={isDuplicate}
              color="primary"
              className="mb-2 float-right"
            >
              {!willCreate ? "Update" : "Submit"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
