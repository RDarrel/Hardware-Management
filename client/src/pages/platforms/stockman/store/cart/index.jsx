import React from "react";
import {
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBBtn,
  MDBIcon,
  MDBModalFooter,
} from "mdbreact";

const Cart = ({ show, toggle }) => {
  return (
    <MDBModal
      isOpen={show}
      toggle={() => toggle()}
      size="lg"
      className="modal-notify modal-primary"
      fullHeight
      position="right"
    >
      <MDBModalHeader tag="p" toggle={() => toggle()} titleClass="heading lead">
        <MDBIcon icon="shopping-cart" className="mr-2" />
        Shoppping Cart
      </MDBModalHeader>
      <MDBModalBody></MDBModalBody>
      <MDBModalFooter className="d-flex justify-content-end">
        <MDBBtn color="primary" outline>
          <span>
            23
            <i className="fas fa-long-arrow-alt-right ms-2"></i>
          </span>
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  );
};

export default Cart;
