import React from "react";
import { MDBBtn, MDBCard, MDBCardBody, MDBIcon, MDBInputGroup } from "mdbreact";
import { ENDPOINT } from "../../../../../services/utilities";

const Orders = ({ orders }) => {
  return (
    <MDBCard className="vh-100 d-flex flex-column">
      <MDBCardBody>
        <h5 className="font-weight-bold">Order Details (8)</h5>
        <hr />
        <div className="order-details">
          {orders.length === 0 && (
            <p className="text-center">No items in cart</p>
          )}
          {orders.map((item, index) => (
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
                <span className="text-truncate" style={{ width: "220px" }}>
                  {item.product.name}
                </span>
              </div>
              <MDBInputGroup
                type="number"
                className="text-center border border-light"
                style={{ width: "30%", height: "30%" }}
                min="1"
                size="sm"
                prepend={
                  <MDBBtn
                    className="m-0 px-2 py-0"
                    size="sm"
                    color="light"
                    style={{ boxShadow: "0px 0px 0px 0px" }}
                    outline
                  >
                    <MDBIcon icon="minus" style={{ color: "black" }} />
                  </MDBBtn>
                }
                append={
                  <MDBBtn
                    className="m-0 px-2  py-0"
                    size="sm"
                    color="light"
                    style={{ boxShadow: "0px 0px 0px 0px" }}
                    outline
                  >
                    <MDBIcon icon="plus" style={{ color: "black" }} />
                  </MDBBtn>
                }
              />
              <span>₱{item.product.srp}</span>
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
            <h4 className="text-danger">₱800.00</h4>
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
