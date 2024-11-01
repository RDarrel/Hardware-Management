import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
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
    [change, setChange] = useState(0),
    dispatch = useDispatch();

  const isQuotation = isWalkInQuotation || isWalkin;

  useEffect(() => {
    setChange(cash - total);
  }, [total, cash]);

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
            cash,
            purchases: orderDetails,
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

  const disableByCash = cash < total;
  const disableByCustomer = isWalkin ? (customer ? false : true) : false;

  console.log(customer);
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
          <div className="d-flex align-items-center">
            <h6 className="mt-3 mb-2">Total:</h6>
            <h5 className="mt-3 ml-5">
              <strong> ₱{formattedTotal(total)}</strong>
            </h5>
          </div>
          {!isQuotation && (
            <div className="d-flex">
              <h6 className="mt-3 mr-5">Cash:</h6>
              <input
                placeholder="Cash"
                className="form-control mt-2"
                value={String(cash)}
                onChange={({ target }) => setCash(Number(target.value))}
                type="number"
              />
            </div>
          )}
          {!isQuotation && (
            <div className="d-flex align-items-center">
              <h6 className="mt-3 mb-2">Change:</h6>
              <h5 className="mt-3 ml-4">
                &nbsp;
                <strong>₱{change > 0 ? formattedTotal(change) : 0}</strong>
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
