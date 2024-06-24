import React from "react";
import { MDBModal, MDBModalBody, MDBIcon, MDBModalHeader } from "mdbreact";
import { fullName } from "../../../../../services/utilities";

export default function Remarks({ show, toggle, remarks, purchase }) {
  const handleClose = () => {
    toggle();
  };

  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      centered
      backdrop
      disableFocusTrap={false}
      size="lg"
    >
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        Remarks By {fullName(purchase?.requestBy?.fullName)}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <h5>{remarks || ""}</h5>
      </MDBModalBody>
    </MDBModal>
  );
}
