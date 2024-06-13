import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBTable } from "mdbreact";
import { BROWSE } from "../../../../../services/redux/slices/administrator/report/transactionsReport";
import { Header } from "../header";
import PaginationButtons from "../../../../widgets/pagination/buttons";
import handlePagination from "../../../../widgets/pagination";
import { fullName } from "../../../../../services/utilities";

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

  useEffect(() => {
    setTransactions(collections);
  }, [collections]);

  return (
    <>
      <Header
        isEmployees={true}
        collections={collections}
        setFilteredData={setTransactions}
        title="Employees"
      />
      <MDBCard className="mt-2">
        <MDBCardBody>
          <MDBTable bordered responsive striped>
            <thead>
              <tr>
                <th>#</th>
                <th className="text-center">Cashier</th>
                <th className="text-center">Total Transactions Generated</th>
                <th className="text-center">Total Sales Generated</th>
              </tr>
            </thead>
            <tbody>
              {handlePagination(transactions, page, maxPage).map(
                (transaction, index) => {
                  const { cashier, transactionsHandle, total } = transaction;
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="text-center">
                        {" "}
                        {fullName(cashier.fullName)}
                      </td>
                      <td className="text-center font-weight-bold">
                        {transactionsHandle}
                      </td>
                      <td className="text-center text-danger font-weight-bold">
                        {" "}
                        ₱{total}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </MDBTable>
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
