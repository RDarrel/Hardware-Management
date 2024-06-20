import React, { useState } from "react";
import { useEffect } from "react";
import { MDBCard, MDBCardBody, MDBCol } from "mdbreact";
import "./order.css";
import Swal from "sweetalert2";
import Footer from "./footer";
import Body from "./body";
import { variation } from "../../../../../services/utilities";
import Receipt from "../../../../widgets/receipt";

const Orders = ({ orders, setOrders, invoice_no }) => {
  const [total, setTotal] = useState(0),
    [orderDetails, setOrderDetails] = useState([]),
    [checkout, setCheckout] = useState(false),
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
    const _orders = [...orders];
    if (isPerkilo) {
      _orders[index].kilo = Number(value);
    } else {
      _orders[index].quantity = Number(value);
    }
    setOrders(_orders);
  };

  const handleChangeGrams = (index, value) => {
    const _orders = [...orders];
    _orders[index].kiloGrams = Number(value);
    setOrders(_orders);
  };

  const handleClose = () => {
    setPopOverKey((prevKey) => prevKey + 1);
  };

  const handleUpdateVariant = (index, variant1, variant2) => {
    const _orders = [...orders];
    _orders[index].variant1 = variant1;
    if (variant2) {
      _orders[index].variant2 = variant2;
    }

    setOrders(_orders);
    handleClose();
  };

  const handleDelete = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const _orders = [...orders];
        _orders.splice(index, 1);
        setOrders(_orders);
      }
    });
  };

  return (
    <MDBCol md="5">
      <MDBCard
        className="vh-100 d-flex flex-column order-details-card"
        style={{ position: "relative" }}
      >
        <MDBCardBody>
          <h5 className="font-weight-bold">
            Order Details{" "}
            {orderDetails.length > 0 ? `(${orderDetails.length})` : ""}
          </h5>
          <hr />
          <Body
            orderDetails={orderDetails}
            handleChange={handleChange}
            handleChangeGrams={handleChangeGrams}
            handleUpdateVariant={handleUpdateVariant}
            handleDelete={handleDelete}
            handleClose={handleClose}
            popoverKey={popoverKey}
            variant1={variant1}
            setVariant1={setVariant1}
            variant2={variant2}
            setVariant2={setVariant2}
          />
          <Footer
            invoice_no={invoice_no}
            total={total}
            setCheckout={setCheckout}
            orderDetails={orderDetails}
          />
        </MDBCardBody>
      </MDBCard>
      <Receipt
        show={checkout}
        toggle={() => setCheckout(!checkout)}
        invoice_no={invoice_no}
        total={total}
        orderDetails={orderDetails}
        setOrders={setOrders}
      />
    </MDBCol>
  );
};

export default Orders;
