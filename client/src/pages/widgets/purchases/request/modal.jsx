import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBIcon,
  MDBModalHeader,
  MDBModalFooter,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { fullName, variation } from "../../../../services/utilities";
import { BROWSE } from "../../../../services/redux/slices/administrator/suppliers";
import { UPDATE } from "../../../../services/redux/slices/stockman/purchases";
import Swal from "sweetalert2";
import ModalBody from "./modalBody";

export default function Modal({
  show,
  toggle,
  merchandises = [],
  setMerchandises,
  purchase = {},
  isAdmin = true,
  isApproved = false,
  isReceived,
}) {
  const { token } = useSelector(({ auth }) => auth),
    { collections: _suppliers = [] } = useSelector(
      ({ suppliers }) => suppliers
    ),
    [suppliers, setSuppliers] = useState([]),
    [expectedDelivered, setExpectedDelivered] = useState(""),
    [supplier, setSupplier] = useState(""),
    [products, setProducts] = useState([]),
    [total, setTotal] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    if (!!merchandises && show) {
      const productsWithSubtotal = merchandises.map((merchandise) => {
        const { quantity, kilo, kiloGrams } = merchandise;
        const quantitySubtotal = !isAdmin
          ? Number(quantity?.received) - Number(quantity?.defective || 0)
          : quantity?.approved;

        const kiloSubtotal = !isAdmin
          ? Number(kilo?.received) - Number(kilo?.defective || 0)
          : kilo?.approved;

        const kiloGramsSubtotal = !isAdmin
          ? Number(kiloGrams?.received) - Number(kiloGrams?.defective || 0)
          : kiloGrams?.approved;
        return {
          ...merchandise,
          capital: variation.getTheCapitalOrSrp(
            "capital",
            merchandise,
            merchandise.product
          ),
          subtotal: variation.getTheSubTotal(
            "capital",
            {
              ...merchandise,
              quantity: quantitySubtotal,
              kilo: kiloSubtotal,
              kiloGrams: kiloGramsSubtotal,
            },
            merchandise.product
          ),
        };
      });

      const _total = productsWithSubtotal.reduce((acc, curr) => {
        return (acc += curr.subtotal);
      }, 0);

      setTotal(_total);
      setProducts(productsWithSubtotal);
    }
  }, [merchandises, isAdmin, show]);

  useEffect(() => {
    dispatch(BROWSE({ token, key: { status: "true" } }));
  }, [token, dispatch]);

  useEffect(() => {
    if (!!_suppliers) {
      setSuppliers(_suppliers);
      setSupplier(_suppliers[0]?._id);
    }
  }, [_suppliers]);

  const handleSubmit = (status) => {
    const supplierName = suppliers.find(({ _id }) => _id === supplier).company;
    Swal.fire({
      title: "Are you sure?",
      text: `${
        status === "approved"
          ? `Before proceeding with your approval, please double-check that the supplier ${supplierName} is correct.`
          : "you want to reject this"
      }`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          UPDATE({
            token,
            data: {
              purchase: {
                ...purchase,
                expectedDelivered,
                supplier,
                total,
                status,
                approved: new Date().toDateString(),
              },
              merchandises: products.map((product) => ({
                ...product,
                quantity: {
                  ...product?.quantity,
                  received: product?.quantity?.approved,
                  defective: 0,
                },
                kilo: {
                  ...product?.kilo,
                  received: product?.kilo?.approved,
                  defective: 0,
                },
                kiloGrams: {
                  ...product?.kiloGrams,
                  received: product?.kiloGrams?.approved,
                  defective: 0,
                },
              })),
            },
          })
        );
        toggle();

        Swal.fire({
          title:
            status === "approved" ? "Approval Confirmed" : "Rejected Confirm",
          text:
            status === "approved"
              ? `Your Approval has been confirmed with supplier: ${supplierName}.`
              : "",
          icon: "success",
        });
      }
    });
  };

  const handleClose = () => {
    toggle();
  };

  const handleReceived = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `Kindly double-check the received product and defective product.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          UPDATE({
            token,
            data: {
              purchase: {
                ...purchase,
                total,
                status: "received",
                received: new Date().toDateString(),
              },
              merchandises: products,
            },
          })
        );

        toggle();
        Swal.fire({
          title: "Received Successfully",
          icon: "success",
        });
      }
    });
  };

  const handleChangeExpiration = (newExpiration, index) => {
    setMerchandises((prev) => {
      const _merchandises = [...prev];
      _merchandises[index].expiration = newExpiration;
      return _merchandises;
    });
  };
  const size = isAdmin ? "fluid" : !isAdmin && isApproved ? "fluid" : "lg";
  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size={size}>
      <MDBModalHeader
        toggle={handleClose}
        className=" light-blue darken-3 white-text  d-flex align-items-center"
        tag="h5"
        style={{ fontWeight: "normal" }}
      >
        <MDBIcon icon={isAdmin ? "user" : "shopping-cart"} className="mr-2" />
        {!isAdmin
          ? "Products Request"
          : `Requested By: ${fullName(purchase?.requestBy?.fullName)}`}
      </MDBModalHeader>
      <ModalBody
        products={products}
        isAdmin={isAdmin}
        isApproved={isApproved}
        setMerchandises={setMerchandises}
        setSupplier={setSupplier}
        setExpectedDelivered={setExpectedDelivered}
        handleChangeExpiration={handleChangeExpiration}
        expectedDelivered={expectedDelivered}
        total={total}
        suppliers={suppliers}
        supplier={supplier}
        isReceived={isReceived}
      />
      {!isApproved && isAdmin && (
        <MDBModalFooter>
          <div className="text-end">
            <MDBBtn
              color="success"
              className="float-right"
              onClick={() => handleSubmit("approved")}
            >
              Approved
            </MDBBtn>
            <MDBBtn
              color="danger"
              className="float-right"
              onClick={() => handleSubmit("reject")}
            >
              Reject
            </MDBBtn>
          </div>
        </MDBModalFooter>
      )}

      {isApproved && !isAdmin && (
        <MDBModalFooter>
          <div className="text-end">
            <MDBBtn
              color="primary"
              className="float-right"
              onClick={handleReceived}
            >
              Received
            </MDBBtn>
          </div>
        </MDBModalFooter>
      )}
    </MDBModal>
  );
}
