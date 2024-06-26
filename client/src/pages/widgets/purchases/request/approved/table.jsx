import React, { useState } from "react";
import { MDBBtn, MDBIcon, MDBTable } from "mdbreact";
import { formattedDate, fullName } from "../../../../../services/utilities";
import Modal from "../modal";
import Received from "./Received";

const Table = ({ stockmans = [], isAdmin, isReceived }) => {
  const [show, setShow] = useState(false),
    [viewReceived, setViewRecieved] = useState(false),
    [merchandises, setMerchandises] = useState([]),
    [purchase, setPurchase] = useState({});

  const toggle = () => setShow(!show);

  const toggleReceived = () => setViewRecieved(!viewReceived);

  const handleViewProducts = (_purchase, products = []) => {
    const _products = [...products];
    let expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);
    const productsWithExpiration = _products.map((p) => ({
      ...p, // Spread existing properties of each product
      ...(p.product?.hasExpiration && { expiration: expirationDate }), // Add expiration date if hasExpiration is true
    }));
    const sortedMerchandises = isReceived
      ? products
      : productsWithExpiration.sort(
          (a, b) => b.product?.hasExpiration - a.product?.hasExpiration
        );

    setMerchandises(sortedMerchandises);
    setPurchase(_purchase);
    if (isReceived) {
      toggleReceived();
    } else {
      toggle();
    }
  };
  return (
    <>
      <MDBTable responsive hover>
        <thead>
          <tr>
            <th className="cursor-pointer">#&nbsp;</th>
            {isAdmin && <th className="th-lg">Stockman</th>}
            {!isReceived && (
              <>
                <th>Approved Date</th>
                <th>Expected Delivered Date</th>
              </>
            )}
            {isReceived && (
              <>
                <th>Expected Delivered Date</th>
                <th>Received Date</th>
              </>
            )}
            {isAdmin && <th>Total Amount</th>}
            <th className="th-lg text-center">Products</th>
          </tr>
        </thead>
        <tbody>
          {!!stockmans &&
            stockmans.map((stockman, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                {isAdmin && <td>{fullName(stockman?.requestBy?.fullName)}</td>}
                {!isReceived && (
                  <>
                    <td>{formattedDate(stockman?.approved)}</td>
                    <td>{formattedDate(stockman?.expectedDelivered)}</td>
                  </>
                )}
                {isReceived && (
                  <>
                    <td>{formattedDate(stockman?.expectedDelivered)}</td>
                    <td>{formattedDate(stockman?.received)}</td>
                  </>
                )}
                {isAdmin && (
                  <td className="font-weight-bolder text-danger">
                    ₱ {stockman.total.toLocaleString()}
                  </td>
                )}
                <td className="text-center">
                  <MDBBtn
                    color="success"
                    size="sm"
                    floating
                    onClick={() =>
                      handleViewProducts(stockman, stockman.merchandises)
                    }
                  >
                    <MDBIcon icon="shopping-cart" />
                  </MDBBtn>
                  <span className="counter mb-0">
                    {stockman?.merchandises?.length}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </MDBTable>
      <Received
        show={viewReceived}
        toggle={toggleReceived}
        isAdmin={isAdmin}
        purchase={purchase}
        merchandises={merchandises}
      />
      <Modal
        isApproved={true}
        isAdmin={isAdmin}
        merchandises={merchandises}
        setMerchandises={setMerchandises}
        purchase={purchase}
        show={show}
        toggle={toggle}
      />
    </>
  );
};

export default Table;
