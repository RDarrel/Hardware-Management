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
import productOrder from "../../../../../../services/utilities/product";
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
  cash = 0,
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

  const handleReturn = (_purchases, index, reason, order, totalReturn) => {
    const { product } = order;
    const { isPerKilo = false } = product;
    const _return = isPerKilo
      ? convertedKilo(totalReturn)
      : { quantity: totalReturn };
    const baseKey = isPerKilo ? "kiloReturn" : "quantityReturn";
    dispatch(
      RETURN_PRODUCTS({
        token,
        data: {
          customer,
          invoice_no,
          returnBy: auth._id,
          products: [{ ...order, ..._return }],
          reason,
        },
      })
    );

    _purchases[index] = {
      ..._purchases[index],
      [baseKey]: (_purchases[index][baseKey] += totalReturn),
    };
  };

  const handleRefund = (_purchases, order, reason, refund) => {
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
          products: [{ ...order, ...refund }],
          reason,
          newTotal,
        },
      })
    );
  };

  const convertedKilo = (_kilo) => {
    const numberToArray = String(_kilo).split("."); //kung ilan lang yung sufficient yun lang din marerturn
    const kilo = Number(numberToArray[0] || 0);
    const kiloGrams = gramsConverter(Number(numberToArray[1] || 0));

    return { kilo, kiloGrams };
  };
  const handleAction = (order, index, isReturn) => {
    var {
      product,
      kiloReturn = 0,
      kilo = 0,
      kiloGrams = 0,
      quantityReturn = 0,
      quantity = 0,
      max = 0,
    } = order;
    if (product.isPerKilo) {
      const availableReturn = kilo + kiloGrams - kiloReturn;
      const arrayAvail = String(availableReturn).split(".");
      const availReturnKilo = Number(arrayAvail[0] || 0);
      const availReturnGrams = Number(arrayAvail[1] || 0);

      Swal.fire({
        title: `${isReturn ? "Replacement" : "Refund"} Kilo`,
        html: `
           <div>
            ${
              kiloReturn
                ? `<p style="font-weight:bold">
                  Your available replacement is 
                  ${productOrder.kiloText(availableReturn)} because you have
                  already replaced ${productOrder.kiloText(kiloReturn)}.
                </p>`
                : ""
            }

            <p >Please enter the kilo you want to ${
              isReturn ? "replacement" : "refund"
            }:</p>
          <div style="display: flex; align-items: center;">
            <input class="form-control" id="kilo-input" type="number" min="0"  value=${availReturnKilo} placeholder="Enter Kilo">
            <select id="weight-select" class="form-control w-25" value=${availReturnGrams}>
              <option value="0" ${
                availReturnGrams === 0 ? "selected" : ""
              }>Kl</option>
              <option value="0.25"  ${
                availReturnGrams === 25 ? "selected" : ""
              }>1/4</option>
              <option value="0.50"  ${
                availReturnGrams === 5 ? "selected" : ""
              }>1/2</option>
              <option value="0.75"  ${
                availReturnGrams === 75 ? "selected" : ""
              }>3/4</option>
            </select>
          </div>

             <label for="return-reason">Reason for ${
               isReturn ? "replacement" : "refund"
             }:</label>
       <select id="return-reason"  class="swal2-select text-center form-control m-0 p-0">
            <option value="Defective or damaged product">Defective or damaged product</option>
            <option value="Wrong item">Wrong item</option>
            <option value="Quality issues">Quality issues</option>
            <option value="Expired items">Expired items</option>
            <option value="Fitment issues">Fitment issues</option>
          </select>
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

          const totalReturn = kilo + kiloGrams;
          var gramsMessage = "";

          switch (availReturnGrams) {
            case 25:
              gramsMessage = "1/4";
              break;
            case 5:
              gramsMessage = "1/2";
              break;

            case 75:
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

          if (totalReturn > availableReturn) {
            Swal.showValidationMessage(
              `Maximum you can ${isReturn ? "return" : "refund"} is ${
                availReturnKilo ? `${availReturnKilo} kg` : ""
              }  ${
                availReturnGrams !== 0
                  ? `${availReturnKilo ? "and" : ""} ${gramsMessage}`
                  : ""
              }`
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
          const _purchases = [
            ...orderDetails.filter(({ isRefundAll }) => !isRefundAll),
          ];

          const totalReturn = kilo + kiloGrams;
          const stockIsNotEnough = totalReturn > max;
          const refundPurchase = totalReturn - max;
          const sufficientStock = max <= 0 ? 0 : max;
          if (!stockIsNotEnough) {
            handleReturn(_purchases, index, reason, order, totalReturn);
            handleSwalMessage(isReturn);
          }
          if (stockIsNotEnough) {
            Swal.fire({
              title: "No Stock Available",
              html: `
                 ${
                   sufficientStock
                     ? `<p>Unfortunately, there is no stock available for the items you want to replace.</p>
                <p>You can replaced ${productOrder.kiloText(
                  sufficientStock
                )}, but the remaining ${productOrder.kiloText(
                         refundPurchase
                       )} must be refunded.</p>`
                     : `You can only refund the ${productOrder.kiloText(
                         totalReturn
                       )}`
                 }
              `,
              icon: "warning",
              confirmButtonText: "Proceed with Refund",
              showCancelButton: true,
              cancelButtonText: "Cancel",
              reverseButtons: true,
            }).then((result) => {
              if (result.isConfirmed) {
                var totalRefund = totalReturn;
                if (sufficientStock) {
                  totalRefund = refundPurchase;
                  const { kilo: _kilo, kiloGrams: _grams } =
                    convertedKilo(sufficientStock);
                  handleReturn(
                    _purchases,
                    index,
                    reason,
                    order,
                    sufficientStock
                  );
                }

                const purchaseTotalKg =
                  (_purchases[index].kilo || 0) +
                  (_purchases[index]?.kiloGrams || 0);

                const newTotalKg = purchaseTotalKg - totalRefund;

                if (newTotalKg <= 0) {
                  _purchases[index] = {
                    ..._purchases[index],
                    isRefundAll: true,
                  };
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
                handleRefund(
                  _purchases,
                  order,
                  reason,
                  convertedKilo(totalRefund)
                );

                handleSwalMessage(isReturn);
              }
            });
          }
        }
      });
    } else {
      const availableReturn = quantity - quantityReturn;
      Swal.fire({
        title: `${isReturn ? "Replacement" : "Refound"} Quantity`,
        html: `
        <div class="w-100 m-0 p-0">
              ${
                quantityReturn
                  ? `<p style="font-weight:bold">
                                Your available replacement is  
                               ${availableReturn} quantity because you have
                        already replaced ${quantityReturn} quantity.
                      </p>`
                  : ""
              }
          <label for="quantity-input">Please enter the quantity you want to ${
            isReturn ? "replacement" : "refund"
          }:</label>
          <input id="quantity-input" type="number" class="swal2-input form-control m-0 p-0 mb-2 text-center" value="${availableReturn}">
          <label for="return-reason">Reason for ${
            isReturn ? "replacement" : "refund"
          }:</label>
          <select id="return-reason"  class="swal2-select text-center form-control m-0 p-0">
            <option value="Defective or damaged product">Defective or damaged product</option>
            <option value="Wrong item">Wrong item</option>
            <option value="Quality issues">Quality issues</option>
            <option value="Expired items">Expired items</option>
            <option value="Fitment issues">Fitment issues</option>
          </select>
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

          if (quantity > availableReturn) {
            Swal.showValidationMessage(
              `Maximum quantity you can ${
                isReturn ? "return" : "refund"
              } is ${availableReturn} quantity`
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
          const _purchases = [
            ...orderDetails.filter(({ isRefundAll }) => !isRefundAll),
          ];

          const stockIsNotEnough = quantity > max;
          const refundPurchase = quantity - max;
          const sufficientStock = max <= 0 ? 0 : max;
          if (!stockIsNotEnough) {
            handleReturn(_purchases, index, reason, order, quantity);
            handleSwalMessage(isReturn);
          }

          if (stockIsNotEnough) {
            Swal.fire({
              title: "No Stock Available",
              html: `
                 ${
                   sufficientStock
                     ? `<p>Unfortunately, there is no stock available for the items you want to replace.</p>
                <p>You can replaced ${sufficientStock} quantity, but the remaining ${refundPurchase} quantity  must be refunded.</p>`
                     : `You can only refund the ${quantity} quantity`
                 }
              `,
              icon: "warning",
              confirmButtonText: "Proceed with Refund",
              showCancelButton: true,
              cancelButtonText: "Cancel",
              reverseButtons: true,
            }).then((result) => {
              if (result.isConfirmed) {
                var totalRefund = quantity;
                if (sufficientStock) {
                  totalRefund = refundPurchase;
                  handleReturn(
                    _purchases,
                    index,
                    reason,
                    order,
                    sufficientStock
                  );
                }
                const _purchaseQty = _purchases[index].quantity;
                const totalQty = _purchaseQty - totalRefund;

                if (totalQty <= 0) {
                  _purchases[index] = {
                    ..._purchases[index],
                    isRefundAll: true,
                  };
                } else {
                  _purchases[index].quantity -= totalQty;
                }
                if (noHavePurchases(_purchases)) {
                  toggle();
                  transactionToggle();
                }
                handleRefund(_purchases, order, reason, { quantity: totalQty });
                handleSwalMessage(isReturn);
              }
            });
          }
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
          cash={cash}
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
