import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { POS } from "../../../services/redux/slices/cart";
import { UPDATE_MAX } from "../../../services/redux/slices/administrator/productManagement/products";
import { MDBBtn, MDBModal, MDBModalBody } from "mdbreact";
import { variation } from "../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import "./receipt.css";
import Header from "./header";
export default function Receipt({
  show,
  toggle,
  total = 0,
  invoice_no = "",
  orderDetails = [],
  setInvoice_no,
  setOrders = () => {},
  customerView,
  isReturnRefund = false,
  isReturn = false,
  cashier = "",
  createdAt = "",
  isAdmin = false,
}) {
  const { auth, token } = useSelector(({ auth }) => auth),
    [customer, setCustomer] = useState(""),
    dispatch = useDispatch();

  useEffect(() => {
    setCustomer("");
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      POS({
        token,
        data: {
          customer,
          invoice_no,
          cashier: auth._id,
          total,
          purchases: orderDetails,
        },
      })
    );

    dispatch(UPDATE_MAX({ purchases: orderDetails }));
    Swal.fire({
      title: "Successfully Paid",
      icon: "success",
    });
    setInvoice_no("");
    setOrders([]);
    toggle();
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="lg" centered>
      <MDBModalBody className="mb-0 m-0 p-0">
        <Header
          invoice_no={invoice_no}
          createdAt={createdAt}
          customer={customer}
          setCustomer={setCustomer}
          isReturn={isReturn}
          isReturnRefund={isReturnRefund}
          isAdmin={isAdmin}
          cashier={cashier}
          customerView={customerView}
        />
        <form onSubmit={handleSubmit}>
          <div className="mx-2 mt-4">
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
                    <td className="text-center">
                      {variation.qtyOrKilo(order, order.product.isPerKilo)}
                    </td>

                    <td className="text-center">₱{order.srp}</td>
                    <td className="text-center">
                      ₱{order.subtotal.toLocaleString()}
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
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center mb-1-half mt-2">
            {!isAdmin && (
              <MDBBtn
                type="submit"
                color="primary"
                className="mb-2 font-weight-bold float-right"
              >
                Proceed
              </MDBBtn>
            )}
            <MDBBtn
              type="button"
              onClick={() => toggle()}
              color="light"
              className="mb-2 font-weight-bold float-right"
            >
              {!isAdmin ? "Cancel" : "Close"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
