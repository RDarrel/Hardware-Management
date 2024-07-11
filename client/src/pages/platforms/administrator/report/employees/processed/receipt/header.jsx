import React from "react";
import navbarLogo from "../../../../../../../assets/logo/navbar.jpg";
import {
  formattedDate,
  fullName,
} from "../../../../../../../services/utilities";

const Header = ({
  invoice_no,
  createdAt,
  customer,
  cashier,
  reason,
  isTransaction = true,
  title,
}) => {
  return (
    <>
      <div className="invoice-header-row w-100">
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
          <div className="invoice-report-header">
            <div className="invoice-header-content">
              <h4
                className="font-weight-bold mb-1"
                style={{ letterSpacing: "2px" }}
              >
                INVOICE
              </h4>
              <div className="d-flex  justify-content-between  ">
                <span className="text-nowrap mr-2">Invoice #: </span>
                <span className="text-nowrap">{invoice_no}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="mr-2 text-nowrap">
                  {isTransaction ? "Transaction" : "Replacement"} Date:
                </span>
                <span className="text-nowrap">{formattedDate(createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h6 className="ml-3 font-weight-bold">
        Cashier: {fullName(cashier.fullName) || "--"}
      </h6>
      <h6 className="ml-3 font-weight-bold">Customer: {customer || "--"}</h6>
      {!isTransaction && (
        <h6 className="ml-3 font-weight-bold">Reason: {reason || "--"}</h6>
      )}
    </>
  );
};

export default Header;
