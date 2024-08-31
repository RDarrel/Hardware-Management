import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTable,
  MDBBtnGroup,
  MDBBadge,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import View from "./view";
import Swal from "sweetalert2";
import seperateKiloAndGrams from "../../../../../services/utilities/seperateKiloAndGrams";
import { DESTROY } from "../../../../../services/redux/slices/cashier/suspendedTransacs";
import {
  DESTROY as DESTROY_QOUTATION,
  UPDATE,
} from "../../../../../services/redux/slices/quotations";
import { formattedDate, fullName } from "../../../../../services/utilities";
import formattedTotal from "../../../../../services/utilities/forattedTotal";

export default function SuspendedTransacs({
  show,
  toggle,
  collections = [],
  setInvoice_no,
  products = [],
  setOrders,
  isQuotation = false,
  setCustomerQuotation = () => {},
}) {
  const { token } = useSelector(({ auth }) => auth),
    [showInvoice, setShowInvoice] = useState(false),
    [selectedTransac, setSelectedTransac] = useState({}),
    dispatch = useDispatch();

  const handleClose = () => {
    toggle();
  };

  useEffect(() => {
    if (isQuotation) {
      const notSeenQuotations = [...collections]
        .filter(({ isSeen }) => !isSeen)
        .map(({ _id = "" }) => _id)
        .filter(Boolean);
      if (!!notSeenQuotations) {
        dispatch(UPDATE({ token, data: notSeenQuotations }));
      }
    }
  }, [isQuotation, dispatch, token, collections]);

  const handleGetMax = (selected) => {
    const _products = [...products];
    const {
      product: oldProduct,
      variant1,
      variant2,
      quantity = 0,
      kilo = 0,
      kiloGrams = 0,
    } = selected;
    const { hasVariant, has2Variant, isPerKilo = false } = oldProduct;
    const product = _products.find((p) => p._id === oldProduct._id);
    var max = 0;
    if (hasVariant) {
      const options = [...product.variations[0].options];
      const optionIndex = options.findIndex(({ _id }) => _id === variant1);
      max = options[optionIndex]?.max || 0;

      if (has2Variant) {
        max =
          options[optionIndex].prices.find(({ _id }) => _id === variant2)
            ?.max || 0;
      }
    } else {
      max = product?.max || 0;
    }
    var totalKilo = kilo + kiloGrams;
    if (product?.isPerKilo) {
      if (totalKilo > max) {
        totalKilo = seperateKiloAndGrams(max);
      } else {
        totalKilo = seperateKiloAndGrams(totalKilo);
      }
    }

    return {
      ...selected,
      product,
      max,
      ...(isPerKilo
        ? { ...totalKilo }
        : { quantity: quantity > max ? max : quantity }),
    };
  };

  const handleResume = (_selected) => {
    Swal.fire({
      title: "Are you sure ?",
      text: isQuotation
        ? "you want to place order this quotation?"
        : "you want to resume this hold transaction?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${isQuotation ? "place order" : "resume"} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        const baseDestroy = isQuotation ? DESTROY_QOUTATION : DESTROY;
        const _orders = [..._selected.orders];
        const productsWithNewMax = _orders
          .map((order) => {
            const orderWithNewMax = handleGetMax(order);
            return orderWithNewMax?.max > 0 ? orderWithNewMax : false;
          })
          .filter(Boolean);

        dispatch(baseDestroy({ token, data: { _id: _selected._id } }));
        toggle();
        setShowInvoice(false);
        if (isQuotation) {
          const { isWalkIn = false, customer, orderBy } = _selected;
          setCustomerQuotation(
            isWalkIn ? customer : fullName(orderBy.fullName)
          );
        }

        if (productsWithNewMax.length === 0) {
          setOrders([]);
          setInvoice_no("");
          return Swal.fire({
            title: isQuotation ? "Quotation Failed" : "Transaction Failed!",
            text: "The suspended transaction could not be resumed because the items are out of stock. The transaction will now be removed from the suspended transactions list.",
            icon: "error",
          });
        }
        setOrders(productsWithNewMax || []);
        setInvoice_no(_selected.invoice_no);
        Swal.fire({
          title: isQuotation ? "Place order" : "Resumed!",
          text: isQuotation
            ? "Quotation has been place order"
            : "The suspended transaction has been successfully resumed.",
          icon: "success",
        });
      }
    });
  };

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: isQuotation
        ? "You want to delete this quotation"
        : "You want to delete this hold transaction!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const baseDestroy = isQuotation ? DESTROY_QOUTATION : DESTROY;
        dispatch(baseDestroy({ token, data: { _id } }));
        Swal.fire({
          title: "Deleted!",
          text: `Your ${
            isQuotation ? "quotation" : "hold transaction"
          } has been deleted.`,
          icon: "success",
        });
      }
    });
  };
  return (
    <>
      <MDBModal
        isOpen={show}
        toggle={toggle}
        backdrop
        size={!isQuotation || showInvoice ? "lg" : "xl"}
      >
        {!showInvoice && (
          <MDBModalHeader
            toggle={handleClose}
            tag="h5"
            className="light-blue darken-3 white-text"
          >
            <MDBIcon
              icon={!isQuotation ? "pause-circle" : "walking"}
              className="mr-2"
            />
            {!isQuotation ? "Hold Transactions" : "Quotations"}
          </MDBModalHeader>
        )}
        <MDBModalBody className={`mb-0 ${showInvoice ? "m-0 p-0" : ""}`}>
          {!showInvoice ? (
            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
              <MDBTable>
                <thead>
                  <tr>
                    <th>#</th>
                    {isQuotation && <th className="text-center">Assist By</th>}
                    <th className="text-center">Time</th>
                    {isQuotation && <th className="text-center">Customer</th>}
                    {isQuotation && <th className="text-center">Status</th>}
                    <th className="text-center">
                      {!isQuotation ? "Invoice No." : "Quotation No."}
                    </th>
                    <th className="text-center">Total Amount</th>
                    <th className="text-center"> Action</th>
                  </tr>
                </thead>
                <tbody>
                  {collections?.length > 0 ? (
                    collections.map((order, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        {isQuotation && (
                          <td className="text-center font-weight-bold">
                            {order.isWalkIn
                              ? fullName(order?.assistBy?.fullName)
                              : "--"}
                          </td>
                        )}

                        <td className="text-center font-weight-bold">
                          {formattedDate(order.createdAt, true)}
                        </td>

                        {isQuotation && (
                          <>
                            <td className="text-center font-weight-bold">
                              {order.isWalkIn
                                ? order.customer
                                : order.orderBy?.email}
                            </td>
                            <td className="text-center font-weight-bold">
                              {order.isWalkIn ? "walkin" : "online"}
                            </td>
                          </>
                        )}
                        <td className="text-center font-weight-bold">
                          {order.invoice_no}
                        </td>
                        <td className="text-center text-danger font-weight-bold">
                          ₱{formattedTotal(order.total)}
                        </td>
                        <td className="text-center">
                          <MDBBtnGroup>
                            <MDBBtn
                              size="sm"
                              rounded
                              color="primary"
                              onClick={() => handleResume(order)}
                            >
                              <MDBIcon icon="sign-out-alt" />
                            </MDBBtn>
                            <MDBBtn
                              size="sm"
                              rounded
                              color="warning"
                              onClick={() => {
                                setSelectedTransac(order);
                                setShowInvoice(true);
                              }}
                            >
                              <MDBIcon icon="eye" />
                            </MDBBtn>
                            <MDBBtn
                              size="sm"
                              rounded
                              color="danger"
                              onClick={() => handleDelete(order._id)}
                            >
                              <MDBIcon icon="trash" />
                            </MDBBtn>
                          </MDBBtnGroup>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">
                        No records.
                      </td>
                    </tr>
                  )}
                </tbody>
              </MDBTable>
            </div>
          ) : (
            <View
              createdAt={selectedTransac?.createdAt}
              orderDetails={selectedTransac?.orders}
              invoice_no={selectedTransac?.invoice_no}
              handleResume={handleResume}
              show={show}
              selectedTransac={selectedTransac}
              total={selectedTransac?.total}
              customer={
                !selectedTransac.isWalkIn
                  ? selectedTransac?.orderBy?.email || ""
                  : selectedTransac?.customer || ""
              }
              toggle={() => setShowInvoice(false)}
              isQuotation={isQuotation}
            />
          )}
          {!showInvoice && collections.length > 9 && (
            <MDBBadge color="light" className="">
              <h6 className="font-weight-bolder text-white mx-1 my-1 text-dark ">
                Total of ({collections.length}) suspended transactions
              </h6>
            </MDBBadge>
          )}
        </MDBModalBody>
      </MDBModal>
    </>
  );
}
