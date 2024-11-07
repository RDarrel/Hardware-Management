import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBadge,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBIcon,
  MDBRow,
  MDBTable,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";
import { BROWSE } from "../../../../../services/redux/slices/administrator/report/transactionsReport";
import { Header } from "../header";
import { fullName, globalSearch } from "../../../../../services/utilities";
import PaginationButtons from "../../../../widgets/pagination/buttons";
import handlePagination from "../../../../widgets/pagination";
import "./employee.css";
import getTotalSales from "../getTotalSales";
import Processed from "./processed";
import Spinner from "../../../../widgets/spinner";
import formattedTotal from "../../../../../services/utilities/forattedTotal";

export const EmployeesReport = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(
      ({ transactionsReport }) => transactionsReport
    ),
    [transactions, setTransactions] = useState([]),
    [cashier, setCashier] = useState(""),
    [from, setFrom] = useState(new Date()),
    [to, setTo] = useState(new Date()),
    [status, setStatus] = useState(""),
    [isTransaction, setIsTransaction] = useState(false),
    [show, setShow] = useState(false),
    [warningMsg, setWarningMsg] = useState(""),
    [search, setSearch] = useState(""),
    [sales, setSales] = useState([]),
    [page, setPage] = useState(1),
    [showToast, setShowToast] = useState(""),
    { addToast } = useToasts(),
    dispatch = useDispatch();

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

  useEffect(() => {
    if (showToast) {
      addToast(`No Record found, for ${warningMsg} Processed.`, {
        appearance: "warning",
      });
      setShowToast(false);
    }
  }, [showToast, addToast, warningMsg]);

  const toggle = () => setShow(!show);

  return (
    <>
      <MDBCard className="card-employees">
        <MDBCardBody>
          {!isLoading ? (
            <>
              <MDBRow
                className="d-flex align-items-center"
                style={{ marginTop: "-1rem", marginBottom: "-0.5rem" }}
              >
                <MDBCol md="9">
                  <Header
                    isEmployees={true}
                    collections={collections}
                    setFilteredData={setTransactions}
                    title="Employees"
                    setBaseFrom={setFrom}
                    setBaseTo={setTo}
                    mb="0"
                  />
                </MDBCol>
                <MDBCol>
                  <input
                    type="search"
                    className="form-control"
                    value={search}
                    onChange={({ target }) => setSearch(target.value)}
                    placeholder="Search employee.."
                  />
                </MDBCol>
              </MDBRow>
              <MDBTable bordered responsive striped>
                <thead>
                  <tr>
                    <th className="text-center th-sm" rowSpan="2">
                      #
                    </th>
                    <th className="text-center th-lg" rowSpan="2">
                      Cashier
                    </th>
                    <th className="text-center" colSpan={3}>
                      Processed
                    </th>
                    <th className="text-center" colSpan={3}>
                      Total Amount
                    </th>
                    {/* <th className=" th-lg text-center text-nowrap">
                      Transactions Processed
                    </th>
                    <th className="text-center th-lg text-nowrap">
                      Refund Processed
                    </th>
                    <th className="text-center th-lg text-nowrap">
                      Replacement Processed
                    </th> */}
                    {/* <th className="th-lg text-center text-nowrap" rowSpan="2">
                      Total Refund Amount
                    </th>
                    <th className="th-lg text-center text-nowrap" rowSpan="2">
                      Total Replacement Amount
                    </th>
                    <th className="text-center th-lg text-nowrap" rowSpan="2">
                      Total Sales Amount
                    </th> */}
                  </tr>
                  <tr>
                    <th className="text-center">Transactions</th>
                    <th className="text-center">Refund</th>
                    <th className="text-center">Replacement</th>
                    <th className="text-center">Refund</th>
                    <th className="text-center">Replacement</th>
                    <th className="text-center">Sale</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.length > 0 ? (
                    handlePagination(sales, page, maxPage).map(
                      (transaction, index) => {
                        const {
                          cashier,
                          transactionsHandle,
                          total,
                          refundItemCount = 0,
                          totalRefundSales = 0,
                          returnItemCount = 0,
                          totalReturnSales = 0,
                        } = transaction;
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center text-nowrap">
                              {fullName(cashier.fullName)}
                            </td>
                            <td
                              className="text-center font-weight-bold cursor-pointer"
                              onClick={() => {
                                setCashier(cashier);
                                setIsTransaction(true);
                                setStatus("transactions");
                                toggle();
                              }}
                            >
                              <MDBIcon
                                icon="hand-holding"
                                size="2x"
                                style={{ color: "#5ac461" }}
                              />
                              <span className="counter text-center bg-success ">
                                {transactionsHandle}
                              </span>
                            </td>
                            <td
                              className="text-center font-weight-bold cursor-pointer"
                              onClick={() => {
                                if (refundItemCount === 0) {
                                  setShowToast(true);
                                  setWarningMsg("Refund");
                                } else {
                                  setIsTransaction(false);
                                  setCashier(cashier);
                                  setStatus("refund");
                                  toggle();
                                }
                              }}
                            >
                              <MDBIcon
                                icon="hand-holding"
                                size="2x"
                                style={{ color: "red" }}
                              />
                              <span className="counter text-center">
                                {refundItemCount || 0}
                              </span>
                            </td>
                            <td
                              className="text-center font-weight-bold cursor-pointer"
                              onClick={() => {
                                if (returnItemCount === 0) {
                                  setShowToast(true);
                                  setWarningMsg("Return");
                                } else {
                                  setIsTransaction(false);
                                  setCashier(cashier);
                                  setStatus("return");
                                  toggle();
                                }
                              }}
                            >
                              <MDBIcon
                                icon="hand-holding"
                                size="2x"
                                style={{ color: "orange" }}
                              />
                              <span
                                className="counter text-center"
                                style={{ backgroundColor: "orange" }}
                              >
                                {returnItemCount || 0}
                              </span>
                            </td>

                            <td className="text-center font-weight-bold">
                              ₱{formattedTotal(totalRefundSales)}
                            </td>
                            <td className="text-center  font-weight-bold">
                              ₱{formattedTotal(totalReturnSales)}
                            </td>
                            <td className="text-center font-weight-bold">
                              ₱{formattedTotal(total)}
                            </td>
                          </tr>
                        );
                      }
                    )
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center">
                        No Record.
                      </td>
                    </tr>
                  )}
                </tbody>
              </MDBTable>
              {!search && (
                <div className="d-flex justify-content-end mt-3">
                  <MDBBadge color="info">
                    <h6 className="font-weight-bolder text-white  mx-1 my-1">
                      Total Gross Sales: ₱
                      {formattedTotal(getTotalSales(transactions))}
                    </h6>
                  </MDBBadge>
                </div>
              )}
            </>
          ) : (
            <Spinner />
          )}
          <Processed
            show={show}
            toggle={toggle}
            from={from}
            to={to}
            status={status}
            cashier={cashier}
            isTransaction={isTransaction}
          />
          {!isLoading && sales.length > 10 && (
            <PaginationButtons
              array={transactions}
              max={maxPage}
              page={page}
              setPage={setPage}
              title={"Transaction"}
            />
          )}
        </MDBCardBody>
      </MDBCard>
    </>
  );
};

export default EmployeesReport;
