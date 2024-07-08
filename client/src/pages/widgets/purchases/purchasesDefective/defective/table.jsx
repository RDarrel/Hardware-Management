import { MDBBtn, MDBIcon, MDBTable } from "mdbreact";
import React, { useState } from "react";
import { formattedDate, fullName } from "../../../../../services/utilities";
import Modal from "./modal";

const Table = ({ purchases, isAdmin, isRefund = false }) => {
  const [show, setShow] = useState(""),
    [stockman, setStockman] = useState(""),
    [expectedDelivered, setExpectedDelivered] = useState(""),
    [supplier, setSupplier] = useState({}),
    [purchase, setPurchase] = useState({}),
    [total, setTotal] = useState(""),
    [merchandises, setMerchandises] = useState("");

  const toggle = () => setShow(!show);
  return (
    <>
      <MDBTable>
        <thead>
          <tr>
            <th>#</th>
            {isAdmin && !isRefund && (
              <th className="text-center">Received By</th>
            )}
            <th className="text-center">
              {isRefund ? "Refund " : "Received"} On
            </th>
            {isAdmin && <th className="text-center">Total Amount</th>}
            <th className="text-center">Products</th>
          </tr>
        </thead>
        <tbody>
          {!!purchases ? (
            purchases.map((purchase, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                {isAdmin && !isRefund && (
                  <td className="text-center">
                    {fullName(purchase.requestBy?.fullName)}
                  </td>
                )}
                <td className="text-center">
                  {formattedDate(purchase.received)}
                </td>
                {isAdmin && (
                  <td className="text-danger text-center font-weight-bolder">
                    ₱ {purchase.total.toLocaleString()}
                  </td>
                )}
                <td className="text-center">
                  <MDBBtn
                    color="success"
                    size="sm"
                    floating
                    onClick={() => {
                      setMerchandises(purchase.merchandises);
                      setStockman(purchase.requestBy);
                      setTotal(purchase.total);
                      setSupplier(purchase.supplier);
                      setPurchase(purchase);
                      toggle();
                    }}
                  >
                    <MDBIcon icon="shopping-cart" />
                  </MDBBtn>
                  <span className="counter mb-0">
                    {purchase.merchandises?.length}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No Records.</td>
            </tr>
          )}
        </tbody>
      </MDBTable>
      <Modal
        toggle={toggle}
        show={show}
        stockman={stockman}
        merchandises={merchandises}
        total={total}
        supplier={supplier}
        isRefund={isRefund}
        purchase={purchase}
        isAdmin={isAdmin}
        expectedDelivered={expectedDelivered}
        setExpectedDelivered={setExpectedDelivered}
      />
    </>
  );
};

export default Table;