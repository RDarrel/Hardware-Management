import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBadge, MDBCard, MDBCardBody, MDBIcon, MDBTable } from "mdbreact";
import { useToasts } from "react-toast-notifications";
import { BROWSE } from "../../../../../services/redux/slices/administrator/report/transactionsReport";
import { Header } from "../header";
import { fullName } from "../../../../../services/utilities";
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
    [status, setStatus] = useState(""),
    [isTransaction, setIsTransaction] = useState(false),
    [show, setShow] = useState(false),
    [warningMsg, setWarningMsg] = useState(""),
    [page, setPage] = useState(1),
    [showToast, setShowToast] = useState(""),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

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
        <div className="ml-4">
          <Header
            isEmployees={true}
            collections={collections}
            setFilteredData={setTransactions}
            title="Employees"
            mb="0"
          />
        </div>
        <MDBCardBody>
          {!isLoading ? (
            <>
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
                  {handlePagination(transactions, page, maxPage).map(
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

                          <td className="text-center text-danger font-weight-bold">
                            ₱{formattedTotal(totalRefundSales)}
                          </td>
                          <td className="text-center text-danger font-weight-bold">
                            ₱{formattedTotal(totalReturnSales)}
                          </td>
                          <td className="text-center text-danger font-weight-bold">
                            ₱{formattedTotal(total)}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </MDBTable>
              <div className="d-flex justify-content-end mt-3">
                <MDBBadge color="info">
                  <h6 className="font-weight-bolder text-white  mx-1 my-1">
                    Grand Total Sales: ₱
                    {formattedTotal(getTotalSales(transactions))}
                  </h6>
                </MDBBadge>
              </div>
            </>
          ) : (
            <Spinner />
          )}
          <Processed
            show={show}
            toggle={toggle}
            status={status}
            cashier={cashier}
            isTransaction={isTransaction}
          />
          {!isLoading && (
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
