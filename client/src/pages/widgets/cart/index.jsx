import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

import { CHECKOUT } from "../../../services/redux/slices/cart";
import {
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBBtn,
  MDBIcon,
  MDBModalFooter,
} from "mdbreact";
import Table from "./table";
import { useDispatch } from "react-redux";

const Cart = ({ show, toggle, collections, isCashier = false, suppliers }) => {
  const [isCheckAll, setIsCheckAll] = useState(true),
    [checkOutProducts, setCheckOutProducts] = useState([]),
    [cart, setCart] = useState([]),
    dispatch = useDispatch(),
    history = useHistory();

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

  const handleCheckOut = () => {
    if (isCashier) {
      dispatch(CHECKOUT(checkOutProducts));
      history.push("pos/checkout");
    } else {
      dispatch(CHECKOUT(checkOutProducts));
      history.push("/checkout");
    }
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
        {cart.length > 0 ? (
          <Table
            cart={cart}
            suppliers={suppliers}
            handleChangeSelectAll={handleChangeSelectAll}
            isCheckAll={isCheckAll}
            isCashier={isCashier}
            checkOutProducts={checkOutProducts}
            handleActionInCheckOut={handleActionInCheckOut}
          />
        ) : (
          <h6 className="text-center">No Cart</h6>
        )}
      </MDBModalBody>
      <MDBModalFooter className="d-flex justify-content-end  fixed-footer">
        <MDBBtn
          color="primary"
          outline
          onClick={handleCheckOut}
          disabled={cart.length === 0}
        >
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
