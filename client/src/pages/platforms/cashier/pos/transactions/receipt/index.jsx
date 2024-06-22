import React from "react";
import Swal from "sweetalert2";
import { MDBBtn, MDBIcon } from "mdbreact";
import { variation } from "../../../../../../services/utilities";
import "./receipt.css";
import Header from "./header";
export default function Receipt({
  toggle,
  total = 0,
  invoice_no = "",
  orderDetails = [],
  createdAt = "",
}) {
  const handleReturn = (order) => {
    const { product } = order;

    if (product.isPerKilo) {
      Swal.fire({
        title: "Return Kilo",
        html: `
         <p >Please enter the kilo you want to return:</p>
          <div style="display: flex; align-items: center;">
            <input class="form-control" id="kilo-input" type="number" min="1"  value=${
              order.kilo
            } placeholder="Enter Kilo">
            <select id="weight-select" class="form-control w-25" value=${
              order.kiloGrams
            }>
              <option value="0" ${
                order.kiloGrams === 0 ? "selected" : ""
              }>Kl</option>
              <option value="0.25"  ${
                order.kiloGrams === 0.25 ? "selected" : ""
              }>1/4</option>
              <option value="0.50"  ${
                order.kiloGrams === 0.5 ? "selected" : ""
              }>1/2</option>
              <option value="0.75"  ${
                order.kiloGrams === 0.75 ? "selected" : ""
              }>3/4</option>
            </select>
          </div>
        `,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Return",
        reverseButtons: true,

        preConfirm: () => {
          const kilo = Number(document.getElementById("kilo-input").value || 0);
          const kiloGrams = Number(
            document.getElementById("weight-select").value || 0
          );

          const totalPurchase = order.kilo + order.kiloGrams;
          const totalReturn = kilo + kiloGrams;
          var gramsMessage = "";

          switch (order.kiloGrams) {
            case 0.25:
              gramsMessage = "1/4";
              break;
            case 0.5:
              gramsMessage = "1/2";
              break;
            default:
              gramsMessage = "3/4";
              break;
          }
          if (totalReturn < 0.25) {
            Swal.showValidationMessage("Minimum kg you can return is 1/2");
          }

          if (totalReturn > totalPurchase) {
            Swal.showValidationMessage(
              `Maximum kg you can return is ${order.kilo} kg ${
                order.kiloGrams !== 0 ? `and ${gramsMessage}` : ""
              }`
            );
          }

          return { kilo, kiloGrams };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const { kilo, kiloGrams } = result.value;
          console.log("Quantity to return:", kilo);
          console.log("Selected weight:", kiloGrams);
          // Add further logic to handle the quantity and weight
        }
      });
    } else {
      console.log(order.quantity);
      Swal.fire({
        title: "Return Quantity",
        text: "Please enter the quantity you want to return:",
        input: "number",
        inputValue: order.quantity,

        reverseButtons: true,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Return",

        preConfirm: () => {
          const input = Swal.getInput().value.trim(); // Kunin ang input at alisin ang leading at trailing spaces
          const quantity = parseFloat(input); // Convert to float para ma-allow ang decimals
          if (isNaN(quantity) || quantity <= 0) {
            Swal.showValidationMessage("Minimum quantity you can return is 1");
            return false; // Return false to prevent submission
          }

          if (quantity > order.quantity) {
            Swal.showValidationMessage(
              `Maximum quantity you can return is ${order.quantity}`
            );
            return false; // Return false to prevent submission
          }

          if (quantity % 1 !== 0) {
            Swal.showValidationMessage("Please enter a valid integer quantity");
            return false; // Return false to prevent submission
          }
          return quantity;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(result.value);
          // Handle the quantity input value
          // const quantity = result.value;
          // You can add further logic here to handle the returned quantity
        }
      });
    }
  };

  return (
    <div className="m-0 p-0">
      <Header invoice_no={invoice_no} createdAt={createdAt} />
      <div className="mx-2 p-1 mt-3">
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
            {orderDetails.map((order, index) => (
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
                  <MDBBtn
                    onClick={() => handleReturn(order)}
                    size="sm"
                    color="primary"
                    title="Return Product"
                  >
                    <MDBIcon icon="share" size="1x" />
                  </MDBBtn>
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
      </div>
      <div className="text-center mb-1-half mt-2">
        <MDBBtn
          type="button"
          onClick={() => toggle()}
          color="light"
          className="mb-2 font-weight-bold float-right"
        >
          Close
        </MDBBtn>
      </div>
    </div>
  );
}
