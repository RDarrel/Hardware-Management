import React, { useEffect, useState } from "react";
import { formattedDate, variation } from "../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
} from "mdbreact";
import Table from "./table";
import Swal from "sweetalert2";
import truncateString from "../../../services/utilities/truncateString";
import capitalize from "../../../services/utilities/capitalize";
import { GENERATE_RECEIPT } from "../../../services/redux/slices/cart";
const Checkout = ({ checkOutProducts, setIsCheckout, toggleCart }) => {
  const { token, auth } = useSelector(({ auth }) => auth),
    // { checkOutProducts } = useSelector(({ cart }) => cart),
    [cart, setCart] = useState([]),
    [total, setTotal] = useState(0),
    dispatch = useDispatch();

  useEffect(() => {
    const productWihtSubtotal = checkOutProducts?.map((obj) => ({
      ...obj,
      subtotal: variation.getTheSubTotal("srp", obj, obj.product),
      srp: variation.getTheCapitalOrSrp("srp", obj, obj.product),
      hasVariant: obj.product?.hasVariant,
      variant: variation.getTheVariant(
        obj.variant1,
        obj.variant2,
        obj.product?.variations
      ),
      name: truncateString(capitalize.firstLetter(obj.product.name), 80),
      qty: variation.qtyOrKilo(obj, obj.product?.isPerKilo),
    }));

    setCart(productWihtSubtotal);
  }, [checkOutProducts]);

  useEffect(() => {
    const _total = cart.reduce((accumulator, currentValue) => {
      return (accumulator += currentValue.subtotal);
    }, 0);

    setTotal(_total);
  }, [cart]);

  const handleBuy = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: ` Please review your selection before confirming. Once you proceed, a receipt will be generated and
       sent to your email address. Ensure that your email is correct to receive the confirmation.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          GENERATE_RECEIPT({
            token,
            data: {
              total,
              products: cart,
              date: formattedDate(),
              to: auth.email,
            },
          })
        );

        Swal.fire({
          title: "Successfully sent your receipt in your email",
          icon: "success",
        }).then(() => {
          toggleCart(false);

          setIsCheckout(false);
        });
      }
    });
  };

  return (
    <div
      style={{
        overflowX: "hidden",
      }}
    >
      <MDBRow className="d-flex justify-content-center mb-4 mt-4">
        <MDBCol md="8">
          <div
            className="d-flex  mb-2 ml-1 align-items-center cursor-pointer"
            onClick={() => {
              setIsCheckout(false);
              toggleCart(false);
            }}
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
              size="3x"
              className="mr-3"
              style={{ color: "red" }}
            />
            <h4
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
            </h4>
          </div>
          <MDBCard className="mt-3">
            <MDBCardBody className="m-0 p-0">
              <div className="striped-border"></div>

              <div className="m-3">
                <div className="d-flex align-items-center">
                  <h5 className="mt-2 mr-2 grey-text">Customer:</h5>
                  <h5 className="mt-2 ">
                    <strong>{auth.email}</strong>
                  </h5>
                </div>
                <div className="d-flex align-items-center">
                  <h5 className="mt-2 mr-2 grey-text">Date:</h5>
                  <h6 className="mt-2 font-weight-bold ml-4">
                    &nbsp; &nbsp; {formattedDate()}
                  </h6>
                </div>
              </div>
            </MDBCardBody>
          </MDBCard>
          <MDBCard className="mt-3 dotted">
            <MDBCardBody className="m-0 p-0">
              <div className="m-1 p-2">
                <Table cart={cart} setCart={setCart} />
              </div>
              <hr className="dotted" />
              <MDBRow className="mr-2">
                <MDBCol
                  md="12"
                  className="text-right d-flex align-items-center justify-content-end"
                >
                  <h5 className="mr-5">Order Total ({cart.length} Item):</h5>
                  <h3 style={{ fontWeight: 800 }} className="text-danger  ml-2">
                    ₱{total.toLocaleString()}.00
                  </h3>
                </MDBCol>
              </MDBRow>
              <MDBRow className="mt-3 mr-1 mb-3">
                <MDBCol md="12" className="text-right">
                  <MDBBtn color="danger" type="button" onClick={handleBuy}>
                    Generate Receipt
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </div>
  );
};

export default Checkout;
