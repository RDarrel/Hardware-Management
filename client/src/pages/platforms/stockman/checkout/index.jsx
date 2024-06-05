import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

import "./style.css";
import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBTypography,
} from "mdbreact";
import { SUPPLIERS } from "../../../../services/redux/slices/cart";
import { useDispatch, useSelector } from "react-redux";
import Table from "./table";
import Swal from "sweetalert2";
const Checkout = () => {
  const { token } = useSelector(({ auth }) => auth),
    { checkOutProducts, suppliers: supplierCollections } = useSelector(
      ({ cart }) => cart
    ),
    [cart, setCart] = useState([]),
    [suppliers, setSuppliers] = useState([]),
    [isShowNote, setIsShowNote] = useState(true),
    [supplier, setSupplier] = useState(""),
    [isAllProductHaveSubtotal, setIsAllProductHaveSubtotal] = useState(false),
    [total, setTotal] = useState(0),
    dispatch = useDispatch(),
    history = useHistory();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowNote(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []); // [] upang gawing tanging unang render lamang ang may epekto

  useEffect(() => {
    dispatch(SUPPLIERS({ token }));
  }, [dispatch, token]);

  useEffect(() => {
    setCart(checkOutProducts);
  }, [checkOutProducts]);

  useEffect(() => {
    if (supplierCollections.length > 0) {
      setSuppliers(supplierCollections);
      setSupplier(supplierCollections[0]._id);
    }
  }, [supplierCollections]);

  useEffect(() => {
    const _isAllProductHaveSubtotal = cart.every(
      (item) => item.hasOwnProperty("subtotal") && item.subtotal > 0
    );

    if (_isAllProductHaveSubtotal) {
      const _total = cart.reduce((accumulator, currentValue) => {
        return (accumulator += currentValue.subtotal);
      }, 0);

      setTotal(_total);
      setIsAllProductHaveSubtotal(true);
    } else {
      setIsAllProductHaveSubtotal(false);
    }
  }, [cart]);

  console.log(isAllProductHaveSubtotal);

  const handleBuy = async () => {
    if (!isAllProductHaveSubtotal) {
      return await Swal.fire({
        title: "Warning!",
        text: "Please make sure to enter the price for all products.",
        icon: "info",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
    const supplierName = suppliers.find(({ _id }) => _id === supplier).company;
    Swal.fire({
      title: "Are you sure?",
      text: `Before proceeding with your purchase, please double-check that the supplier "${supplierName}" is correct.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Purchase Confirmed",
          text: `Your purchase has been confirmed with supplier: "${supplierName}".`,
          icon: "success",
        });
      }
    });
  };

  return (
    <>
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
              <h4 className="mt-2 mr-2">Supplier:</h4>
              <select
                className="form-control w-25 font-weight-bold"
                value={supplier}
                onChange={({ target }) => setSupplier(target.value)}
              >
                {suppliers.length > 0 &&
                  suppliers.map((supplier, index) => (
                    <option key={`supplier-${index}`} value={supplier._id}>
                      {supplier.company}
                    </option>
                  ))}
              </select>

              {isShowNote && (
                <MDBTypography
                  variant="h2"
                  className="mb-0 text-black-80 ml-3"
                  noteColor="success"
                  note
                  noteTitle="Note: "
                >
                  Kindly verify your supplier.
                </MDBTypography>
              )}
            </div>
            <div className="supplier-content">
              <p>
                Purchase By:&nbsp;
                <strong>Darrel Pajarillaga (+63) 9203552827</strong>
              </p>
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
              <h2 style={{ fontWeight: 900 }} className="text-danger  ml-2">
                {isAllProductHaveSubtotal ? `₱${total}` : `₱0`}
              </h2>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mt-3 mr-1 mb-3">
            <MDBCol md="12" className="text-right">
              <MDBBtn color="danger" type="button" onClick={handleBuy}>
                Buy Now
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </>
  );
};

export default Checkout;
