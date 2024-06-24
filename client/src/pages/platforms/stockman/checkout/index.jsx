import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { SUPPLIERS, BUY } from "../../../../services/redux/slices/cart";
import { variation } from "../../../../services/utilities";
import "./style.css";

import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBCardImage,
  MDBInput,
  MDBDatePicker,
} from "mdbreact";

import Table from "./table";
import Swal from "sweetalert2";

const Checkout = () => {
  const { token, auth } = useSelector(({ auth }) => auth),
    { checkOutProducts } = useSelector(({ cart }) => cart),
    [cart, setCart] = useState([]),
    [remarks, setRemarks] = useState(""),
    [expected, setExpected] = useState(new Date()),
    dispatch = useDispatch(),
    history = useHistory();

  useEffect(() => {
    dispatch(SUPPLIERS({ token }));
  }, [dispatch, token]);

  useEffect(() => {
    setCart(checkOutProducts);
  }, [checkOutProducts]);

  const handleBuy = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to request this all products.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const cartWithSubtotalAndCapital = cart.map((obj) => ({
          ...obj,
          subtotal: variation.getTheSubTotal("capital", obj, obj.product),
          capital: variation.getTheCapitalOrSrp("capital", obj, obj.product),
          ...(obj.product.isPerKilo
            ? {
                kilo: {
                  request: obj.kilo,
                  approved: obj.kilo,
                  received: 0,
                },
                kiloGrams: {
                  request: obj.kiloGrams,
                  approved: obj.kiloGrams,
                  received: 0,
                },
              }
            : {
                quantity: {
                  request: obj.quantity,
                  approved: obj.quantity,
                  received: 0,
                },
              }),
        }));

        const total = cartWithSubtotalAndCapital.reduce(
          (accumulator, currentValue) => {
            return (accumulator += currentValue.subtotal);
          },
          0
        );

        const purchase = {
          requestBy: auth._id,
          expected,
          remarks,
          status: "pending",
          total,
        };

        dispatch(
          BUY({
            token,
            data: { purchase, cart: cartWithSubtotalAndCapital },
          })
        );
        history.push("/store");
        Swal.fire({
          title: "Request Successfully",
          icon: "success",
        });
      }
    });
  };

  return (
    <>
      <MDBRow>
        <MDBCol>
          <div
            className="d-flex  mb-2 ml-1 align-items-center cursor-pointer"
            onClick={() => history.push("/store")}
          >
            <MDBIcon
              icon="less-than"
              className="mr-2"
              style={{ color: "#7b95f5" }}
            />
            <h6 className="mt-2 text-primary">Back to store</h6>
          </div>
          <div className="d-flex align-items-center ml-2">
            <MDBIcon
              icon="shopping-cart"
              size="2x"
              className="mr-3 mt-1"
              style={{ color: "red" }}
            />
            <h5
              className="mt-3 font-weight-bold"
              style={{ color: "red", position: "relative" }}
            >
              Products &nbsp;&nbsp;&nbsp;&nbsp;Checkout
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  height: "100%",
                  borderLeft: "1px solid black",
                }}
              />
            </h5>
          </div>
        </MDBCol>
      </MDBRow>
      <MDBRow className="mt-2">
        <MDBCol md="8">
          <MDBCard className="dotted">
            <MDBCardBody className="m-0 p-0">
              <div className="striped-border"></div>
              <div className="m-1 p-2">
                <Table cart={cart} setCart={setCart} />
              </div>
              <hr className="dotted" />
              <MDBRow>
                <MDBCol
                  md="12"
                  className="text-right d-flex align-items-center justify-content-end mb-1"
                >
                  <h5 className="mr-4">
                    Product Request Total ({cart.length} Item)
                  </h5>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol>
          <MDBCard narrow>
            <MDBCardImage
              className="view view-cascade gradient-card-header blue-gradient"
              cascade
              tag="div"
            >
              <h5 className="font-weight-500 mb-0">Request</h5>
            </MDBCardImage>
            <MDBCardBody cascade>
              <div className="text-right">
                <MDBInput
                  type="textarea"
                  label="Remarks"
                  value={remarks}
                  onChange={({ target }) => setRemarks(target.value)}
                ></MDBInput>
                <div className="d-flex align-items-center">
                  Expected Date:{" "}
                  <MDBDatePicker
                    className="ml-3"
                    value={expected}
                    minDate={new Date().toDateString()}
                    getValue={(value) => setExpected(value)}
                  />
                </div>
                <MDBBtn color="primary" onClick={handleBuy}>
                  Submit
                </MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </>
  );
};

export default Checkout;
