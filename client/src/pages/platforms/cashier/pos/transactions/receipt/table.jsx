import React from "react";
import { MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";
import { variation } from "../../../../../../services/utilities";

const Table = ({ handleAction, orderDetails, total }) => {
  return (
    <table className="invoice-table">
      <thead>
        <tr>
          <th>Items</th>
          <th className="text-center">Quantity/Kilo</th>

          <th className="text-center">SRP</th>
          <th className="text-center">Subtotal</th>
          <th className="text-center">Action</th>
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
                {variation.qtyOrKilo(order, order.product.isPerKilo)}
              </td>

              <td className="text-center">₱{order.srp}</td>
              <td className="text-center">
                ₱{order.subtotal.toLocaleString()}
              </td>
              <td className="text-center">
                <MDBBtnGroup>
                  <MDBBtn
                    onClick={() => handleAction(order, index, true)}
                    size="sm"
                    color="primary"
                    title="Return Product"
                  >
                    <MDBIcon icon="reply" size="1x" />
                  </MDBBtn>
                  <MDBBtn
                    onClick={() => handleAction(order, index, false)}
                    size="sm"
                    color="danger"
                    title="Refund Product"
                  >
                    <MDBIcon icon="share" size="1x" />
                  </MDBBtn>
                </MDBBtnGroup>
              </td>
            </tr>
          ))}
        <tr>
          <td
            colSpan="3"
            style={{
              borderBottomColor: "transparent",
              borderLeftColor: "transparent",
            }}
          ></td>
          <td
            colSpan="1"
            className="text-center"
            style={{ borderRight: "none", fontSize: "1rem" }}
          >
            <p>Total: ₱{total.toLocaleString()}</p>
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
