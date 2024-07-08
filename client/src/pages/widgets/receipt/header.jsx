import React from "react";
import navbarLogo from "../../../assets//logo/navbar.jpg";
import { formattedDate } from "../../../services/utilities";
import { MDBInput } from "mdbreact";

const Header = ({
  invoice_no,
  createdAt,
  isAdmin = false,
  isReturn,
  isReturnRefund,
  cashier,
  customer,
  customerView,
  setCustomer,
  reason,
}) => {
  return (
    <>
      <div className="invoice-header-row">
        <div className="invoice-header-col d-flex align-items-center">
          <img
            src={navbarLogo}
            height="90"
            className="mt-2 ml-2"
            alt="invoice"
          />
          <h5 className="font-weight-bold ml-2">Liberty Hardware</h5>
        </div>
        <div className="invoice-header-col d-flex justify-content-end">
          <div className="invoice-header">
            <div className="invoice-header-content">
              <h4
                className="font-weight-bold mb-1"
                style={{ letterSpacing: "2px" }}
              >
                INVOICE
              </h4>
              <div className="d-flex  justify-content-between  ">
                <span className="text-nowrap mr-3">Invoice #: </span>
                <span className="text-nowrap">{invoice_no}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="mr-3 text-nowrap">
                  {isReturnRefund ? (isReturn ? "Return" : "Refund") : ""} Date:
                </span>
                <span className="text-nowrap">
                  {formattedDate(isAdmin ? createdAt : "")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isReturnRefund && (
        <div className="d-flex customer-name align-items-center m-0 p-0">
          <h6 className="ml-2 mr-2 font-weight-bold">
            {isReturn ? "Return" : "Refund"} By: {isAdmin && cashier}
          </h6>
        </div>
      )}

      <div className="d-flex customer-name align-items-center m-0 p-0">
        <h6 className="ml-2 mr-2 font-weight-bold">
          Customer: {isAdmin && customerView}
        </h6>
        {!isAdmin && (
          <MDBInput
            value={customer}
            className=" customer-name"
            label="Enter name (optional)"
            onChange={({ target }) => setCustomer(target.value.toUpperCase())}
          />
        )}
      </div>

      {isReturnRefund && (
        <h6 className="ml-2 font-weight-bold">Reason: {reason || "--"}</h6>
      )}
    </>
  );
};

export default Header;
