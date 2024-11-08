import React from "react";
import { MDBBtn, MDBIcon } from "mdbreact";
import { variation } from "../../../../../../services/utilities";
import formattedTotal from "../../../../../../services/utilities/forattedTotal";
import productOrder from "../../../../../../services/utilities/product";

const Table = ({
  handleAction,
  orderDetails = [],
  cash,
  hasRefund,
  foundTransaction,
}) => {
  const change = cash - foundTransaction.totalDue || 0;
  const purchases =
    orderDetails.length > 0
      ? orderDetails?.filter(({ isRefundAll }) => !isRefundAll)
      : [];

  const {
    totalWithoutDeduc: grossSales = 0,
    totalDiscount: discount = 0,
    totalRefundSales: refund = 0,
  } = foundTransaction;

  const netSales = grossSales - discount + refund;
  const vatableSales = netSales / 1.12;
  const vat = vatableSales * 0.12;

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
            <p className="text-start paragraph mt-1">Total: </p>
            <p className="text-start paragraph">Total Discount: </p>

            {hasRefund && <p className="ml-3 paragraph ">Total Refund:</p>}
            <p className={`text-start paragraph`}>Total Due:</p>
            <hr style={{ marginRight: "-0.5rem", marginBottom: "-0.2rem" }} />
            <p className="text-start paragraph"> Cash:</p>
            <p className="text-start paragraph ">Change:</p>
            <p className="text-start paragraph  ">Vatable Sales:</p>
            <p className="text-start paragraph  mb-1">VAT(12%):</p>
          </td>
          <td style={{ borderLeft: "none", fontSize: "1rem" }}>
            <p className={`text-right paragraph mt-1`}>
              ₱{formattedTotal(foundTransaction.totalWithoutDeduc)}
            </p>
            <p className={`text-right paragraph `}>
              ₱{formattedTotal(foundTransaction.totalDiscount)}
            </p>
            {hasRefund && (
              <p className="text-right paragraph ">
                ₱{formattedTotal(foundTransaction.totalRefundSales)}
              </p>
            )}
            <p className={`text-right paragraph `}>
              ₱{formattedTotal(foundTransaction.totalDue)}
            </p>
            <hr style={{ marginBottom: "-0.2rem" }} />
            <p className="text-right paragraph">₱{formattedTotal(cash)}</p>
            <p className={`text-right paragraph `}>₱{formattedTotal(change)}</p>
            <p className={`text-right paragraph `}>
              ₱{formattedTotal(vatableSales)}
            </p>
            <p className={`text-right paragraph mb-1 `}>
              ₱{formattedTotal(vat)}
            </p>
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
