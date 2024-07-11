import React from "react";
import { MDBBtn } from "mdbreact";

import Table from "./table";
import "./receipt.css";
import Header from "./header";
export default function Receipt({
  toggle,
  total = 0,
  reason = "",
  cashier,
  customer = "",
  title = "",
  invoice_no = "",
  orderDetails = [],
  createdAt = "",
  isTransaction = true,
  cash = 0,
}) {
  const change = cash - total || 0;
  return (
    <div className="m-0 p-0">
      <Header
        invoice_no={invoice_no}
        title={title}
        createdAt={createdAt}
        customer={customer}
        reason={reason}
        isTransaction={isTransaction}
        cashier={cashier}
      />
      <div className="mx-2 p-1 mt-3">
        <Table
          orderDetails={orderDetails}
          total={total}
          change={change}
          isTransaction={isTransaction}
          cash={cash}
        />
      </div>
      <div className="text-center mb-1-half mt-2">
        <MDBBtn
          type="button"
          onClick={() => toggle()}
          color="light"
          className="mb-2 font-weight-bold float-right"
        >
          Close
        </MDBBtn>
      </div>
    </div>
  );
}
