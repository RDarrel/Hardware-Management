import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE } from "../../../../services/redux/slices/administrator/employees";

import CustomSelect from "../../../../components/customSelect";
import Swal from "sweetalert2";

export default function Role({ show, toggle, selected }) {
  const { token } = useSelector(({ auth }) => auth),
    [role, setRole] = useState(""),
    dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(UPDATE({ token, data: { role, _id: selected._id } }));
    toggle();
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Successfully changed role!",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleClose = () => {
    toggle();
  };

  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      disableFocusTrap={false}
      size="md"
    >
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="key" className="mr-2" />
        Change Role
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <CustomSelect
          choices={["STOCKMAN", "CASHIER"]}
          label={"Role"}
          preValue={selected?.role}
          onChange={(value) => setRole(value)}
        />
        <MDBBtn className="float-right" color="primary" onClick={handleSubmit}>
          Submit
        </MDBBtn>
      </MDBModalBody>
    </MDBModal>
  );
}
