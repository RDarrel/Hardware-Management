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
  MDBBadge,
} from "mdbreact";

import Table from "./table";
import Swal from "sweetalert2";
import CustomSelect from "../../../../components/customSelect";

const Checkout = () => {
  const { token, auth } = useSelector(({ auth }) => auth),
    { checkOutProducts, suppliers: supplierCollections } = useSelector(
      ({ cart }) => cart
    ),
    [cart, setCart] = useState([]),
    [suppliers, setSuppliers] = useState([]),
    [supplier, setSupplier] = useState("all"),
    [remarks, setRemarks] = useState(""),
    [expected, setExpected] = useState(new Date()),
    dispatch = useDispatch(),
    history = useHistory();

  useEffect(() => {
    dispatch(SUPPLIERS({ token }));
  }, [dispatch, token]);

  useEffect(() => {
    const _checkoutProducts = [...checkOutProducts];
    const _supplierIDS = _checkoutProducts
      .filter(
        (obj, index, curr) =>
          curr.findIndex(({ supplier }) => supplier === obj.supplier) === index
      )
      .map(({ supplier }) => supplier);
    const populateSuppliers = supplierCollections.filter(({ _id }) =>
      _supplierIDS.includes(_id)
    );

    setSuppliers(populateSuppliers);
  }, [checkOutProducts, supplierCollections]);

  useEffect(() => {
    setCart(checkOutProducts);
  }, [checkOutProducts]);

  useEffect(() => {
    if (!supplier || supplier === "all") {
      setCart(checkOutProducts);
    } else {
      setCart(
        checkOutProducts.filter(
          ({ supplier: _supplier }) => _supplier === supplier
        )
      );
    }
  }, [supplier, checkOutProducts]);

  // const getTheTotal = (merchandises) => {};

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
        const purchases = suppliers.map((supplier) => {
          const merchandises = cart.filter(
            ({ supplier: supp }) => supp === supplier._id
          );

          const merchandisesWithSubtotal = merchandises.map((obj) => ({
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

          const total = merchandisesWithSubtotal.reduce(
            (accumulator, currentValue) => {
              return (accumulator += currentValue.subtotal);
            },
            0
          );

          return {
            requestBy: auth._id,
            supplier: supplier._id,
            expected,
            remarks,
            status: "pending",
            total,
            merchandises: merchandisesWithSubtotal,
          };
        });

        // const cartWithSubtotalAndCapital = cart.map((obj) => ({
        //   ...obj,
        //   subtotal: variation.getTheSubTotal("capital", obj, obj.product),
        //   capital: variation.getTheCapitalOrSrp("capital", obj, obj.product),
        //   ...(obj.product.isPerKilo
        //     ? {
        //         kilo: {
        //           request: obj.kilo,
        //           approved: obj.kilo,
        //           received: 0,
        //         },
        //         kiloGrams: {
        //           request: obj.kiloGrams,
        //           approved: obj.kiloGrams,
        //           received: 0,
        //         },
        //       }
        //     : {
        //         quantity: {
        //           request: obj.quantity,
        //           approved: obj.quantity,
        //           received: 0,
        //         },
        //       }),
        // }));

        // const total = cartWithSubtotalAndCapital.reduce(
        //   (accumulator, currentValue) => {
        //     return (accumulator += currentValue.subtotal);
        //   },
        //   0
        // );

        // const purchase = {
        //   requestBy: auth._id,
        //   expected,
        //   remarks,
        //   status: "pending",
        //   total,
        // };

        dispatch(
          BUY({
            token,
            data: purchases,
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
          <MDBRow className="mb-2">
            <MDBCol>
              <MDBCard>
                <div className="striped-border"></div>
                <MDBRow>
                  <MDBCol>
                    <CustomSelect
                      className="m-3 p-0"
                      label={"Supplier"}
                      choices={[{ company: "All", _id: "all" }, ...suppliers]}
                      preValue={supplier}
                      onChange={(value) => setSupplier(value)}
                      texts="company"
                      values="_id"
                    />
                  </MDBCol>
                </MDBRow>
              </MDBCard>
            </MDBCol>
          </MDBRow>
          <MDBCard>
            <MDBCardBody className="m-0 p-0">
              <div className="m-1 p-2">
                <Table cart={cart} setCart={setCart} />
              </div>
              <MDBBadge color="light">
                <h6 className="font-weight-bold text-dark">
                  Total of ({cart.length || 0}) Products Requesting
                </h6>
              </MDBBadge>
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
