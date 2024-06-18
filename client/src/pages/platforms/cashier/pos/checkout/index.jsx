import React from "react";
import Swal from "sweetalert2";
import { POS } from "../../../../../services/redux/slices/cart";
import { MDBBtn, MDBModal, MDBModalBody } from "mdbreact";
import { variation } from "../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import "./checkout.css";
import Header from "./header";
export default function Checkout({
  show,
  toggle,
  total,
  invoice_no,
  orderDetails,
  setOrders,
}) {
  const { auth, token } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      POS({
        token,
        data: { invoice_no, cashier: auth._id, total, purchases: orderDetails },
      })
    );
    Swal.fire({
      title: "Successfully Paid",
      icon: "success",
    });
    setOrders([]);
    toggle();
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="lg" centered>
      <MDBModalBody className="mb-0 m-0 p-0">
        <Header invoice_no={invoice_no} />
        <form onSubmit={handleSubmit}>
          <div className="mx-2 mt-4">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Items</th>
                  <th>Quantity/Kilo</th>

                  <th>SRP</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.map((order, index) => (
                  <tr key={`${order._id}-${index}`}>
                    <td>
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
                    <td>
                      {variation.qtyOrKilo(order, order.product.isPerKilo)}
                    </td>

                    <td>₱{order.srp}</td>
                    <td>₱{order.subtotal}</td>
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
                    colSpan="2"
                    style={{ borderRight: "none", fontSize: "1rem" }}
                  >
                    <p>Total: ₱{total.toLocaleString()}</p>
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
              Proceed
            </MDBBtn>
            <MDBBtn
              type="button"
              onClick={() => toggle()}
              color="light"
              className="mb-2 font-weight-bold float-right"
            >
              Cancel
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
