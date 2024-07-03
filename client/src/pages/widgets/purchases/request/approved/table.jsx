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

  stockmans =
    !!stockmans &&
    stockmans.sort((a, b) => {
      const dateA = new Date(isReceived ? a?.received : a?.expectedDelivered);
      const dateB = new Date(isReceived ? b?.received : b?.expectedDelivered);
      return dateB - dateA; // Descending order
    });
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
    const baseMerchandises = isReceived ? _products : productsWithExpiration;
    const sortedMerchandises = baseMerchandises.sort(
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
                <th className="text-center">Approved Date</th>
                <th className="text-center">Expected Delivered Date</th>
              </>
            )}
            {isReceived && (
              <>
                <th className="text-center">Expected Delivered Date</th>
                <th className="text-center">Received Date</th>
              </>
            )}
            {isAdmin && <th className="text-center">Total Amount</th>}
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
                    <td className="text-center">
                      {formattedDate(stockman?.approved)}
                    </td>
                    <td className="text-center">
                      {formattedDate(stockman?.expectedDelivered)}
                    </td>
                  </>
                )}
                {isReceived && (
                  <>
                    <td className="text-center">
                      {formattedDate(stockman?.expectedDelivered)}
                    </td>
                    <td className="text-center">
                      {formattedDate(stockman?.received)}
                    </td>
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
