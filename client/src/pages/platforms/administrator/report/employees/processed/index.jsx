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
import formattedTotal from "../../../../../../services/utilities/forattedTotal";

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

  const handleShowReceipt = (_products, _transaction) => {
    setSelected(_transaction);
    setProducts(transaction.computeSubtotal(_products));
    setTotal(transaction.getTotal(_products));
    toggleReciept();
  };

  console.log(selected);

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
      size={isTransaction && !showReceipt ? "xl" : "lg"}
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
                      <th className="text-center">Total Amount</th>
                      <th className="text-center">Cash</th>
                      <th className="text-center">Change</th>
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
                    {!isTransaction && (
                      <td className="text-center font-weight-bolder text-danger">
                        ₱
                        {formattedTotal(
                          transaction.getTotal(_transaction.products)
                        )}
                      </td>
                    )}
                    {isTransaction && (
                      <>
                        <td className="text-center font-weight-bolder text-danger">
                          ₱ {formattedTotal(_transaction?.total)}
                        </td>
                        <td className="text-center font-weight-bolder text-danger">
                          ₱{formattedTotal(_transaction?.cash || 0)}
                        </td>
                        <td className="text-center font-weight-bolder text-danger">
                          ₱
                          {formattedTotal(
                            _transaction.cash - _transaction.total
                          )}
                        </td>
                      </>
                    )}

                    <td className="text-center ">
                      <MDBBtn
                        size="sm"
                        floating
                        color="success"
                        onClick={() => {
                          handleShowReceipt(
                            _transaction.products,
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
        ) : (
          <Receipt
            toggle={toggleReciept}
            orderDetails={products}
            total={total}
            title={title}
            reason={selected?.reason}
            isTransaction={isTransaction}
            cash={selected?.cash}
            createdAt={selected?.createdAt}
            cashier={selected?.cashier}
            invoice_no={selected?.invoice_no}
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
