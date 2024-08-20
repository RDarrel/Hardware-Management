import { MDBBtn, MDBIcon, MDBTable } from "mdbreact";
import React, { useEffect, useState } from "react";
import { formattedDate, fullName } from "../../../../../services/utilities";
import Modal from "./modal";

const Table = ({ purchases, isAdmin, isRefund = false, isDefective }) => {
  const [show, setShow] = useState(""),
    [stockman, setStockman] = useState(""),
    [expectedDelivered, setExpectedDelivered] = useState(""),
    [supplier, setSupplier] = useState({}),
    [purchase, setPurchase] = useState({}),
    [sortedPurchases, setSortedPurchases] = useState([]),
    [total, setTotal] = useState(""),
    [merchandises, setMerchandises] = useState("");

  useEffect(() => {
    if (!!purchases) {
      const sorted = [...purchases].sort((a, b) => {
        return new Date(b.received) - new Date(a.received);
      });
      setSortedPurchases(sorted);
    }
  }, [purchases]);

  const toggle = () => setShow(!show);
  return (
    <>
      <MDBTable>
        <thead>
          <tr>
            <th>#</th>
            {!isRefund && <th className="text-center">Received By</th>}
            <th className="text-center">
              {isRefund ? "Refund " : "Received"} On
            </th>
            {isAdmin && <th className="text-center">Total Amount</th>}
            <th className="text-center">Products</th>
          </tr>
        </thead>
        <tbody>
          {!!sortedPurchases ? (
            sortedPurchases.map((purchase, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                {!isRefund && (
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
        hasBorder={!isRefund}
        stockman={stockman}
        merchandises={merchandises}
        total={total}
        supplier={supplier}
        isRefund={isRefund}
        purchase={purchase}
        isAdmin={isAdmin}
        expectedDelivered={expectedDelivered}
        setExpectedDelivered={setExpectedDelivered}
        isDefective={isDefective}
      />
    </>
  );
};

export default Table;
