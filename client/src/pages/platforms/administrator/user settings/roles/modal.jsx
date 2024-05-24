import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
} from "mdbreact";
import { SAVE, UPDATE } from "../../../../../services/redux/slices/roles";

export default function Modal({ show, toggle, selected, willCreate }) {
  const { isLoading } = useSelector(({ roles }) => roles),
    { token } = useSelector(({ auth }) => auth),
    [form, setForm] = useState({
      name: "",
    }),
    dispatch = useDispatch();

  const handleUpdate = () => {
    if (form.name && form.name !== selected.name) {
      dispatch(
        UPDATE({
          data: { ...form, _id: selected._id },
          token,
        })
      );
    }

    setForm({
      name: "",
    });
    toggle();
  };

  const handleCreate = () => {
    dispatch(
      SAVE({
        data: { ...form, _id: selected._id },
        token,
      })
    );

    setForm({
      name: "",
    });
    toggle();
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (willCreate) {
      handleCreate();
    } else {
      handleUpdate();
    }
  };

  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop={true}
      disableFocusTrap={false}
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} {selected.name || "a Role"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBInput
            type="text"
            label="Name"
            value={willCreate ? form.name : form.name || selected.name}
            onChange={e =>
              setForm({ ...form, name: e.target.value.toUpperCase() })
            }
            required
            icon="user-shield"
          />
          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={isLoading}
              color="info"
              className="mb-2"
              rounded
            >
              {willCreate ? "submit" : "update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
