import React, { useState } from "react";
import "./cart-btn.css";
import {
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBCard,
  MDBCardBody,
  MDBPopover,
  MDBPopoverBody,
  MDBBtn,
} from "mdbreact";
import Profile from "../profile";
import { ENDPOINT, variation } from "../../../../../services/utilities";

export const Header = ({ cart, setIsShowCart }) => {
  const [id, setID] = useState(-1);

  return (
    <MDBCard style={{ position: "sticky", top: "0", zIndex: "1000" }}>
      <MDBCardBody className="bg-danger m-0 p-0 ">
        <Profile />

        <MDBRow className="d-flex align-items-center justify-content-center   mb-3">
          <MDBCol md="9">
            <MDBRow className="d-flex align-items-center justify-content-center">
              <MDBCol md="12" className="d-flex align-items-center">
                <MDBIcon
                  icon="shopping-bag"
                  size="3x"
                  style={{ color: "white" }}
                  className="mr-2"
                />
                <h4 className="mt-3 text-white text-nowrap">
                  LIBERTY'S HARDWARE
                </h4>
                <div className="input-container ml-3">
                  <input
                    className="form-control input"
                    style={{ height: "50px" }}
                    placeholder="Search..."
                  />
                  <select className="form-select bg-light">
                    <option>All</option>
                    <option>Hardware Supplies</option>
                    <option>Farnitures</option>
                  </select>
                </div>
                <div
                  onMouseLeave={() => setID((prev) => prev + 1)}
                  className="p-2 mr-5"
                >
                  <MDBPopover
                    placement="bottom"
                    popover
                    id={`popover-${id}`}
                    key={id}
                  >
                    <MDBBtn
                      className="d-flex align-items-center cart-pop-over-btn mr-2"
                      size="sm"
                      onClick={() => setIsShowCart(true)}
                      id={`btn-pop-over-${id}`}
                    >
                      <MDBIcon
                        icon="shopping-cart"
                        size="2x"
                        style={{ color: "white" }}
                        className="mr-3 ml-3 cursor-pointer"
                      />
                      <span className="counter mt-3">
                        {cart.length > 0 && cart.length}
                      </span>
                    </MDBBtn>
                    <MDBPopoverBody
                      className="cart-popover-body"
                      id={`pop-body-${id}`}
                    >
                      {cart.slice(0, 5).map((obj, index) => {
                        const { product } = obj;
                        const { media } = product;
                        return (
                          <MDBRow
                            key={index}
                            className={`d-flex align-items-center  ${
                              index > 0 && "mt-4"
                            }`}
                          >
                            <MDBCol
                              className="d-flex align-items-center"
                              md="10"
                            >
                              <img
                                src={`${ENDPOINT}/assets/products/${product._id}/${media.product[0].label}.jpg`}
                                height={"50px"}
                                alt={`${product.name}`}
                              />
                              <h6
                                style={{
                                  maxWidth: "300px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                                className="font-weight-bold ml-2 text-dark"
                              >
                                {product.name}
                              </h6>
                            </MDBCol>
                            <MDBCol md="2">
                              <h5 className="text-danger ">
                                ₱{variation.getTheSubTotal("srp", obj, product)}{" "}
                              </h5>
                            </MDBCol>
                          </MDBRow>
                        );
                      })}
                      <MDBRow className="d-flex align-items-center mt-4">
                        <MDBCol md="6">
                          <h6>{cart.length} Products In Cart </h6>
                        </MDBCol>
                        <MDBCol md="6" className="d-flex justify-content-end">
                          <MDBBtn
                            size="sm"
                            className="p-2"
                            color="danger"
                            onClick={() => setIsShowCart(true)}
                          >
                            View My Shopping Cart
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>
                    </MDBPopoverBody>
                  </MDBPopover>
                </div>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBCardBody>
    </MDBCard>
  );
};
