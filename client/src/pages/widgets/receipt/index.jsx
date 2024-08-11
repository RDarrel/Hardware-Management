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
  customerView,
  isReturnRefund = false,
  isReturn = false,
  cashier = "",
  createdAt = "",
  reason = "",
  isAdmin = false,
  cash = 0,
  isWalkin,
  customerQuotation = "",
  handleSuspend = () => {},
  setCustomerQuotation = () => {},
  setOrders = () => {},
}) {
  const { auth, token } = useSelector(({ auth }) => auth),
    [customer, setCustomer] = useState(""),
    dispatch = useDispatch();

  useEffect(() => {
    setCustomer(customerQuotation);
  }, [show, customerQuotation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    window.open(
      "/printOut",
      "Claim Stub",
      "top=100px,left=100px,width=550px,height=750px"
    );
    const purchases = orderDetails.map((order) => {
      const { product } = order;
      const { hasVariant } = product;
      return {
        ...order,
        ...(hasVariant && {
          variant: variation.name(order, product.variations),
        }),
      };
    });
    const printData = {
      invoice_no,
      customer,
      total,
      cash,
      purchases,
    };

    localStorage.setItem("collection", JSON.stringify(printData));

    dispatch(
      POS({
        token,
        data: {
          customer,
          invoice_no,
          cashier: auth._id,
          total,
          cash,
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
    setCustomerQuotation("");
    setOrders([]);
    toggle();
  };
  const handleSend = (e) => {
    e.preventDefault();
    handleSuspend(customer);
    setCustomerQuotation("");
    // setInvoice_no("");
    // setOrders([]);
    // toggle();
  };
  const change = cash - total || 0;

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="lg" centered>
      <MDBModalBody className="mb-0 m-0 p-0">
        <form onSubmit={!isWalkin ? handleSubmit : handleSend}>
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
            reason={reason}
            isWalkin={isWalkin}
          />
          <div className={`mx-2 mt-${isAdmin ? "2" : "4"}`}>
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
                          {order?.product?.name?.toUpperCase()}
                        </span>
                        {order.product.hasVariant && (
                          <span style={{ marginTop: "-30px" }} className="mr-1">
                            Variant:
                            {variation.getTheVariant(
                              order?.variant1,
                              order?.variant2 || "",
                              order?.product?.variations
                            )}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-center text-nowrap">
                      {variation.qtyOrKilo(order, order?.product?.isPerKilo)}
                    </td>

                    <td className="text-center">₱{order?.srp}</td>
                    <td className="text-center">
                      ₱{order.subtotal.toLocaleString()}
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
                    <p
                      className={`ml-3 paragraph ${
                        !isWalkin ? "mt-1" : "mb-1"
                      } text-nowrap`}
                    >
                      Total Amount
                    </p>
                    {!isWalkin && (
                      <>
                        <p className="ml-3 paragraph"> Cash</p>
                        <p className="ml-3 paragraph  mb-2">Change</p>
                      </>
                    )}
                  </td>
                  <td style={{ borderLeft: "none", fontSize: "1rem" }}>
                    <p
                      className={`ml-4 paragraph   ${
                        !isWalkin ? "mt-1" : "mb-1"
                      }`}
                    >
                      ₱{total.toLocaleString()}.00
                    </p>
                    {!isWalkin && (
                      <>
                        <p className="ml-4 paragraph">
                          ₱{cash.toLocaleString()}.00
                        </p>
                        <p className="ml-4 paragraph mb-2">
                          ₱{change.toLocaleString()}.00
                        </p>
                      </>
                    )}
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
                {!isWalkin ? "Proceed" : "Send to cashier"}
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
