import React, { useEffect, useState } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTable,
  MDBBtn,
  MDBBadge,
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
import getTotalRefundAmount from "../../getTotalRefund";

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
    [selected, setSelected] = useState({}),
    [isExist, setIsExist] = useState(false),
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

  const handleShowReceipt = (
    _products,
    _invoice,
    _reason,
    _createdAt,
    _isExist,
    _transaction
  ) => {
    setSelected(_transaction);
    setIsExist(_isExist);
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
      ? "Replacement"
      : "Transactions";
  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      size={isTransaction ? "xl" : "lg"}
      disableFocusTrap={false}
    >
      {!showReceipt && (
        <MDBModalHeader
          toggle={handleClose}
          className="light-blue darken-3 white-text"
          tag="h5"
        >
          <MDBIcon icon="user" className="mr-2" />
          {title} processed by: {fullName(cashier.fullName)}
        </MDBModalHeader>
      )}
      <MDBModalBody className="mb-0 m-0 p-0">
        {!showReceipt ? (
          <div style={{ maxHeight: "580px", overflowY: "auto" }}>
            <MDBTable>
              <thead>
                <tr>
                  <th>#</th>
                  <th className="text-center">Invoice No.</th>
                  <th className="text-center">Date</th>
                  {isTransaction ? (
                    <>
                      <th className="text-center">Total Products Amount</th>
                      <th className="text-center">Total Refund Amount</th>
                      <th className="text-center">Total Sales</th>
                    </>
                  ) : (
                    <th className="text-center">Total Amount</th>
                  )}
                  <th className="text-center">Products</th>
                </tr>
              </thead>
              <tbody>
                {returnRefund.map((_transaction, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="text-center font-weight-bolder">
                      {_transaction.invoice_no}
                    </td>
                    <td className="text-center font-weight-bolder">
                      {formattedDate(_transaction.createdAt)}
                    </td>
                    {isTransaction && (
                      <>
                        <td className="text-center font-weight-bolder text-danger">
                          ₱ {_transaction?.totalWithoutDeduc?.toLocaleString()}
                          .00
                        </td>
                        <td className="text-center font-weight-bolder text-danger">
                          ₱
                          {getTotalRefundAmount(
                            _transaction.products
                          )?.toLocaleString() || 0}
                          .00
                        </td>
                      </>
                    )}
                    <td className="text-center font-weight-bolder text-danger">
                      ₱
                      {transaction
                        .getTotal(_transaction.products)
                        ?.toLocaleString()}
                      .00
                    </td>
                    <td className="text-center ">
                      <MDBBtn
                        size="sm"
                        floating
                        color="success"
                        onClick={() => {
                          handleShowReceipt(
                            _transaction.products,
                            _transaction.invoice_no,
                            _transaction.reason,
                            _transaction.createdAt,
                            _transaction.isExist,
                            _transaction
                          );
                        }}
                      >
                        <MDBIcon icon="shopping-cart" />
                      </MDBBtn>
                      <span className="counter mb-0">
                        {_transaction.products.length || "0"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </MDBTable>
          </div>
        ) : isTransaction ? (
          <TransactionView
            toggle={toggleReciept}
            orderDetails={products}
            isExist={isExist}
            total={total}
            title={title}
            reason={reason}
            createdAt={createdAt}
            transaction={selected}
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
        {!showReceipt && (
          <MDBBadge color="ligh">
            <h6 className="text-dark">
              Total of ({returnRefund.length || 0}) {title} Processed
            </h6>
          </MDBBadge>
        )}
      </MDBModalBody>
    </MDBModal>
  );
}
