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
  globalSearch,
  handlePagination,
  transaction,
} from "../../../../../services/utilities";
import getTotalSales from "../getTotalSales";
// import Receipt from "../../../../widgets/receipt";
import Spinner from "../../../../widgets/spinner";
import formattedTotal from "../../../../../services/utilities/forattedTotal";
import transactionsExcel from "../../../../../services/utilities/downloadExcel/transactions";
import Modal from "./modal";

export const Transactions = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(
      ({ transactionsReport }) => transactionsReport
    ),
    [transactions, setTransactions] = useState([]),
    [sales, setSales] = useState([]),
    [orderDetails, setOrderDetails] = useState([]),
    [selected, setSelected] = useState({}),
    [show, setShow] = useState(false),
    [baseFrom, setBaseFrom] = useState(""),
    [search, setSearch] = useState(""),
    [baseTo, setBaseTo] = useState(""),
    [page, setPage] = useState(1),
    dispatch = useDispatch();

  const toggle = () => setShow(!show);

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    if (search && transactions.length > 0) {
      const _products = [...transactions];
      const searchProducts = globalSearch(_products, search);
      setSales(searchProducts);
    } else {
      setSales(transactions);
    }
  }, [search, transactions]);

  const hanldeShowPurchases = (purchases, _transaction) => {
    setOrderDetails(transaction.computeSubtotal(purchases));
    setSelected({ ..._transaction, products: _transaction.purchases });
    toggle();
  };

  const handleExport = () => {
    const options = {
      sheet: "Sales-Report",
      filename: "Sales-Report",
      title: "Transactions Report",
      from: formattedDate(baseFrom),
      to: formattedDate(baseTo),
      totalSales: `₱${formattedTotal(getTotalSales(transactions))}`,
    };

    const formatSales = transactions.map((transaction) => {
      const { invoice_no = "", total, cash, cashier, createdAt } = transaction;
      return {
        cashier: fullName(cashier.fullName),
        invoice: invoice_no,
        date: formattedDate(createdAt),
        totalAmount: `₱ ${formattedTotal(total)}`,
        cash: `₱ ${formattedTotal(cash)}`,
        change: `₱ ${formattedTotal(cash - total)}`,
      };
    });

    transactionsExcel({ options, array: formatSales });
  };

  return (
    <>
      <div className="d-flex justify-content-end">
        <MDBBtn size="sm" onClick={handleExport}>
          <MDBIcon icon="file-excel" className="mr-2" />
          Export In Excel
        </MDBBtn>
      </div>
      <MDBCard>
        <MDBCardBody className="m-0">
          <MDBRow
            className="d-flex align-items-center"
            style={{ marginTop: "-1rem", marginBottom: "-0.5rem" }}
          >
            <MDBCol md="9">
              <div>
                <Header
                  setFilteredData={setTransactions}
                  collections={collections}
                  isTransaction={true}
                  title="Transactions"
                  mb="0"
                  setBaseFrom={setBaseFrom}
                  setBaseTo={setBaseTo}
                />
              </div>
            </MDBCol>

            <MDBCol md="3">
              <input
                type="search"
                placeholder="Search a transaction.."
                className="form-control "
                value={search}
                onChange={({ target }) => setSearch(target.value)}
              />
            </MDBCol>
          </MDBRow>
          {!isLoading ? (
            <>
              {/* <MDBRow className="d-flex justify-content-end mb-2">
                <MDBCol md="3">
                  <input
                    type="search"
                    placeholder="Search a transaction.."
                    className="form-control"
                    value={search}
                    onChange={({ target }) => setSearch(target.value)}
                  />
                </MDBCol>
              </MDBRow> */}
              <MDBTable striped bordered>
                <thead>
                  <tr>
                    <th>#</th>
                    <th className="text-center">Cashier</th>
                    <th className="text-center">Invoice No.</th>
                    <th className="text-center">Date</th>
                    <th className="text-center">Total Due</th>
                    <th className="text-center">Cash</th>
                    <th className="text-center">Change</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {handlePagination(sales, page, maxPage).map(
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
                        <td className=" text-center font-weight-bolder">
                          ₱{formattedTotal(transaction.totalDue)}
                        </td>
                        <td className=" text-center font-weight-bold">
                          ₱{formattedTotal(transaction.cash)}
                        </td>
                        <td className=" text-center font-weight-bold">
                          ₱
                          {formattedTotal(
                            transaction.cash - transaction.totalDue
                          )}
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
                            View
                          </MDBBtn>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </MDBTable>
              {!search && (
                <MDBRow>
                  <MDBCol md="12" className="d-flex justify-content-end ">
                    <MDBBadge color="info" className="">
                      <h6 className="font-weight-bolder text-white mx-1 my-1 ">
                        Total Gross Sales: ₱
                        {formattedTotal(getTotalSales(transactions))}
                      </h6>
                    </MDBBadge>
                  </MDBCol>
                </MDBRow>
              )}
              {sales.length > 10 && (
                <PaginationButtons
                  page={page}
                  setPage={setPage}
                  max={maxPage}
                  array={transactions}
                  title={"Transactions"}
                />
              )}
            </>
          ) : (
            <Spinner />
          )}
        </MDBCardBody>
      </MDBCard>
      <Modal
        toggle={toggle}
        isAdmin={true}
        createdAt={selected?.createdAt}
        invoice_no={selected?.invoice_no}
        orderDetails={orderDetails}
        show={show}
        transaction={selected}
        customerView={selected?.customer || "--"}
        customer={selected?.customer || "--"}
        cashier={selected?.cashier}
        total={selected?.total}
        cash={selected?.cash}
      />
    </>
  );
};
