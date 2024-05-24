import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
} from "mdbreact";
import { UPDATE } from "../../../../../services/redux/slices/users";

export default function Modal({ show, toggle, selected }) {
  const { collections } = useSelector(({ roles }) => roles),
    { isLoading } = useSelector(({ users }) => users),
    { token } = useSelector(({ auth }) => auth),
    [role, setRole] = useState(""),
    dispatch = useDispatch();

  const handleUpdate = () => {
    if (role && role !== selected.role?._id) {
      dispatch(
        UPDATE({
          data: { _id: selected._id, role },
          token,
        })
      );
    }

    toggle();
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
        Update <b>{selected.email}</b> Role
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBSelect
          getValue={e => setRole(e[0])}
          className="colorful-select dropdown-primary hidden-md-down"
          label="Role"
        >
          <MDBSelectInput />
          <MDBSelectOptions>
            {collections.map((item, index) => {
              const isSelected = item._id === selected.role?._id;

              return (
                <MDBSelectOption
                  selected={isSelected}
                  key={`role-${index}`}
                  value={item._id}
                >
                  {item.name}
                </MDBSelectOption>
              );
            })}
          </MDBSelectOptions>
        </MDBSelect>
        <div className="text-center mb-1-half">
          <MDBBtn
            disabled={isLoading}
            color="info"
            className="mb-2"
            rounded
            onClick={handleUpdate}
          >
            update
          </MDBBtn>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
