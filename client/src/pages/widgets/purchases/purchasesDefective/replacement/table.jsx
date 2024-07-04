import { MDBBtn, MDBIcon, MDBTable } from "mdbreact";
import React, { useState } from "react";
import { formattedDate, fullName } from "../../../../../services/utilities";
import Modal from "../../request/modal";
import Received from "../../request/approved/Received";
import GET from "../../GET";

const Table = ({ purchases, isAdmin, isReceived = false }) => {
  const [show, setShow] = useState(false),
    [showReceived, setShowReceived] = useState(false),
    [purchase, setPurchase] = useState({}),
    [merchandises, setMerchandises] = useState([]);

  const toggle = () => setShow(!show);
  const toggleReceived = () => setShowReceived(!showReceived);
  return (
    <>
      <MDBTable>
        <thead>
          <tr>
            <th>#</th>
            {!isReceived && (
              <th className="text-center">Expected Delivered Date</th>
            )}
            {isReceived && <th className="text-center">Received By</th>}
            {isReceived && <th className="text-center">Received Date</th>}
            {isAdmin && (
              <>
                <th className="text-center">Total Payment</th>
                {isReceived && (
                  <>
                    <th className="text-center"> Total Defective Amount</th>
                    <th className="text-center"> Total Products Amount</th>
                  </>
                )}
              </>
            )}
            <th className="text-center">Products</th>
          </tr>
        </thead>
        <tbody>
          {!!purchases ? (
            purchases.map((purchase, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                {!isReceived && (
                  <td className="text-center">
                    {formattedDate(purchase.expectedDelivered)}
                  </td>
                )}
                {isReceived && (
                  <td className="text-center">
                    {fullName(purchase.requestBy?.fullName)}
                  </td>
                )}

                {isReceived && (
                  <td className="text-center">
                    {formattedDate(purchase.received)}
                  </td>
                )}
                {isAdmin && (
                  <>
                    <td className="font-weight-bolder text-danger text-center">
                      ₱ {purchase.total.toLocaleString()}
                    </td>
                    {isReceived && (
                      <>
                        <td className="font-weight-bolder text-danger text-center">
                          ₱{" "}
                          {GET.totalAmount(purchase.merchandises, "defective")}
                        </td>
                        <td className="font-weight-bolder text-danger text-center">
                          ₱ {purchase.totalReceived.toLocaleString()}
                        </td>
                      </>
                    )}
                  </>
                )}

                <td className="text-center">
                  <MDBBtn
                    color="success"
                    size="sm"
                    floating
                    onClick={() => {
                      setMerchandises(purchase.merchandises);
                      setPurchase(purchase);
                      if (isReceived) {
                        toggleReceived();
                      } else {
                        toggle();
                      }
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
              <td>No records.</td>
            </tr>
          )}
        </tbody>
      </MDBTable>

      <Modal
        show={show}
        toggle={toggle}
        purchase={purchase}
        merchandises={merchandises}
        setMerchandises={setMerchandises}
        isAdmin={isAdmin}
        isApproved={true}
        isDefective={true}
      />
      <Received
        show={showReceived}
        toggle={toggleReceived}
        purchase={purchase}
        merchandises={merchandises}
        isAdmin={isAdmin}
        isDefective={true}
      />
    </>
  );
};

export default Table;
