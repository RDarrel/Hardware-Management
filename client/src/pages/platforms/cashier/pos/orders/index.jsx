import React, { useState } from "react";
import { useEffect } from "react";
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBIcon } from "mdbreact";
import "./order.css";
import Swal from "sweetalert2";
import Footer from "./footer";
import Body from "./body";
import { variation } from "../../../../../services/utilities";
import Receipt from "../../../../widgets/receipt";
import seperateKiloAndGrams from "../../../../../services/utilities/seperateKiloAndGrams";
import { useDispatch, useSelector } from "react-redux";
import { SAVE } from "../../../../../services/redux/slices/cashier/suspendedTransacs";

const Orders = ({
  isCheckOut,
  setIsCheckOut,
  orders,
  setOrders,
  invoice_no,
  setInvoice_no,
  handleMaxSaleMessage,
}) => {
  const { auth, token } = useSelector(({ auth }) => auth),
    [total, setTotal] = useState(0),
    [cash, setCash] = useState(0),
    [orderDetails, setOrderDetails] = useState([]),
    [variant1, setVariant1] = useState(""),
    [variant2, setVariant2] = useState(""),
    [popoverKey, setPopOverKey] = useState(1),
    dispatch = useDispatch();

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
      _orders[index] = { ..._orders[index], kilo: Number(value) };
    } else {
      const quantity = _orders[index].quantity;
      if (quantity === value && max === quantity)
        return handleMaxSaleMessage(max, false);
      _orders[index] = { ..._orders[index], quantity: Number(value) };
    }
    setOrders(_orders);
  };

  const handleChangeGrams = (index, value) => {
    const _orders = [...orders];
    _orders[index] = { ..._orders[index], kiloGrams: Number(value) };
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
      _orders[index] = { ..._orders[index], variant2 };
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
          _orders[index] = { ..._orders[index], quantity: newMax };
        }
      }
      _orders[index] = { ..._orders[index], max: newMax };
    }

    _orders[index] = { ..._orders[index], variant1 };

    setOrders(_orders);
    handleClose();
  };
  const handleSuspend = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This transaction will be suspended and can be resumed later.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, suspend it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          SAVE({
            token,
            data: {
              cashier: auth._id,
              total,
              orders: orderDetails,
              invoice_no,
            },
          })
        );
        setInvoice_no("");
        setOrders([]);
        setOrderDetails([]);
        Swal.fire({
          title: "Suspended!",
          text: "The transaction has been successfully suspended.",
          icon: "success",
        });
      }
    });
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "F3") {
        event.preventDefault(); // Prevent the default browser action for F1
        const suspend = document.getElementById("suspend");
        if (suspend && !isCheckOut) {
          suspend.click();
        }
        // Perform your suspend action here
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCheckOut]);

  return (
    <MDBCol md="6">
      <MDBCard
        className="vh-100 d-flex flex-column "
        style={{ position: "relative" }}
      >
        <MDBCardBody className="d-flex flex-column">
          <div>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="font-weight-bold">
                Order Details
                {orderDetails.length > 0 ? `(${orderDetails.length})` : ""}
              </h5>
              {invoice_no && (
                <MDBBtn
                  size="sm"
                  color="info"
                  id="suspend"
                  disabled={!invoice_no}
                  onClick={handleSuspend}
                >
                  <MDBIcon far icon="pause-circle" className="mr-1" /> Suspend
                </MDBBtn>
              )}
            </div>
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
              setIsCheckOut={setIsCheckOut}
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
              toggle={() => setIsCheckOut(!isCheckOut)}
              orderDetails={orderDetails}
            />
          </div>
        </MDBCardBody>
      </MDBCard>
      <Receipt
        show={isCheckOut}
        toggle={() => setIsCheckOut(!isCheckOut)}
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
