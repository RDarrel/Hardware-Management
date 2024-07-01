import React, { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBTable,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBBadge,
} from "mdbreact";
import { formattedDate, fullName } from "../../../../../services/utilities";
import Modal from "../modal";
import CustomSelect from "../../../../../components/customSelect";
import Remarks from "./remarks";
import filterBy from "../../filterBy";

const Pending = ({ collections, isAdmin, isRejected = false }) => {
  const [show, setShow] = useState(false),
    [purchase, setPurchase] = useState({}),
    [showRemarks, setShowRemarks] = useState(false),
    [stockmans, setStockmans] = useState([]),
    [stockman, setStockman] = useState(""),
    [remarks, setRemarks] = useState(""),
    [merchandises, setMerchandises] = useState(),
    [purchases, setPurchases] = useState([]);

  useEffect(() => {
    if (!!collections) {
      const _collections = collections.filter(({ status }) =>
        isRejected ? status === "reject" : status === "pending"
      );
      setStockmans(filterBy("requestBy", _collections) || []);
      setPurchases(_collections || []);
    }
  }, [collections, isRejected]);

  useEffect(() => {
    if (stockman === "all" || !stockman) {
      const _purchases = collections;
      setPurchases(_purchases);
    } else {
      const _purchases = collections.filter(
        ({ requestBy }) => requestBy._id === stockman
      );
      setPurchases(_purchases);
    }
  }, [stockman, collections]);

  const toggleRemarks = () => setShowRemarks(!showRemarks);
  const toggle = () => setShow(!show);

  return (
    <>
      {isAdmin && (
        <MDBRow className="ml-3  text-white">
          <MDBCol className="m-0 p-0">
            <div className="w-25">
              <CustomSelect
                className="m-0 p-0 "
                choices={[
                  {
                    _id: "all",
                    fullName: "All",
                  },
                  ...stockmans.map((_stockman) => ({
                    ..._stockman,
                    fullName: fullName(_stockman.fullName),
                  })),
                ]}
                texts="fullName"
                values="_id"
                onChange={(value) => setStockman(value || "")}
                inputClassName="text-center text-white m-0  "
                preValue={"--"}
              />
              <h6 className="mb-2 p-0 text-center mt-1">Stokman</h6>
            </div>
          </MDBCol>
        </MDBRow>
      )}
      <MDBCard>
        <MDBCardBody>
          <MDBTable>
            <thead>
              <tr>
                <th>#</th>
                {isAdmin && <th>Stockman</th>}
                <th>Request Date</th>
                {isRejected ? (
                  <th>Rejected Date</th>
                ) : (
                  <th>Expected Approved Date</th>
                )}
                {isRejected ? <th>Reason</th> : <th>Remarks</th>}
                {isAdmin && !isRejected && <th>Total Amount</th>}
                <th className="text-center"> Products</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length > 0 ? (
                purchases.map((purchase, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    {isAdmin && (
                      <td>{fullName(purchase.requestBy.fullName)}</td>
                    )}
                    <td>{formattedDate(purchase.createdAt)}</td>
                    <td>
                      {formattedDate(
                        isRejected ? purchase.rejectedDate : purchase.expected
                      )}
                    </td>
                    <td>
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
                      <td className="text-danger font-weight-bolder">
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
        </MDBCardBody>
      </MDBCard>
      <Remarks
        show={showRemarks}
        toggle={toggleRemarks}
        remarks={remarks}
        purchase={purchase}
        isRejected={isRejected}
        isAdmin={isAdmin}
      />
      <Modal
        toggle={toggle}
        isAdmin={isRejected ? false : isAdmin}
        show={show}
        merchandises={merchandises}
        purchase={purchase}
        setMerchandises={setMerchandises}
      />
    </>
  );
};

export default Pending;
