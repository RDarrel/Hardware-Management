import React, { useCallback, useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
  MDBModalFooter,
} from "mdbreact";
import { APPROVED } from "../../../../../services/redux/slices/stockman/purchases";

import Products from "./products";
import Suppliers from "./suppliers";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { fullName } from "../../../../../services/utilities";

export default function Checking({
  show,
  toggle,
  parentToggle,
  purchase,
  merchandises: collections,
  grandTotal,
  suppliersCollections,
}) {
  const { token } = useSelector(({ auth }) => auth),
    [merchandises, setMerchandises] = useState([]),
    [totalAmount, setTotalAmount] = useState([]),
    [suppliers, setSuppliers] = useState([]),
    [supplier, setSupplier] = useState("all"),
    dispatch = useDispatch();

  const computeTotalAmount = useCallback((_merchandises) => {
    return _merchandises.reduce((acc, curr) => {
      acc += curr.subtotal;
      return acc;
    }, 0);
  }, []);

  useEffect(() => {
    if (show) {
      const _supplierIDS = collections
        .filter(
          (obj, index, curr) =>
            curr.findIndex(({ supplier }) => supplier === obj.supplier) ===
            index
        )
        .map(({ supplier }) => supplier);

      const populateSuppliers = suppliersCollections.filter(({ _id }) =>
        _supplierIDS.includes(_id)
      );

      const supplierWithTotalAmount = populateSuppliers.map((supplier) => {
        const merchandisesForSupplier = collections.filter(
          ({ supplier: supp }) => supp === supplier._id
        );

        const totalAmount = computeTotalAmount(merchandisesForSupplier);
        return {
          ...supplier,
          totalAmount,
          expectedDelivered: new Date(),
          merchandises: merchandisesForSupplier,
        };
      });

      setSuppliers(supplierWithTotalAmount);
    }
  }, [show, collections, computeTotalAmount, suppliersCollections]);

  useEffect(() => {
    if (show) {
      if (supplier !== "all") {
        const filteredProducts = collections.filter(
          ({ supplier: supp }) => supplier === supp
        );
        const totalAmount = computeTotalAmount(filteredProducts);
        setMerchandises(filteredProducts);
        setTotalAmount(totalAmount);
      } else {
        setMerchandises(collections);
        setTotalAmount(grandTotal);
      }
    }
  }, [supplier, computeTotalAmount, collections, grandTotal, show]);

  console.log(purchase);

  const handleProceed = () => {
    dispatch(
      APPROVED({
        token,
        data: {
          purchase: {
            ...purchase,
            employee: fullName(purchase?.requestBy?.fullName),
          },
          suppliers,
        },
      })
    );
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Successfully approved!",
      confirmButtonText: "OK",
    }).then(() => {
      toggle();
      parentToggle();
    });
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="fluid">
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="clipboard-list" className="mr-2" />
        Checking
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBRow>
          <Products
            merchandises={merchandises}
            suppliers={suppliers}
            supplier={supplier}
            setSupplier={setSupplier}
            grandTotal={totalAmount}
          />
          <Suppliers suppliers={suppliers} setSuppliers={setSuppliers} />
        </MDBRow>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn color="success" className="float-right" onClick={handleProceed}>
          Proceed
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  );
}
