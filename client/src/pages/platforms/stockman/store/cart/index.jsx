import React, { useEffect, useState } from "react";
import {
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBBtn,
  MDBIcon,
  MDBModalFooter,
} from "mdbreact";
import Table from "./table";

const Cart = ({ show, toggle, collections }) => {
  const [isCheckAll, setIsCheckAll] = useState(true),
    [checkOutProducts, setCheckOutProducts] = useState([]),
    [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(collections);
    setCheckOutProducts(collections);
  }, [collections]);

  useEffect(() => {
    if (cart.length > 0) {
      if (cart.length !== checkOutProducts.length) {
        setIsCheckAll(false);
      }
    }
  }, [cart, checkOutProducts]);

  const handleActionInCheckOut = (newProduct) => {
    const copyOfCheckOut = [...checkOutProducts];
    const index = copyOfCheckOut.findIndex(
      (product) => product._id === newProduct._id
    );
    if (index > -1) {
      copyOfCheckOut.splice(index, 1);
    } else {
      copyOfCheckOut.push(newProduct);
    }

    setCheckOutProducts(copyOfCheckOut);
  };

  const handleChangeSelectAll = (value) => {
    setCheckOutProducts(value ? cart : []);
    setIsCheckAll(value);
  };
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
      <MDBModalBody>
        <Table
          cart={cart}
          handleChangeSelectAll={handleChangeSelectAll}
          isCheckAll={isCheckAll}
          checkOutProducts={checkOutProducts}
          handleActionInCheckOut={handleActionInCheckOut}
        />
      </MDBModalBody>
      <MDBModalFooter className="d-flex justify-content-end">
        <MDBBtn color="primary" outline>
          <span>
            Check Out
            <i className="fas fa-long-arrow-alt-right ms-2"></i>
          </span>
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  );
};

export default Cart;
