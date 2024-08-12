import React, { useState } from "react";
import { MDBTable, MDBBtn, MDBIcon, MDBBadge } from "mdbreact";
import {
  formattedDate,
  fullName,
  handlePagination,
  transaction,
} from "../../../../services/utilities";
import PaginationButtons from "../../../widgets/pagination/buttons";
import Receipt from "../../../widgets/receipt";
import Modal from "./modal";
import formattedTotal from "../../../../services/utilities/forattedTotal";
const Table = ({ collections, isReturn, baseKey }) => {
  const [page, setPage] = useState(1),
    [show, setShow] = useState(false),
    [products, setProducts] = useState([]),
    [invoice_no, setInvoice_no] = useState(""),
    [customer, setCustomer] = useState(""),
    [createdAt, setCreatedAt] = useState(""),
    [total, setTotal] = useState(""),
    [showReason, setShowReason] = useState(false),
    [reason, setReason] = useState(""),
    [obj, setObj] = useState({}),
    [cashier, setCashier] = useState(""),
    maxPage = 5;

  collections =
    !!collections &&
    collections.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA; // Descending order
    });
  const toggle = () => setShow(!show);
  const toggleReason = () => setShowReason(!showReason);
  const handleViewProducts = (
    _products,
    invoice,
    _customer,
    _createdAt,
    _cashier,
    reason
  ) => {
    setProducts(transaction.computeSubtotal(_products));
    setInvoice_no(invoice);
    setCustomer(_customer);
    setTotal(transaction.getTotal(_products));
    setCreatedAt(_createdAt);
    setCashier(fullName(_cashier.fullName));
    setReason(reason);
    toggle();
  };
  return (
    <>
      <MDBTable>
        <thead>
          <tr>
            <th>#</th>
            <th className="text-center">
              {isReturn ? "Return" : "Refund"} Date
            </th>
            <th className="text-center">Reason</th>
            <th className="text-center">Total Amount</th>
            <th className="text-center">Products</th>
          </tr>
        </thead>
        <tbody>
          {!!collections ? (
            handlePagination(collections, page, maxPage).map((obj, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className="text-center font-weight-bolder">
                  {formattedDate(obj.createdAt)}
                </td>
                <td className="text-center">
                  <MDBBadge
                    className="p-1 cursor-pointer"
                    onClick={() => {
                      setObj(obj);
                      setReason(obj.reason);
                      toggleReason();
                    }}
                  >
                    Read
                  </MDBBadge>
                </td>
                <td className="text-center font-weight-bolder text-danger">
                  ₱{formattedTotal(transaction.getTotal(obj.products))}
                </td>
                <td className="text-center ">
                  <MDBBtn
                    size="sm"
                    floating
                    color="success"
                    onClick={() =>
                      handleViewProducts(
                        obj.products,
                        obj.invoice_no,
                        obj.customer || "--",
                        obj.createdAt,
                        obj[baseKey],
                        obj.reason
                      )
                    }
                  >
                    <MDBIcon icon="shopping-cart" />
                  </MDBBtn>
                  <span className="counter mb-0">
                    {obj?.products.length || "0"}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No Records</td>
            </tr>
          )}
        </tbody>
      </MDBTable>
      <Modal
        reason={reason}
        obj={obj}
        baseKey={baseKey}
        show={showReason}
        toggle={toggleReason}
      />
      <Receipt
        orderDetails={products}
        invoice_no={invoice_no}
        total={total}
        isReturnRefund={true}
        isReturn={isReturn}
        show={show}
        reason={reason}
        toggle={toggle}
        createdAt={createdAt}
        isAdmin={true}
        cashier={cashier}
        customerView={customer}
      />
      <PaginationButtons
        title={baseKey === "refundBy" ? "Refund" : "Return"}
        array={collections}
        max={maxPage}
        page={page}
        setPage={setPage}
      />
    </>
  );
};

export default Table;
