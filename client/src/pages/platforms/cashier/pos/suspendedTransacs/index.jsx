import React, { useState } from "react";
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
import { formattedDate } from "../../../../../services/utilities";

export default function SuspendedTransacs({
  show,
  toggle,
  collections = [],
  setInvoice_no,
  products = [],
  setOrders,
}) {
  const { token } = useSelector(({ auth }) => auth),
    [showInvoice, setShowInvoice] = useState(false),
    [selectedTransac, setSelectedTransac] = useState({}),
    dispatch = useDispatch();

  const handleClose = () => {
    toggle();
  };

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
      max = options[optionIndex].max;

      if (has2Variant) {
        max = options[optionIndex].prices.find(
          ({ _id }) => _id === variant2
        )?.max;
      }
    } else {
      max = product.max;
    }
    var totalKilo = kilo + kiloGrams;
    if (product.isPerKilo) {
      if (totalKilo > max) {
        totalKilo = seperateKiloAndGrams(max);
      } else {
        totalKilo = seperateKiloAndGrams(totalKilo);
      }
    }

    return {
      ...selected,
      max,
      ...(isPerKilo
        ? { ...totalKilo }
        : { quantity: quantity > max ? max : quantity }),
    };
  };

  const handleResume = (_selected) => {
    Swal.fire({
      title: "Are you sure ?",
      text: "you want to resume this suspended transaction?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, resume it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const _orders = [..._selected.orders];
        setInvoice_no(_selected.invoice_no);
        const productsWithNewMax = _orders
          .map((order) => {
            const orderWithNewMax = handleGetMax(order);
            return orderWithNewMax.max > 0 ? orderWithNewMax : false;
          })
          .filter(Boolean);
        setOrders(productsWithNewMax || []);

        dispatch(DESTROY({ token, data: { _id: _selected._id } }));
        toggle();
        Swal.fire({
          title: "Resumed!",
          text: "The suspended transaction has been successfully resumed.",
          icon: "success",
        });
        // Your resume logic here
      }
    });
  };

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this suspended transaction!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ token, data: { _id } }));
        Swal.fire({
          title: "Deleted!",
          text: "Your category has been deleted.",
          icon: "success",
        });
      }
    });
  };
  return (
    <>
      <MDBModal isOpen={show} toggle={toggle} backdrop size="lg">
        {!showInvoice && (
          <MDBModalHeader
            toggle={handleClose}
            tag="h5"
            className="light-blue darken-3 white-text"
          >
            <MDBIcon far icon="pause-circle" className="mr-2" /> Suspended
            Transactions
          </MDBModalHeader>
        )}
        <MDBModalBody className={`mb-0 ${showInvoice ? "m-0 p-0" : ""}`}>
          {!showInvoice ? (
            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
              <MDBTable>
                <thead>
                  <tr>
                    <th>#</th>
                    <th className="text-center">Time</th>
                    <th className="text-center">Invoice No.</th>
                    <th className="text-center">Total Amount</th>
                    <th className="text-center"> Action</th>
                  </tr>
                </thead>
                <tbody>
                  {collections?.length > 0 ? (
                    collections.map((order, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="text-center font-weight-bold">
                          {formattedDate(order.createdAt, true)}
                        </td>

                        <td className="text-center font-weight-bold">
                          {order.invoice_no}
                        </td>
                        <td className="text-center text-danger font-weight-bold">
                          ₱{order.total.toLocaleString()}
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
                      <td colSpan={3} className="text-center"></td>No records.
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
              toggle={() => setShowInvoice(false)}
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
