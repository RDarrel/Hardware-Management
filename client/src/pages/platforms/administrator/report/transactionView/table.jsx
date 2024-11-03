import React from "react";
import { transaction, variation } from "../../../../../services/utilities";
import getTotalRefundAmount from "../getTotalRefund";
import formattedTotal from "../../../../../services/utilities/forattedTotal";
import productOrder from "../../../../../services/utilities/product";

const Table = ({ orderDetails, transaction: transac }) => {
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
            <p className="ml-3 paragraph  ">Total Discount</p>
            <p className="ml-3 paragraph">Total Refund Amount</p>
            <p className="ml-3 paragraph  ">Total Amount</p>
            <p className="ml-3 paragraph  ">Total VAT(12%)</p>
            <p className="ml-3 paragraph  ">Total Due</p>
            <p className="ml-3 paragraph  ">Cash</p>
            <p className="ml-3 paragraph  mb-2">Change</p>
          </td>
          <td style={{ borderLeft: "none", fontSize: "1rem" }}>
            <p className="ml-4 paragraph  mt-1">
              ₱{formattedTotal(transac?.total)}
            </p>
            <p className="ml-4 paragraph ">
              ₱{formattedTotal(transac?.totalDiscount || 0)}
            </p>
            <p className="ml-4 paragraph">
              ₱{formattedTotal(getTotalRefundAmount(transac.products))}
            </p>
            <p className="ml-4 paragraph ">
              ₱{formattedTotal(transac?.total - (transac.totalDiscount || 0))}
            </p>

            <p className="ml-4 paragraph ">
              ₱{formattedTotal(transaction?.totalVat(orderDetails))}
            </p>
            <p className="ml-4 paragraph ">
              ₱{formattedTotal(transac?.totalDue)}
            </p>
            <p className="ml-4 paragraph ">₱{formattedTotal(transac?.cash)}</p>
            <p className="ml-4 paragraph mb-2">
              ₱{formattedTotal(transac.cash - transac?.totalDue)}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Table;
