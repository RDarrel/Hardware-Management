import React from "react";
import { MDBBtn } from "mdbreact";
// import "./receipt.css";
import Header from "./header";
import { variation } from "../../../../../../services/utilities";
export default function View({
  toggle,
  total = 0,
  invoice_no = "",
  orderDetails = [],
  createdAt = "",
  handleResume,
  selectedTransac,
  isQuotation,
  customer,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleResume(selectedTransac);
  };

  return (
    <>
      <Header
        invoice_no={invoice_no}
        createdAt={createdAt}
        isQuotation={isQuotation}
        customer={customer}
      />
      <form onSubmit={handleSubmit}>
        <div className={`mx-2 mt-2`}>
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
                        {order.product?.name?.toUpperCase()}
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

                  <td className="text-center">₱{order?.srp}</td>
                  <td className="text-center">
                    ₱{order?.subtotal?.toLocaleString()}
                  </td>
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
                  <p className="ml-3 paragraph mt-1 text-nowrap">
                    Total Amount
                  </p>
                  <p className="ml-3 paragraph"> Cash</p>
                  <p className="ml-3 paragraph  mb-2">Change</p>
                </td>
                <td style={{ borderLeft: "none", fontSize: "1rem" }}>
                  <p className="ml-4 paragraph  mt-1">
                    ₱{total.toLocaleString()}.00
                  </p>
                  <p className="ml-4 paragraph">₱0.00</p>
                  <p className="ml-4 paragraph mb-2">₱0.00</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-center mb-1-half mt-2">
          <MDBBtn
            type="submit"
            color="primary"
            className="mb-2 font-weight-bold float-right"
          >
            {isQuotation ? "Place Order" : "Resume"}
          </MDBBtn>
          <MDBBtn
            type="button"
            onClick={() => toggle()}
            color="light"
            className="mb-2 font-weight-bold float-right"
          >
            Close
          </MDBBtn>
        </div>
      </form>
    </>
  );
}
