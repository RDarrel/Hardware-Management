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
import getTotalSales from "../getTotalSales";
import Receipt from "../../../../widgets/receipt";
import Spinner from "../../../../widgets/spinner";

export const Transactions = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(
      ({ transactionsReport }) => transactionsReport
    ),
    [transactions, setTransactions] = useState([]),
    [orderDetails, setOrderDetails] = useState([]),
    [selected, setSelected] = useState({}),
    [show, setShow] = useState(false),
    [page, setPage] = useState(1),
    dispatch = useDispatch();

  const toggle = () => setShow(!show);

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  const hanldeShowPurchases = (purchases, _transaction) => {
    setOrderDetails(transaction.computeSubtotal(purchases));
    setSelected({ ..._transaction, products: _transaction.purchases });
    toggle();
  };
  console.log(selected);

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
          {!isLoading ? (
            <>
              <MDBTable striped bordered>
                <thead>
                  <tr>
                    <th>#</th>
                    <th className="text-center">Cashier</th>
                    <th className="text-center">Invoice No.</th>
                    <th className="text-center">Date</th>
                    <th className="text-center">Total Amount</th>
                    <th className="text-center">Cash</th>
                    <th className="text-center">Change</th>
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
                        <td className="text-center">
                          {transaction.invoice_no}
                        </td>
                        <td className="text-center">
                          {formattedDate(transaction.createdAt)}
                        </td>
                        <td className="text-danger text-center font-weight-bolder">
                          ₱{transaction.total.toLocaleString()}.00
                        </td>
                        <td className="text-danger text-center font-weight-bold">
                          ₱{transaction.cash.toLocaleString()}.00
                        </td>
                        <td className="text-danger text-center font-weight-bold">
                          ₱
                          {(
                            transaction.cash - transaction.total
                          ).toLocaleString()}
                          .00
                        </td>
                        <td className="text-center">
                          <MDBBtn
                            size="sm"
                            color="warning"
                            rounded
                            onClick={() =>
                              hanldeShowPurchases(
                                transaction.purchases,
                                transaction
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
                  <MDBBadge color="info" className="">
                    <h6 className="font-weight-bolder text-white mx-1 my-1 ">
                      Grand Total Sales: ₱{getTotalSales(transactions)}.00
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
            </>
          ) : (
            <Spinner />
          )}
        </MDBCardBody>
      </MDBCard>
      <Receipt
        toggle={toggle}
        isAdmin={true}
        createdAt={selected?.createdAt}
        invoice_no={selected?.invoice_no}
        orderDetails={orderDetails}
        show={show}
        customerView={selected?.customer || "--"}
        cashier={fullName(selected?.cashier?.fullName)}
        total={selected?.total}
        cash={selected?.cash}
      />
    </>
  );
};
