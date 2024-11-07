import React from "react";
import { variation } from "../../../../../services/utilities";
import getTotalRefundAmount from "../getTotalRefund";
import formattedTotal from "../../../../../services/utilities/forattedTotal";
import productOrder from "../../../../../services/utilities/product";

const Table = ({ orderDetails, transaction: transac }) => {
  const grossSales = transac.total;
  const refund = getTotalRefundAmount(transac.products);
  const netSales = grossSales - transac?.totalDiscount;
  const vatSales = Number(netSales / 1.12).toFixed(2);
  const vat = Number(vatSales * 0.12).toFixed(2);

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
            <p className="ml-1 paragraph mt-1">Gross Sales</p>
            <p className="ml-1 paragraph  ">Total Discount</p>
            <p className="ml-1 paragraph">Refund Amount</p>
            <p className="ml-1 paragraph  ">Net Sales</p>
            <p className="ml-1 paragraph  ">Total Due</p>
            <hr style={{ marginRight: "-0.5rem", marginBottom: "-0.2rem" }} />

            <p className="ml-1 paragraph" style={{ marginTop: "0.1rem" }}>
              Cash
            </p>
            <p className="ml-1 paragraph  ">Change</p>
            {/* <hr style={{ marginRight: "-0.5rem", marginBottom: "-0.2rem" }} /> */}
            <p className="ml-1 paragraph   ">Vatable Sales</p>
            <p className="ml-1 paragraph mb-1 ">VAT(12%)</p>
          </td>
          <td style={{ borderLeft: "none", fontSize: "1rem" }}>
            <p className="mr-1 paragraph  mt-1 text-right">
              ₱{formattedTotal(transac.totalWithoutDeduc)}
            </p>
            <p className="mr-1 paragraph text-right ">
              ₱{formattedTotal(transac?.totalDiscount || 0)}
            </p>
            <p className="mr-1 paragraph text-right">
              ₱{formattedTotal(refund)}
            </p>
            <p className="mr-1 paragraph   text-right">
              ₱{formattedTotal(netSales)}
            </p>

            <p className="mr-1 paragraph text-right">
              ₱{formattedTotal(transac?.totalDue)}
            </p>
            <hr style={{ marginBottom: "-0.2rem" }} />

            <p
              className="mr-1 paragraph text-right "
              style={{ marginTop: "0.1rem" }}
            >
              ₱{formattedTotal(transac?.cash)}
            </p>
            <p className="mr-1 paragraph text-right">
              ₱{formattedTotal(transac.cash - transac?.totalDue)}
            </p>
            {/* <hr style={{ marginBottom: "-0.2rem" }} /> */}

            <p className="mr-1 paragraph text-right">
              ₱{formattedTotal(Number(vatSales))}
            </p>
            <p className="mr-1 paragraph text-right  mb-1">
              ₱{formattedTotal(Number(vat))}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Table;
