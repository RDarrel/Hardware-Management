import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBadge, MDBCard, MDBCardBody, MDBIcon, MDBTable } from "mdbreact";
import { BROWSE } from "../../../../../services/redux/slices/administrator/report/transactionsReport";
import { Header } from "../header";
import PaginationButtons from "../../../../widgets/pagination/buttons";
import handlePagination from "../../../../widgets/pagination";
import { fullName } from "../../../../../services/utilities";
import "./employee.css";
export const EmployeesReport = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    { collections } = useSelector(
      ({ transactionsReport }) => transactionsReport
    ),
    [transactions, setTransactions] = useState([]),
    [page, setPage] = useState(1),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  return (
    <>
      <MDBCard>
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
          <MDBTable bordered responsive striped>
            <thead>
              <tr>
                <th className="text-center th-sm" rowSpan="2">
                  #
                </th>
                <th className="text-center th-lg" rowSpan="2">
                  Cashier
                </th>

                <th className="text-center th-lg" colSpan="3">
                  Details
                </th>
                <th className="text-center th-lg" rowSpan="2">
                  Total Refund Amount
                </th>
                <th className="text-center th-lg" rowSpan="2">
                  Total Return Amount
                </th>
                <th className="text-center th-lg" rowSpan="2">
                  Total Sales Amount
                </th>
              </tr>
              <tr>
                <th className=" th-lg">Transactions Processed</th>
                <th className="text-center th-lg">Refund Processed</th>
                <th className="text-center th-lg">Return Processed</th>
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
                      <td className="text-center">
                        {fullName(cashier.fullName)}
                      </td>
                      <td className="text-center font-weight-bold">
                        <MDBIcon
                          icon="hand-holding"
                          size="2x"
                          style={{ color: "#007bff" }}
                        />
                        <span className="counter"> {transactionsHandle}</span>
                      </td>
                      <td className="text-center font-weight-bold">
                        <MDBIcon
                          icon="hand-holding"
                          size="2x"
                          style={{ color: "#007bff" }}
                        />
                        <span className="counter"> {refundItemCount || 0}</span>
                      </td>
                      <td className="text-center font-weight-bold">
                        <MDBIcon
                          icon="hand-holding"
                          size="2x"
                          style={{ color: "#007bff" }}
                        />
                        <span className="counter"> {returnItemCount || 0}</span>
                      </td>
                      <td className="text-center text-danger font-weight-bold">
                        ₱{totalRefundSales.toLocaleString()}
                      </td>
                      <td className="text-center text-danger font-weight-bold">
                        ₱{totalReturnSales.toLocaleString()}
                      </td>
                      <td className="text-center text-danger font-weight-bold">
                        ₱{total.toLocaleString()}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </MDBTable>
          <div className="d-flex justify-content-end ">
            <MDBBadge color="blue">
              <h6 className="font-weight-bolder text-white">Total: ₱2990</h6>
            </MDBBadge>
          </div>
          <PaginationButtons
            array={transactions}
            max={maxPage}
            page={page}
            setPage={setPage}
            title={"Transaction"}
          />
        </MDBCardBody>
      </MDBCard>
    </>
  );
};

export default EmployeesReport;
