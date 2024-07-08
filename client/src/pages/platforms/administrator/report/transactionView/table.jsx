import React from "react";
import { variation } from "../../../../../services/utilities";
import getTotalRefundAmount from "../getTotalRefund";

const Table = ({ orderDetails, transaction }) => {
  const handleRefundView = (order) => {
    const {
      product,
      quantityRefund = 0,
      kiloGramsRefund = 0,
      kiloRefund = 0,
    } = order;

    const { isPerKilo } = product;

    if (quantityRefund > 0 || kiloGramsRefund > 0 || kiloRefund > 0) {
      return variation.qtyOrKilo(
        {
          quantity: quantityRefund,
          kilo: kiloRefund,
          kiloGrams: kiloGramsRefund,
        },
        isPerKilo
      );
    } else {
      return "--";
    }
  };

  const gramsConverter = (grams) => {
    switch (grams) {
      case 5:
        return 0.5;
      case 75:
        return 0.75;
      case 25:
        return 0.25;
      default:
        return grams;
    }
  };

  const handleViewOriginalQtyKilo = (order) => {
    const {
      product,
      quantity = 0,
      quantityRefund = 0,
      kilo = 0,
      kiloRefund = 0,
      kiloGrams,
      kiloGramsRefund = 0,
    } = order;
    if (product.isPerKilo) {
      const totalNet = kilo + kiloGrams;
      const totalRefund = kiloRefund + kiloGramsRefund;
      const total = totalNet + totalRefund;
      const totalInArray = String(total).split(".");
      var totalKilo = Number(totalInArray[0] || 0);
      var totalGrams = Number(totalInArray[1] || 0);
      return variation.qtyOrKilo(
        { ...order, kilo: totalKilo, kiloGrams: gramsConverter(totalGrams) },
        product.isPerKilo
      );
    } else {
      const total = quantity + quantityRefund;
      return variation.qtyOrKilo(
        { ...order, quantity: total },
        product.isPerKilo
      );
    }
  };

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
                {handleViewOriginalQtyKilo(order)}
              </td>

              <td className="text-center">{handleRefundView(order)}</td>
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
            <p className="ml-3 paragraph mt-1">Total Products Amount</p>
            <p className="ml-3 paragraph">Total Refund Amount</p>
            <p className="ml-3 paragraph  mb-2">Total Sales</p>
          </td>
          <td style={{ borderLeft: "none", fontSize: "1rem" }}>
            <p className="ml-4 paragraph  mt-1">
              ₱{transaction?.totalWithoutDeduc?.toLocaleString()}.00
            </p>
            <p className="ml-4 paragraph">
              ₱{getTotalRefundAmount(transaction.products)?.toLocaleString()}.00
            </p>
            <p className="ml-4 paragraph mb-2">
              ₱{transaction?.total?.toLocaleString()}.00
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Table;
