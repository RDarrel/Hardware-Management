import React from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTable,
} from "mdbreact";

export default function Received({ show, toggle }) {
  const handleClose = () => {
    toggle();
  };

  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      disableFocusTrap={false}
      size="fluid"
    >
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBTable>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Approved Quantity/kilo</th>
              <th>Received Quantity/kilo</th>
              <th>Defective Quantity/kilo</th>
              <th>Expiration Date</th>
            </tr>
          </thead>
        </MDBTable>
      </MDBModalBody>
    </MDBModal>
  );
}
