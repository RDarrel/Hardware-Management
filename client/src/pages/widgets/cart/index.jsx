import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import "./table.css";

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
import { transaction, variation } from "../../../services/utilities";
import formattedTotal from "../../../services/utilities/forattedTotal";

const Cart = ({
  show,
  toggle,
  collections,
  isCustomer = false,
  suppliers,
  disabledButtons = false,
  setIsCheckout = () => {},
  setCheckOutProducts: baseCheckoutProducts = () => {},
}) => {
  const [isCheckAll, setIsCheckAll] = useState(true),
    [checkOutProducts, setCheckOutProducts] = useState([]),
    [cart, setCart] = useState([]),
    dispatch = useDispatch(),
    history = useHistory();

  useEffect(() => {
    setCart(collections);
    setCheckOutProducts((prevProducts) =>
      isCustomer && prevProducts.length === 0 ? [] : collections
    );
  }, [collections, isCustomer]);

  useEffect(() => {
    setCheckOutProducts([]);
  }, [show]);

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
    if (isCustomer) {
      setIsCheckout(true);
      baseCheckoutProducts(checkOutProducts);
      // dispatch(CHECKOUT(checkOutProducts));
      // history.push("pos/checkout");
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
      // className={`modal-notify ${!isCustomer && "modal-primary"} `}
      className={`modal-notify modal-primary`}
      fullHeight
      position="right"
      animation="top"
    >
      <MDBModalHeader
        tag="p"
        toggle={() => toggle()}
        titleClass="heading lead"
        // className={isCustomer ? "bg-red" : ""}
      >
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
            isCustomer={isCustomer}
            checkOutProducts={checkOutProducts}
            handleActionInCheckOut={handleActionInCheckOut}
            disabledButtons={disabledButtons}
          />
        ) : (
          <h6 className="text-center">No Cart</h6>
        )}
      </MDBModalBody>
      <MDBModalFooter
        className={`fixed-footer d-flex justify-content-${
          isCustomer ? "between" : "end"
        }  align-items-center`}
      >
        {isCustomer && (
          <div className="d-flex align-items-center mt-1">
            <div className="d-flex align-items-center">
              <input
                className="form-check-input"
                type="checkbox"
                checked={isCheckAll}
                id="checkbox"
                onChange={() => handleChangeSelectAll(!isCheckAll)}
              />
              <label
                htmlFor="checkbox"
                className="form-check-label mr-2 label-table"
              >
                Select All ({checkOutProducts.length})
              </label>
            </div>
          </div>
        )}
        <div className="d-flex justify-content-end align-items-center mt-2">
          {isCustomer && (
            <div className="d-flex align-items-center mr-2 mt-2">
              <h6>Total ({checkOutProducts.length} item): </h6>
              <h4 className=" ml-1 ">
                ₱
                {formattedTotal(
                  Number(
                    transaction.getTotal(
                      checkOutProducts.map((c) => {
                        return {
                          ...c,
                          srp: variation.getTheCapitalOrSrp(
                            "srp",
                            c,
                            c.product
                          ),
                        };
                      })
                    )
                  )
                )}
              </h4>
            </div>
          )}
          <MDBBtn
            // color={!isCustomer ? "primary" : "danger"}
            color={"primary"}
            outline={!isCustomer}
            onClick={handleCheckOut}
            disabled={checkOutProducts.length === 0}
          >
            <span>
              {!isCustomer ? "Request" : "Proceed"}
              <i className="fas fa-long-arrow-alt-right ms-2 ml-2"></i>
            </span>
          </MDBBtn>
        </div>
      </MDBModalFooter>
    </MDBModal>
  );
};

export default Cart;
