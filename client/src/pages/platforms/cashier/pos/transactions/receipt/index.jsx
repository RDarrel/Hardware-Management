import React from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { MDBBtn } from "mdbreact";
import { transaction } from "../../../../../../services/utilities";
import {
  REFUND_PRODUCTS,
  RETURN_PRODUCTS,
} from "../../../../../../services/redux/slices/cashier/pos";
import Table from "./table";
import "./receipt.css";
import Header from "./header";
export default function Receipt({
  toggle,
  setPurchases,
  transactionToggle,
  setTotal,
  total = 0,
  customer = "",
  invoice_no = "",
  orderDetails = [],
  createdAt = "",
}) {
  const { token, auth } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

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

  const noHavePurchases = (_purchases) => {
    return _purchases.every((purchase) => purchase.isRefundAll);
  };

  const handleSwalMessage = (isReturn) => {
    return Swal.fire(
      "Successfully!",
      `${isReturn ? "Return" : "Refund"}`,
      "success"
    );
  };
  const handleAction = (order, index, isReturn) => {
    const { product } = order;

    if (product.isPerKilo) {
      Swal.fire({
        title: `${isReturn ? "Return" : "Refund"} Kilo`,
        html: `
           <div>

            <p >Please enter the kilo you want to ${
              isReturn ? "return" : "refound"
            }:</p>
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

             <label for="return-reason">Reason for ${
               isReturn ? "return" : "refund"
             }:</label>
      <textarea id="return-reason" class="swal2-textarea form-control m-0 p-0"  placeholder="Enter the reason for ${
        isReturn ? "return" : "refund"
      } ..."></textarea>
           </div>

        `,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: isReturn ? "Return" : "Refund",
        reverseButtons: true,

        preConfirm: () => {
          const kilo = Number(document.getElementById("kilo-input").value || 0);
          const kiloGrams = Number(
            document.getElementById("weight-select").value || 0
          );

          const reason = document.getElementById("return-reason").value.trim();

          const totalPurchase = (order?.kilo || 0) + (order?.kiloGrams || 0);
          const purchaseGrams = order.kiloGrams || 0;
          const totalReturn = kilo + kiloGrams;
          var gramsMessage = "";

          switch (purchaseGrams) {
            case 0.25:
              gramsMessage = "1/4";
              break;
            case 0.5:
              gramsMessage = "1/2";
              break;

            case 0.75:
              gramsMessage = "3/4";
              break;
            default:
              gramsMessage = "kl";
              break;
          }
          if (totalReturn < 0.25) {
            Swal.showValidationMessage(
              `Minimum kg you can ${isReturn ? "return" : "refund"} is 1/2`
            );
          }

          if (totalReturn > totalPurchase) {
            Swal.showValidationMessage(
              `Maximum kg you can ${isReturn ? "return" : "refund"} is ${
                order.kilo
              } kg ${purchaseGrams !== 0 ? `and ${gramsMessage}` : ""}`
            );
          }

          if (!reason) {
            Swal.showValidationMessage(
              `Please enter a reason for the ${isReturn ? "return" : "refund"}`
            );
            return false;
          }

          return { kilo, kiloGrams, reason };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const { kilo, kiloGrams = 0, reason } = result.value;

          if (isReturn) {
            dispatch(
              RETURN_PRODUCTS({
                token,
                data: {
                  customer,
                  invoice_no,
                  returnBy: auth._id,
                  products: [{ ...order, kilo, kiloGrams }],
                  reason,
                },
              })
            );
          } else {
            const _purchases = [
              ...orderDetails.filter(({ isRefundAll }) => !isRefundAll),
            ];
            const purchaseTotalKg =
              (_purchases[index].kilo || 0) +
              (_purchases[index]?.kiloGrams || 0);

            const refundKg = kilo + kiloGrams;
            const newTotalKg = purchaseTotalKg - refundKg;

            if (newTotalKg <= 0) {
              _purchases[index] = { ..._purchases[index], isRefundAll: true };
            } else {
              if (newTotalKg >= 1) {
                const totalKgInArray = String(newTotalKg).split(".");
                _purchases[index] = {
                  ..._purchases[index],
                  kilo: Number(totalKgInArray[0]),
                  kiloGrams: gramsConverter(Number(totalKgInArray[1] || 0)),
                };
              } else {
                _purchases[index] = {
                  ..._purchases[index],
                  kilo: 0,
                  kiloGrams: gramsConverter(newTotalKg),
                };
              }
            }

            if (noHavePurchases(_purchases)) {
              toggle();
              transactionToggle();
            }

            const newTotal =
              transaction.getTotal(
                _purchases?.filter(({ isRefundAll }) => !isRefundAll) || []
              ) || 0;
            setTotal(newTotal);
            setPurchases(
              transaction.computeSubtotal(
                _purchases?.filter(({ isRefundAll }) => !isRefundAll) || []
              )
            );
            dispatch(
              REFUND_PRODUCTS({
                token,
                data: {
                  customer,
                  invoice_no,
                  refundBy: auth._id,
                  products: [{ ...order, kilo, kiloGrams }],
                  reason,
                  newTotal,
                },
              })
            );
          }

          handleSwalMessage(isReturn);
        }
      });
    } else {
      Swal.fire({
        title: `${isReturn ? "Return" : "Refound"} Quantity`,
        html: `
         <div class=" w-100 m-0 p-0">
      <label for="quantity-input">Please enter the quantity you want to ${
        isReturn ? "return" : "refund"
      }:</label>
      <input id="quantity-input" type="number" class="swal2-input form-control m-0 p-0 mb-2 text-center" value="${
        order.quantity
      }">
      <label for="return-reason">Reason for ${
        isReturn ? "return" : "refund"
      }:</label>
      <textarea id="return-reason" class="swal2-textarea form-control m-0 p-0"  placeholder="Enter the reason for ${
        isReturn ? "return" : "refund"
      } ..."></textarea>
    </div>
        `,
        reverseButtons: true,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: isReturn ? "Return" : "Refund",
        preConfirm: () => {
          const input = document.getElementById("quantity-input").value.trim();
          const reason = document.getElementById("return-reason").value.trim();
          const quantity = parseFloat(input);

          if (isNaN(quantity) || quantity <= 0) {
            Swal.showValidationMessage(
              `Minimum quantity you can ${isReturn ? "return" : "refund"} is 1`
            );
            return false;
          }

          if (quantity > order.quantity) {
            Swal.showValidationMessage(
              `Maximum quantity you can ${isReturn ? "return" : "refund"} is ${
                order.quantity
              }`
            );
            return false;
          }

          if (quantity % 1 !== 0) {
            Swal.showValidationMessage("Please enter a valid integer quantity");
            return false;
          }

          if (!reason) {
            Swal.showValidationMessage(
              `Please enter a reason for the ${isReturn ? "return" : "refund"}`
            );
            return false;
          }

          return { quantity, reason };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const { quantity, reason } = result.value;

          if (isReturn) {
            dispatch(
              RETURN_PRODUCTS({
                token,
                data: {
                  customer,
                  invoice_no,
                  returnBy: auth._id,
                  products: [{ ...order, quantity: quantity }],
                  reason: reason,
                },
              })
            );
          } else {
            const _purchases = [
              ...orderDetails.filter(({ isRefundAll }) => !isRefundAll),
            ];
            const _purchaseQty = _purchases[index].quantity;
            const totalQty = _purchaseQty - quantity;

            if (totalQty <= 0) {
              _purchases[index] = { ..._purchases[index], isRefundAll: true };
            } else {
              _purchases[index].quantity -= quantity;
            }
            if (noHavePurchases(_purchases)) {
              toggle();
              transactionToggle();
            }
            const newTotal =
              transaction.getTotal(
                _purchases.filter(({ isRefundAll }) => !isRefundAll)
              ) || 0;

            setTotal(newTotal);
            setPurchases(
              transaction.computeSubtotal(
                _purchases.filter(({ isRefundAll }) => !isRefundAll)
              )
            );

            dispatch(
              REFUND_PRODUCTS({
                token,
                data: {
                  customer,
                  invoice_no,
                  refundBy: auth._id,
                  products: [{ ...order, quantity: quantity }],
                  reason: reason,
                  newTotal,
                },
              })
            );
          }
          handleSwalMessage(isReturn);
        }
      });
    }
  };

  return (
    <div className="m-0 p-0">
      <Header
        invoice_no={invoice_no}
        createdAt={createdAt}
        customer={customer}
      />
      <div className="mx-2 p-1 mt-3">
        <Table
          handleAction={handleAction}
          orderDetails={orderDetails}
          total={total}
        />
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
