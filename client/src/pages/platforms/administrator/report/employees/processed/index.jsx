import React, { useEffect, useState } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTable,
  MDBBtn,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";

import { GET_RETURN_REFUND } from "../../../../../../services/redux/slices/administrator/report/transactionsReport";
import {
  formattedDate,
  fullName,
  transaction,
} from "../../../../../../services/utilities";
import Receipt from "./receipt";
import TransactionView from "../../transactionView";

export default function Processed({
  show,
  toggle,
  status = "refund",
  cashier,
  isTransaction = false,
}) {
  const { token } = useSelector(({ auth }) => auth),
    { returnRefund } = useSelector(
      ({ transactionsReport }) => transactionsReport
    ),
    [showReceipt, setShowReciept] = useState(false),
    [products, setProducts] = useState([]),
    [createdAt, setCreatedAt] = useState(""),
    [reason, setReason] = useState(""),
    [invoice_no, setInvoice_no] = useState(""),
    [total, setTotal] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      dispatch(
        GET_RETURN_REFUND({ token, key: { cashier: cashier._id, status } })
      );
    }
  }, [token, show, status, dispatch, cashier]);

  const toggleReciept = () => setShowReciept(!showReceipt);

  const handleClose = () => {
    toggle();
  };

  const handleShowReceipt = (_products, _invoice, _reason, _createdAt) => {
    setReason(_reason);
    setProducts(transaction.computeSubtotal(_products));
    setInvoice_no(_invoice);
    setCreatedAt(_createdAt);
    setTotal(transaction.getTotal(_products));
    toggleReciept();
  };

  const title =
    status === "refund"
      ? "Refund"
      : status === "return"
      ? "Return"
      : "Transactions";
  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      size={isTransaction && showReceipt ? "xl" : "lg"}
      disableFocusTrap={false}
    >
      {!showReceipt && (
        <MDBModalHeader
          toggle={handleClose}
          className="light-blue darken-3 white-text"
        >
          <MDBIcon icon="user" className="mr-2" />
          {title} processed by: {fullName(cashier.fullName)}
        </MDBModalHeader>
      )}
      <MDBModalBody className="mb-0 m-0 p-0">
        {!showReceipt ? (
          <MDBTable>
            <thead>
              <tr>
                <th>#</th>
                <th className="text-center">Invoice No.</th>
                <th className="text-center">Date</th>
                <th className="text-center">Total Amount</th>
                <th className="text-center">Products</th>
              </tr>
            </thead>
            <tbody>
              {returnRefund.map(
                ({ createdAt, products, invoice_no, reason }, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="text-center font-weight-bolder">
                      {invoice_no}
                    </td>
                    <td className="text-center font-weight-bolder">
                      {formattedDate(createdAt)}
                    </td>
                    <td className="text-center font-weight-bolder text-danger">
                      ₱ {transaction.getTotal(products)}
                    </td>
                    <td className="text-center ">
                      <MDBBtn
                        size="sm"
                        floating
                        color="success"
                        onClick={() => {
                          handleShowReceipt(
                            products,
                            invoice_no,
                            reason,
                            createdAt
                          );
                        }}
                      >
                        <MDBIcon icon="shopping-cart" />
                      </MDBBtn>
                      <span className="counter mb-0">
                        {products.length || "0"}
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </MDBTable>
        ) : isTransaction ? (
          <TransactionView
            toggle={toggleReciept}
            orderDetails={products}
            total={total}
            title={title}
            reason={reason}
            createdAt={createdAt}
            cashier={cashier}
            invoice_no={invoice_no}
          />
        ) : (
          <Receipt
            toggle={toggleReciept}
            orderDetails={products}
            total={total}
            title={title}
            reason={reason}
            createdAt={createdAt}
            cashier={cashier}
            invoice_no={invoice_no}
          />
        )}
      </MDBModalBody>
    </MDBModal>
  );
}
