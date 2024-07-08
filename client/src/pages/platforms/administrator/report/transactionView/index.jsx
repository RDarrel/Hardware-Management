import React from "react";
import { MDBBtn } from "mdbreact";

import Table from "./table";
import "./receipt.css";
import Header from "./header";
export default function TransactionView({
  toggle,
  cashier,
  customer = "",
  invoice_no = "",
  orderDetails = [],
  transaction = {},
  createdAt = "",
}) {
  return (
    <div className="m-0 p-0">
      <Header
        invoice_no={invoice_no}
        createdAt={createdAt}
        customer={customer}
        cashier={cashier}
      />
      <div className="mx-2 p-1 mt-3">
        <Table orderDetails={orderDetails} transaction={transaction} />
      </div>
      <div className="text-center mb-1-half mt-2">
        <MDBBtn
          type="button"
          onClick={() => {
            toggle();
          }}
          color="light"
          className="mb-2 font-weight-bold float-right"
        >
          Close
        </MDBBtn>
      </div>
    </div>
  );
}
