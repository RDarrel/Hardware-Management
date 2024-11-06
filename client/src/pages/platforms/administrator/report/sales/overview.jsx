import { MDBTable } from "mdbreact";
import React from "react";
import formattedTotal from "../../../../../services/utilities/forattedTotal";
import { formattedDate } from "../../../../../services/utilities";

const Overview = ({
  netSales,
  totalIncome,
  totalRefund,
  totalSales,
  totalVatSales,
  totalDiscount,
  from,
  to,
}) => {
  return (
    <>
      <h6 className="mt-3">
        <strong>Sales Overview: </strong>
        {formattedDate(from)} to {formattedDate(to)}
      </h6>
      <MDBTable bordered>
        <thead>
          <tr>
            <th> Gross Sales</th>
            <th> Net Sales</th>
            <th> Income </th>
            <th> Refund </th>
            <th> Discount </th>
            <th> Vatable Sales</th>
            <th> Vat(12%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="font-weight-bold">₱{formattedTotal(totalSales)}</td>
            <td className="font-weight-bold">₱{formattedTotal(netSales)}</td>
            <td className="font-weight-bold">₱{formattedTotal(totalIncome)}</td>
            <td className="font-weight-bold">₱{formattedTotal(totalRefund)}</td>
            <td className="font-weight-bold">
              ₱{formattedTotal(totalDiscount)}
            </td>
            <td className="font-weight-bold">
              ₱{formattedTotal(Number(totalVatSales).toFixed(2))}
            </td>
            <td className="font-weight-bold">
              ₱{formattedTotal(Number(totalVatSales * 0.12).toFixed(2))}
            </td>
          </tr>
        </tbody>
      </MDBTable>
    </>
  );
};

export default Overview;
