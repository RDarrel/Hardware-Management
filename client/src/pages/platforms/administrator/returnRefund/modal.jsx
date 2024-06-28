import React from "react";
import { MDBModal, MDBModalBody, MDBIcon, MDBModalHeader } from "mdbreact";
import { fullName } from "../../../../services/utilities";

export default function Modal({ show, toggle, reason, obj, baseKey }) {
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
        tag="h5"
      >
        <MDBIcon icon="user" className="mr-2" />
        Reason By: {fullName(obj[baseKey]?.fullName)}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <h5>{reason || ""}</h5>
      </MDBModalBody>
    </MDBModal>
  );
}
