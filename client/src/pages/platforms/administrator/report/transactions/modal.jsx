import React from "react";
import { MDBModal, MDBModalBody } from "mdbreact";
import TransactionView from "../transactionView";

export default function Modal({
  show,
  toggle,
  cashier,
  customer = "",
  invoice_no = "",
  orderDetails = [],
  transaction = {},
  createdAt = "",
}) {
  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      disableFocusTrap={false}
      size="xl"
    >
      <MDBModalBody className="mb-0 m-0 p-0">
        <TransactionView
          toggle={toggle}
          cashier={cashier}
          customer={customer}
          invoice_no={invoice_no}
          orderDetails={orderDetails}
          transaction={transaction}
          createdAt={createdAt}
        />
      </MDBModalBody>
    </MDBModal>
  );
}
