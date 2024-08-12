import React from "react";
import { variation } from "../../../../../../../services/utilities";
import formattedTotal from "../../../../../../../services/utilities/forattedTotal";

const Table = ({ orderDetails, total, cash, change, isTransaction }) => {
  return (
    <table className="invoice-table">
      <thead>
        <tr>
          <th>Items</th>
          <th className="text-center">Quantity/Kilo</th>

          <th className="text-center">SRP</th>
          <th className="text-center">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {orderDetails.map((order, index) => (
          <tr key={`${order._id}-${index}`}>
            <td style={{ width: "420px" }}>
              <div className="d-flex flex-column">
                <span
                  style={{
                    maxWidth: "420px",
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
              {variation.qtyOrKilo(order, order.product.isPerKilo)}
            </td>

            <td className="text-center">₱{order.srp}</td>
            <td className="text-center">₱{formattedTotal(order?.subtotal)}</td>
          </tr>
        ))}
        <tr className="p-2 ">
          <td
            colSpan="2"
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
            <p
              className={`ml-3 paragraph mt-1 text-nowrap ${
                !isTransaction ? "mb-1" : ""
              }`}
            >
              Total Amount
            </p>
            {isTransaction && (
              <>
                <p className="ml-3 paragraph"> Cash</p>
                <p className="ml-3 paragraph  mb-2">Change</p>
              </>
            )}
          </td>
          <td style={{ borderLeft: "none", fontSize: "1rem" }}>
            <p
              className={`ml-4 paragraph  mt-1 ${!isTransaction ? "mb-1" : ""}`}
            >
              ₱{formattedTotal(total)}
            </p>
            {isTransaction && (
              <>
                <p className="ml-4 paragraph">₱{cash?.toLocaleString()}</p>
                <p className="ml-4 paragraph mb-2">
                  ₱{formattedTotal(change)}{" "}
                </p>
              </>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Table;
