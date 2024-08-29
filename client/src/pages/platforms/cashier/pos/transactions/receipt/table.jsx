import React from "react";
import { MDBBtn, MDBIcon } from "mdbreact";
import { variation } from "../../../../../../services/utilities";
import formattedTotal from "../../../../../../services/utilities/forattedTotal";
import productOrder from "../../../../../../services/utilities/product";

const Table = ({ handleAction, orderDetails = [], total, cash, hasRefund }) => {
  const change = cash - total || 0;
  const purchases =
    orderDetails.length > 0
      ? orderDetails?.filter(({ isRefundAll }) => !isRefundAll)
      : [];
  return (
    <table className="invoice-table">
      <thead>
        <tr>
          <th>Items</th>
          <th className="text-center">Quantity/Kilo</th>
          {hasRefund && (
            <>
              <th className="text-center">Refund Quantity/Kilo</th>
              <th className="text-center">Net Quantity/Kilo</th>
            </>
          )}
          <th className="text-center">SRP</th>
          <th className="text-center">Subtotal</th>
          <th className="text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {purchases?.length > 0 &&
          purchases.map((order, index) => {
            const {
              product,
              quantityReturn,
              kiloReturn,
              quantity,
              kilo,
              kiloGrams,
            } = order;
            const { isPerKilo = false } = product;
            const allProductIsReplace = isPerKilo
              ? kilo + kiloGrams === kiloReturn
              : quantity === quantityReturn;
            return (
              <tr key={`${order._id}-${index}`}>
                <td width={hasRefund ? "" : "400px"}>
                  <div className="d-flex flex-column">
                    <span
                      style={{
                        maxWidth: `400px`,
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
                  {!hasRefund
                    ? variation.qtyOrKilo(order, order.product.isPerKilo)
                    : productOrder.originalQtyKilo(order)}
                </td>
                {hasRefund && (
                  <>
                    <td className="text-center">
                      {productOrder.refund(order)}
                    </td>
                    <td className="text-center">
                      {variation.qtyOrKilo(order, order.product.isPerKilo)}
                    </td>
                  </>
                )}

                <td className="text-center">₱{order.srp}</td>
                <td className="text-center">
                  ₱{order.subtotal.toLocaleString()}
                </td>
                <td className="text-center">
                  {!allProductIsReplace ? (
                    <MDBBtn
                      onClick={() => handleAction(order, index, true)}
                      size="sm"
                      color="primary"
                      title="Replacement Product"
                    >
                      <MDBIcon icon="reply" size="1x" />
                    </MDBBtn>
                  ) : (
                    <p className="text-danger">Replacement Limit Reached</p>
                  )}
                </td>
              </tr>
            );
          })}
        <tr className="p-2 ">
          <td
            colSpan={hasRefund ? "3" : "2"}
            style={{
              borderBottomColor: "transparent",
              borderLeftColor: "transparent",
            }}
          ></td>
          <td
            colSpan={hasRefund ? "2" : "1"}
            className="pl-1 "
            style={{ borderRight: "none", fontSize: "1rem" }}
          >
            {hasRefund && <p className="ml-3 paragraph mt-1">Total Refund</p>}
            <p className={`ml-3 paragraph ${!hasRefund ? "mt-1" : ""} `}>
              Total Amount
            </p>
            <p className="ml-3 paragraph"> Cash</p>
            <p className="ml-3 paragraph  mb-2">Change</p>
          </td>
          <td style={{ borderLeft: "none", fontSize: "1rem" }}>
            <p className="ml-4 paragraph  mt-1">₱{formattedTotal(total)}</p>
            <p className="ml-4 paragraph">₱{cash.toLocaleString()}.00</p>
            <p className={`ml-4 paragraph ${!hasRefund ? "mb-1" : ""}`}>
              ₱{formattedTotal(change)}.00
            </p>
            {hasRefund && (
              <p className="ml-4 paragraph mb-2">
                ₱{formattedTotal(change)}.00
              </p>
            )}
          </td>
          <td
            style={{
              borderRightColor: "transparent",
              borderBottomColor: "transparent",
            }}
          >
            {null}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Table;
