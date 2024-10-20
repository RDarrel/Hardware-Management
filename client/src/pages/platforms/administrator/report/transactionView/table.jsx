import React from "react";
import { variation } from "../../../../../services/utilities";
import getTotalRefundAmount from "../getTotalRefund";
import formattedTotal from "../../../../../services/utilities/forattedTotal";
import productOrder from "../../../../../services/utilities/product";

const Table = ({ orderDetails, transaction }) => {
  return (
    <table className="invoice-report-table">
      <thead>
        <tr>
          <th>Items</th>
          <th className="text-center">Quantity/Kilo</th>
          <th className="text-center">Refund Quantity/Kilo</th>
          <th className="text-center">Net Quantity/Kilo</th>
          <th className="text-center">SRP</th>
          <th className="text-center">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {orderDetails?.length > 0 &&
          orderDetails.map((order, index) => (
            <tr key={`${order._id}-${index}`}>
              <td>
                <div className="d-flex flex-column">
                  <span
                    style={{
                      maxWidth: `300px`,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    className="font-weight-bold "
                  >
                    {order.product.name.toUpperCase()}
                  </span>
                  {order.product.hasVariant && (
                    <span style={{ marginTop: "-30px" }}>
                      Variation: &nbsp;
                      {variation.getTheVariant(
                        order.variant1,
                        order.variant2 || "",
                        order.product.variations
                      )}
                    </span>
                  )}
                </div>
              </td>
              <td className="text-center">
                {productOrder.originalQtyKilo(order)}
              </td>

              <td className="text-center">{productOrder.refund(order)}</td>
              <td className="text-center">
                {variation.qtyOrKilo(order, order.product.isPerKilo)}
              </td>
              <td className="text-center">₱{order.srp.toLocaleString()}</td>
              <td className="text-center">
                ₱{order.subtotal.toLocaleString()}
              </td>
            </tr>
          ))}
        <tr className="p-2 ">
          <td
            colSpan="4"
            style={{
              borderBottomColor: "transparent",
              borderLeftColor: "transparent",
            }}
          ></td>
          <td
            colSpan="1"
            className="pl-1 "
            style={{ borderRight: "none", fontSize: "1rem" }}
          >
            <p className="ml-3 paragraph mt-1">Total Sale</p>
            <p className="ml-3 paragraph">Total Refund Amount</p>
            <p className="ml-3 paragraph  ">Total Amount</p>
            <p className="ml-3 paragraph  ">Cash</p>
            <p className="ml-3 paragraph  mb-2">Change</p>
          </td>
          <td style={{ borderLeft: "none", fontSize: "1rem" }}>
            <p className="ml-4 paragraph  mt-1">
              ₱{formattedTotal(transaction?.total)}
            </p>
            <p className="ml-4 paragraph">
              ₱{formattedTotal(getTotalRefundAmount(transaction.products))}
            </p>
            <p className="ml-4 paragraph ">
              ₱{formattedTotal(transaction?.totalWithoutDeduc)}
            </p>
            <p className="ml-4 paragraph ">
              ₱{formattedTotal(transaction?.cash)}
            </p>
            <p className="ml-4 paragraph mb-2">
              ₱
              {formattedTotal(
                transaction.cash - transaction?.totalWithoutDeduc
              )}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Table;
