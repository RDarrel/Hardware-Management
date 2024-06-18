import React from "react";
import navbarLogo from "../../../../../assets//logo/navbar.jpg";
import { formattedDate } from "../../../../../services/utilities";

const Header = ({ invoice_no }) => {
  return (
    <div className="invoice-header-row">
      <div className="invoice-header-col d-flex align-items-center">
        <img src={navbarLogo} height="90" className="mt-2 ml-2" alt="invoice" />
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
              <span className="mr-3">Date:</span>
              <span>{formattedDate()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
