import React, { useState } from "react";
import { MDBTable, MDBIcon, MDBBtn, MDBBadge } from "mdbreact";
import { formattedDate, fullName } from "../../../../../services/utilities";
import Modal from "../modal";
import Remarks from "./remarks";

const Table = ({ isAdmin, isRejected, purchases }) => {
  const [show, setShow] = useState(false),
    [purchase, setPurchase] = useState({}),
    [showRemarks, setShowRemarks] = useState(false),
    [remarks, setRemarks] = useState(""),
    [merchandises, setMerchandises] = useState([]);

  const toggleRemarks = () => setShowRemarks(!showRemarks);
  const toggle = () => setShow(!show);
  return (
    <>
      <MDBTable>
        <thead>
          <tr>
            <th>#</th>
            <th className="text-center">Request By</th>
            <th className="text-center">Request Date</th>
            {isRejected ? (
              <th className="text-center">Rejected Date</th>
            ) : (
              <th className="text-center">Expected Approved Date</th>
            )}
            {isRejected ? (
              <th className="text-center">Reason</th>
            ) : (
              <th className="text-center">Remarks</th>
            )}
            {isAdmin && !isRejected && (
              <th className="text-center">Total Amount</th>
            )}
            <th className="text-center"> Products</th>
          </tr>
        </thead>
        <tbody>
          {purchases.length > 0 ? (
            purchases.map((purchase, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className="text-center">
                  {fullName(purchase.requestBy.fullName)}
                </td>

                <td className="text-center">
                  {formattedDate(purchase.createdAt)}
                </td>
                <td className="text-center">
                  {formattedDate(
                    isRejected ? purchase.rejectedDate : purchase.expected
                  )}
                </td>
                <td className="text-center">
                  <MDBBadge
                    className="cursor-pointer p-2"
                    color="info"
                    onClick={() => {
                      setRemarks(
                        isRejected ? purchase.reason : purchase.remarks
                      );
                      setPurchase(purchase);
                      toggleRemarks();
                    }}
                  >
                    <MDBIcon icon="comment-alt" size="1x" />
                  </MDBBadge>
                </td>
                {isAdmin && !isRejected && (
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
                      setPurchase(purchase);

                      setShow(true);
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
              <td colSpan={12} className="text-center">
                No Records
              </td>
            </tr>
          )}
        </tbody>
      </MDBTable>
      <Modal
        toggle={toggle}
        isAdmin={isRejected ? false : isAdmin}
        show={show}
        merchandises={merchandises}
        purchase={purchase}
        hasBorder={isAdmin && !isRejected}
        isRejected={isRejected}
        theader="Request"
        setMerchandises={setMerchandises}
      />
      <Remarks
        show={showRemarks}
        toggle={toggleRemarks}
        remarks={remarks}
        purchase={purchase}
        isRejected={isRejected}
        isAdmin={isAdmin}
      />
    </>
  );
};

export default Table;
