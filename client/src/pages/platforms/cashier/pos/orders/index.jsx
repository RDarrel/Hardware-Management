import React, { useState } from "react";
import { useEffect } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBPopover,
  MDBPopoverBody,
} from "mdbreact";
import { ENDPOINT, variation } from "../../../../../services/utilities";
import OrderType from "./orderType";
import Variations from "../../../../widgets/variations";
import "./order.css";

const Orders = ({ orders }) => {
  const [total, setTotal] = useState(0),
    [orderDetails, setOrderDetails] = useState([]),
    [variant1, setVariant1] = useState(""),
    [variant2, setVariant2] = useState(""),
    [popoverKey, setPopOverKey] = useState(1);

  useEffect(() => {
    handleComputeTotal(orders);
  }, [orders]);

  const handleComputeTotal = (_orders) => {
    const orersWihtSubtotal = _orders.map((obj) => ({
      ...obj,
      subtotal: variation.getTheSubTotal("srp", obj, obj.product),
      srp: variation.getTheCapitalOrSrp("srp", obj, obj.product),
    }));
    const _total = orersWihtSubtotal.reduce((accumulator, currentValue) => {
      return (accumulator += currentValue.subtotal);
    }, 0);
    setOrderDetails(orersWihtSubtotal);
    setTotal(_total);
  };

  const handleChange = (index, value, isPerkilo = false) => {
    const _orders = [...orderDetails];
    if (isPerkilo) {
      _orders[index].kilo = Number(value);
    } else {
      _orders[index].quantity = Number(value);
    }
    setOrderDetails(_orders);
    handleComputeTotal(_orders);
  };

  const handleChangeGrams = (index, value) => {
    const _orders = [...orderDetails];
    _orders[index].kiloGrams = Number(value);
    setOrderDetails(_orders);
    handleComputeTotal(_orders);
  };

  const handleClose = () => {
    setPopOverKey((prevKey) => prevKey + 1);
  };

  const handleUpdateVariant = () => {};

  return (
    <MDBCard
      className="vh-100 d-flex flex-column"
      style={{ position: "relative" }}
    >
      <MDBCardBody>
        <h5 className="font-weight-bold">
          Order Details{" "}
          {orderDetails.length > 1 ? `(${orderDetails.length})` : ""}
        </h5>
        <hr />
        <div className="order-details">
          {orders.length === 0 && (
            <p className="text-center">No items in cart</p>
          )}
          {orderDetails.map((item, index) => (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between mb-2"
            >
              <div className="d-flex align-items-center">
                <img
                  src={`${ENDPOINT}/assets/products/${item.product._id}/${item.product.media.product[0].label}.jpg`}
                  height={"50px"}
                  alt={`${item.product.name}`}
                />
                <div
                  style={{
                    width: "220px",
                  }}
                >
                  <span
                    className="text-truncate ml-1 font-weight-bold"
                    style={{ width: "100%", display: "block" }}
                  >
                    {item.product.name}
                  </span>
                  {item.product.hasVariant && (
                    <MDBPopover
                      placement="bottom"
                      popover
                      clickable
                      id={`popover-${index}`}
                      key={popoverKey}
                    >
                      <MDBBtn
                        className="pop-over-btn-order ml-2"
                        id={`btn-pop-over-${index}`}
                      >
                        <span>Variations:</span>
                        <br />
                        <span>
                          {variation.getTheVariant(
                            item.variant1,
                            item.variant2 || "",
                            item.product.variations
                          )}
                        </span>
                      </MDBBtn>
                      <MDBPopoverBody
                        className="popover-body-order"
                        id={`pop-body-${index}`}
                      >
                        <Variations
                          isCart={true}
                          has2Variant={item.product.hasVariant}
                          variations={item.product.variations}
                          variant1={variant1 || item.variant1}
                          setVariant1={setVariant1}
                          variant2={variant2 || item.variant2}
                          setVariant2={setVariant2}
                        />
                        <MDBRow className="mt-5">
                          <MDBCol
                            md="6"
                            className="d-flex justify-content-center"
                          >
                            <MDBBtn color="white" onClick={handleClose}>
                              Cancel
                            </MDBBtn>
                          </MDBCol>
                          <MDBCol
                            md="6"
                            className="d-flex justify-content-center"
                          >
                            <MDBBtn
                              color="danger"
                              onClick={() =>
                                handleUpdateVariant(
                                  {
                                    variant1: variant1 || item?.variant1,
                                    variant2: variant2 || item?.variant2,
                                    has2Variant: item.product.has2Variant,
                                  },
                                  {
                                    variant1: item.variant1,
                                    variant2: item.variant2,
                                  }
                                )
                              }
                            >
                              Confirm
                            </MDBBtn>
                          </MDBCol>
                        </MDBRow>
                      </MDBPopoverBody>
                    </MDBPopover>
                  )}
                </div>
              </div>
              <OrderType
                item={item}
                index={index}
                handleChange={handleChange}
                handleChangeGrams={handleChangeGrams}
              />
              <span>
                ₱{variation.getTheCapitalOrSrp("srp", item, item.product)}
              </span>
              <MDBBtn color="danger" rounded size="sm">
                <MDBIcon icon="trash" />
              </MDBBtn>
            </div>
          ))}
        </div>

        <div className="transac">
          <hr className="dotted" />
          <div className="mb-3 bg-light p-1">
            <div className="d-flex justify-content-between m-1">
              <h6 className="ml-1 mt-1">Invoice No.</h6>
              <h6 className="ml-1 mt-1">LH10232223</h6>
            </div>
            <div className="d-flex justify-content-between m-1">
              <h6 className="ml-1 mt-1">Subtotal</h6>
              <h6 className="text-danger">250.00</h6>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <h4 className="font-weight-bold">Total</h4>
            <h4 className="text-danger">₱{total ? total : "--"}</h4>
          </div>
          <MDBBtn
            color="primary"
            size="sm"
            block
            className="d-flex justify-content-center"
          >
            <div className="d-flex ">
              <h5 className="text-white mr-2 font-weight-bold "> Paid</h5>
              <MDBIcon icon="money-bill" className="paid-icon" size="2x" />
            </div>
          </MDBBtn>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default Orders;
