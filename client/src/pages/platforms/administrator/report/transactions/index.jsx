import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBCard,
  MDBCardBody,
  MDBTable,
  MDBBtn,
  MDBIcon,
  MDBBadge,
  MDBRow,
  MDBCol,
} from "mdbreact";
import { BROWSE } from "../../../../../services/redux/slices/administrator/report/transactionsReport";
import { Header } from "../header";
import PaginationButtons from "../../../../widgets/pagination/buttons";
import {
  formattedDate,
  fullName,
  handlePagination,
  transaction,
} from "../../../../../services/utilities";
import Receipt from "../../../../widgets/receipt";
import getTotalSales from "../getTotalSales";

export const Transactions = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    { collections } = useSelector(
      ({ transactionsReport }) => transactionsReport
    ),
    [transactions, setTransactions] = useState([]),
    [total, setTotal] = useState(0),
    [orderDetails, setOrderDetails] = useState([]),
    [customerView, setCustomerView] = useState(""),
    [invoce_no, setInvoice_no] = useState(""),
    [show, setShow] = useState(false),
    [createdAt, setCreatedAt] = useState(""),
    [page, setPage] = useState(1),
    dispatch = useDispatch();

  const toggle = () => setShow(!show);

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  const hanldeShowPurchases = (purchases, invoice, total, date, customer) => {
    setOrderDetails(
      transaction.computeSubtotal(
        purchases.filter(({ isRefundAll = false }) => isRefundAll === false)
      )
    );
    setCustomerView(customer);
    setCreatedAt(date);
    setInvoice_no(invoice);
    setTotal(total);
    toggle();
  };

  return (
    <>
      <MDBCard>
        <div className="ml-4 mt-2">
          <Header
            setFilteredData={setTransactions}
            collections={collections}
            isTransaction={true}
            title="Transactions"
            mb="0"
          />
        </div>
        <MDBCardBody>
          <MDBTable striped bordered>
            <thead>
              <tr>
                <th>#</th>
                <th className="text-center">Cashier</th>
                <th className="text-center">Invoice No.</th>
                <th className="text-center">Date</th>
                <th className="text-center">Total Amount</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {handlePagination(transactions, page, maxPage).map(
                (transaction, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="text-center">
                      {fullName(transaction.cashier?.fullName)}
                    </td>
                    <td className="text-center">{transaction.invoice_no}</td>
                    <td className="text-center">
                      {formattedDate(transaction.createdAt)}
                    </td>
                    <td className="text-danger text-center font-weight-bold">
                      ₱{transaction.total.toLocaleString()}
                    </td>
                    <td className="text-center">
                      <MDBBtn
                        size="sm"
                        color="warning"
                        rounded
                        onClick={() =>
                          hanldeShowPurchases(
                            transaction.purchases,
                            transaction.invoice_no,
                            transaction.total,
                            transaction.createdAt,
                            transaction.customer || "--"
                          )
                        }
                      >
                        <MDBIcon icon="eye" />
                      </MDBBtn>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </MDBTable>
          <MDBRow>
            <MDBCol md="12" className="d-flex justify-content-end ">
              <MDBBadge color="success" className="">
                <h6 className="font-weight-bolder text-white mx-1 my-1 ">
                  Total Sales: ₱{getTotalSales(transactions)}
                </h6>
              </MDBBadge>
            </MDBCol>
          </MDBRow>
          <PaginationButtons
            page={page}
            setPage={setPage}
            max={maxPage}
            array={transactions}
            title={"Transactions"}
          />
        </MDBCardBody>
      </MDBCard>
      <Receipt
        toggle={toggle}
        createdAt={createdAt}
        invoice_no={invoce_no}
        total={total}
        orderDetails={orderDetails}
        show={show}
        customerView={customerView}
        isAdmin={true}
      />
    </>
  );
};
