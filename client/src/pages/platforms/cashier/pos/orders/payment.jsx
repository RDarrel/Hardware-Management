import React, { useCallback, useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
} from "mdbreact";
import { POS } from "../../../../../services/redux/slices/cart";
import { UPDATE_MAX } from "../../../../../services/redux/slices/administrator/productManagement/products";
import formattedTotal from "../../../../../services/utilities/forattedTotal";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { fullName, variation } from "../../../../../services/utilities";

export default function Payment({
  show,
  total = 0,
  invoice_no = "",
  orderDetails = [],
  isWalkInQuotation = false,
  isAdmin = false,
  isWalkin = false,
  setInvoice_no = () => {},
  setCustomerQuotation = () => {},
  setOrders = () => {},
  handleAction = () => {},
  toggle = () => {},
}) {
  const { auth, token } = useSelector(({ auth }) => auth),
    [cash, setCash] = useState(0),
    [customer, setCustomer] = useState(""),
    [ordersWithDiscount, setOrdersWithDiscount] = useState([]),
    [totalDiscount, setTotalDiscount] = useState(0),
    [totalDue, setTotalDue] = useState(0),
    [change, setChange] = useState(0),
    dispatch = useDispatch();

  const isQuotation = isWalkInQuotation || isWalkin;

  useEffect(() => {
    setChange(cash - totalDue);
  }, [totalDue, cash]);

  const getTotal = useCallback((key, _purchases) => {
    return _purchases.reduce((acc, curr) => (acc += curr[key]), 0);
  }, []);

  useEffect(() => {
    if (show) {
      setCash(0);
      setCustomer("");
      setTotalDue(0);
      setTotalDiscount(0);
      setOrdersWithDiscount([]);
      const _purchases = orderDetails.map((purchase) => {
        const {
          subtotal,
          quantity = 0,
          kilo = 0,
          kiloGrams = 0,
          product,
        } = purchase;
        const { isPerKilo = false } = product;
        const totalOrder = isPerKilo ? kilo + kiloGrams : quantity;

        const haveDiscount = totalOrder >= 3;

        const discount = haveDiscount ? subtotal * 0.1 : 0;

        return {
          ...purchase,
          discount,
        };
      });

      const _totalDiscount = getTotal("discount", _purchases);
      const _totalDue = total - _totalDiscount;
      console.log(_totalDue);
      setOrdersWithDiscount(_purchases);
      setTotalDiscount(_totalDiscount);
      setTotalDue(_totalDue);
    }
  }, [orderDetails, getTotal, total, show]);

  const handleClose = () => {
    toggle();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window.open(
      "/printOut",
      "Claim Stub",
      "top=100px,left=100px,width=550px,height=750px"
    );
    const purchases = orderDetails.map((order) => {
      const { product } = order;
      const { hasVariant } = product;
      return {
        ...order,
        ...(hasVariant && {
          variant: variation.name(order, product.variations),
        }),
      };
    });
    const printData = {
      cashier: fullName(auth.fullName),
      invoice_no,
      customer,
      isQuotation: isQuotation,
      total,
      totalDiscount,
      totalDue,
      cash,
      purchases,
    };

    localStorage.setItem("collection", JSON.stringify(printData));

    if (!isQuotation) {
      dispatch(
        POS({
          token,
          data: {
            customer,
            invoice_no,
            cashier: auth._id,
            total,
            totalDiscount,
            totalDue,
            cash,
            purchases: ordersWithDiscount,
          },
        })
      );

      dispatch(UPDATE_MAX({ purchases: orderDetails }));
    }
    Swal.fire({
      title: !isQuotation ? "Successfully Paid" : "Successfully Quotation",
      icon: "success",
    });
    setInvoice_no("");
    setCustomerQuotation("");
    setOrders([]);
    toggle();
  };

  const handleSend = (e) => {
    e.preventDefault();
    handleAction(customer);
    setCustomerQuotation("");
  };

  const disableByCash = cash < totalDue;
  const disableByCustomer = isWalkin ? (customer ? false : true) : false;

  const btnTxt = isWalkin
    ? "Send to cashier"
    : isWalkInQuotation
    ? "Print"
    : "Proceed";
  return (
    <MDBModal isOpen={show} toggle={toggle} centered backdrop size="md">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon
          icon={isQuotation ? "walking" : "cash-register"}
          className="mr-2"
        />
        {isQuotation ? "Quotation" : "Payment"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={!isWalkin ? handleSubmit : handleSend}>
          <div className="d-flex ">
            <h6 className="mt-2 mr-3">Customer:</h6>
            <input
              placeholder={`Type here..`}
              className="form-control"
              value={customer}
              onChange={({ target }) => setCustomer(target.value)}
            />
          </div>
          <div className="d-flex align-items-center justify-content-between mt-3">
            <h6>Total: </h6>
            <h5>
              <strong> ₱{formattedTotal(total)}</strong>
            </h5>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-1">
            <h6>Total Discount: </h6>
            <h5>
              <strong> ₱{formattedTotal(totalDiscount)}</strong>
            </h5>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-1">
            <h6>Total Due:</h6>
            <h5>
              <strong> ₱{formattedTotal(totalDue)}</strong>
            </h5>
          </div>

          {!isQuotation && (
            <div className="d-flex justify-content-between align-items-center mt-1 mb-3">
              <h6 className="mt-2 mr-5">Cash:</h6>
              <input
                placeholder="Cash"
                className="form-control ml-1 "
                value={String(cash)}
                onChange={({ target }) => setCash(Number(target.value))}
                type="number"
              />
            </div>
          )}
          {!isQuotation && (
            <div className="d-flex align-items-center justify-content-between">
              <h6>Change:</h6>
              <h5>
                &nbsp;
                <strong>₱{change > 0 ? formattedTotal(change) : "0.00"}</strong>
              </h5>
            </div>
          )}
          <div className="text-center mb-1-half mt-2">
            {!isAdmin && (
              <MDBBtn
                type="submit"
                color="primary"
                disabled={!isQuotation ? disableByCash : disableByCustomer}
                className="mb-2 font-weight-bold float-right"
              >
                {btnTxt}
              </MDBBtn>
            )}
            {isWalkin && (
              <MDBBtn
                type="button"
                color="info"
                className="float-right"
                onClick={handleSubmit}
              >
                <MDBIcon icon="print" className="mr-2" /> Print
              </MDBBtn>
            )}
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
