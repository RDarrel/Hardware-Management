import React from "react";
import { MDBModal, MDBModalBody, MDBIcon, MDBModalHeader } from "mdbreact";
import { fullName } from "../../../../../services/utilities";

export default function Remarks({
  show,
  toggle,
  remarks,
  purchase,
  isRejected,
  isAdmin,
}) {
  const handleClose = () => {
    toggle();
  };
  const handleTitle = () => {
    if (!isRejected) {
      return ` Remarks By ${fullName(purchase?.requestBy?.fullName)}`;
    }

    if (isRejected && isAdmin) {
      return `Reason For: ${fullName(purchase?.requestBy?.fullName)}`;
    }

    if (isRejected && !isAdmin) {
      return `Reason`;
    }
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
        <MDBIcon icon="comments" className="mr-2" /> {handleTitle()}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <h5>{remarks || ""}</h5>
      </MDBModalBody>
    </MDBModal>
  );
}
