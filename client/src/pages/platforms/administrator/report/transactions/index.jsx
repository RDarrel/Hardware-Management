import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBTable, MDBBtn, MDBIcon } from "mdbreact";
import { BROWSE } from "../../../../../services/redux/slices/administrator/report/transactionsReport";
import { Header } from "../header";
import PaginationButtons from "../../../../widgets/pagination/buttons";
import {
  formattedDate,
  fullName,
  handlePagination,
  variation,
} from "../../../../../services/utilities";
import Receipt from "../../../../widgets/receipt";

export const Transactions = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    { collections } = useSelector(
      ({ transactionsReport }) => transactionsReport
    ),
    [transactions, setTransactions] = useState([]),
    [total, setTotal] = useState(0),
    [orderDetails, setOrderDetails] = useState([]),
    [invoce_no, setInvoice_no] = useState(""),
    [show, setShow] = useState(false),
    [page, setPage] = useState(1),
    dispatch = useDispatch();

  const toggle = () => setShow(!show);

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  const hanldeShowPurchases = (purchases, invoice, total) => {
    setOrderDetails(
      purchases.map((purchase) => ({
        ...purchase,
        subtotal: variation.getTheSubTotal("srp", purchase, purchase.product),
      }))
    );

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
                <th>Cashier</th>
                <th>Invoice No.</th>
                <th>Date</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {handlePagination(transactions, page, maxPage).map(
                (transaction, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{fullName(transaction.cashier?.fullName)}</td>
                    <td>{transaction.invoice_no}</td>
                    <td>{formattedDate(transaction.createdAt)}</td>
                    <td className="text-danger font-weight-bold">
                      ₱{transaction.total.toLocaleString()}
                    </td>
                    <td>
                      <MDBBtn
                        size="sm"
                        color="warning"
                        rounded
                        onClick={() =>
                          hanldeShowPurchases(
                            transaction.purchases,
                            transaction.invoice_no,
                            transaction.total
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
        invoice_no={invoce_no}
        total={total}
        orderDetails={orderDetails}
        show={show}
        isAdmin={true}
      />
    </>
  );
};
