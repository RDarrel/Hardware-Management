import React, { useState } from "react";
import { useEffect } from "react";
import { MDBCard, MDBCardBody, MDBCol } from "mdbreact";
import "./order.css";
import Swal from "sweetalert2";
import Footer from "./footer";
import Body from "./body";
import { variation } from "../../../../../services/utilities";
import Receipt from "../../../../widgets/receipt";
import seperateKiloAndGrams from "../../../../../services/utilities/seperateKiloAndGrams";

const Orders = ({
  orders,
  setOrders,
  invoice_no,
  setInvoice_no,
  handleMaxSaleMessage,
}) => {
  const [total, setTotal] = useState(0),
    [cash, setCash] = useState(0),
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
    Number(value);
    const _orders = [...orders];
    const max = _orders[index].max;

    if (isPerkilo) {
      const kilo = _orders[index].kilo + 1;
      if (value >= kilo - 1 && max <= kilo)
        return handleMaxSaleMessage(max, true);
      _orders[index].kilo = Number(value);
    } else {
      const quantity = _orders[index].quantity;
      if (quantity === value && max === quantity)
        return handleMaxSaleMessage(max, false);
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
    const {
      product,
      quantity,
      kilo = 0,
      kiloGrams = 0,
      variant1: oldVr1 = "",
    } = _orders[index];

    const { options } = product.variations[0];
    const variation = options;

    var newMax = variation.find(({ _id }) => _id === variant1)?.max;

    if (variant2) {
      const prices = variation.find(({ _id }) => _id === oldVr1)?.prices;
      newMax = prices.find(({ _id }) => _id === variant2)?.max;
      if (newMax === 0) {
        const prices = variation.find(({ _id }) => _id === variant1)?.prices;
        newMax = prices.find(({ _id }) => _id === variant2)?.max;
      }
      _orders[index].variant2 = variant2;
    }
    if (newMax) {
      if (product.isPerKilo) {
        const totalKiloOrder = kilo + kiloGrams;
        if (newMax < totalKiloOrder) {
          const newKilo = seperateKiloAndGrams(newMax);
          _orders[index] = { ..._orders[index], ...newKilo };
        }
      } else {
        if (newMax < quantity) {
          _orders[index].quantity = newMax;
        }
      }
      _orders[index].max = newMax;
    }
    _orders[index].variant1 = variant1;

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
    <MDBCol md="6">
      <MDBCard
        className="vh-100 d-flex flex-column "
        style={{ position: "relative" }}
      >
        <MDBCardBody className="d-flex flex-column">
          <div>
            <h5 className="font-weight-bold">
              Order Details{" "}
              {orderDetails.length > 0 ? `(${orderDetails.length})` : ""}
            </h5>
            <hr className="m-0 p-0" />
          </div>
          <div className="flex-grow-1 overflow-auto">
            <Body
              orderDetails={orderDetails}
              setOrderDetails={setOrderDetails}
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
          </div>
          <div
            style={{
              position: "sticky",
              bottom: 10,
              backgroundColor: "white",
              zIndex: 1000,
              marginBottom: "10px",
            }}
          >
            <Footer
              invoice_no={invoice_no}
              cash={cash}
              setCash={setCash}
              total={total}
              setCheckout={setCheckout}
              orderDetails={orderDetails}
            />
          </div>
        </MDBCardBody>
      </MDBCard>
      <Receipt
        show={checkout}
        toggle={() => setCheckout(!checkout)}
        invoice_no={invoice_no}
        total={total}
        orderDetails={orderDetails}
        setInvoice_no={setInvoice_no}
        cash={cash}
        setOrders={setOrders}
      />
    </MDBCol>
  );
};

export default Orders;
