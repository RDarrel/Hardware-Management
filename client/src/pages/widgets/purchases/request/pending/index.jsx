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
import Modal from "./modal";
import CustomSelect from "../../../../../components/customSelect";
import Remarks from "./remarks";
import filterBy from "../../filterBy";

const Pending = ({ collections, isAdmin }) => {
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
      setStockmans(filterBy("requestBy", collections) || []);
      setPurchases(collections);
    }
  }, [collections]);

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
                <th>Expected Date</th>
                <th>Remarks</th>
                <th>Total Amount</th>
                <th className="text-center">Request Products</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {isAdmin && <td>{fullName(purchase.requestBy.fullName)}</td>}
                  <td>{formattedDate(purchase.expected)}</td>
                  <td>
                    <MDBBadge
                      className="cursor-pointer p-2"
                      color="info"
                      onClick={() => {
                        setRemarks(purchase.remarks || "");
                        setPurchase(purchase);
                        toggleRemarks();
                      }}
                    >
                      <MDBIcon icon="comment-alt" size="1x" />
                    </MDBBadge>
                  </td>
                  <td className="text-danger font-weight-bolder">
                    ₱ {purchase.total.toLocaleString()}
                  </td>
                  <td className="text-center">
                    <MDBBtn
                      color="success"
                      size="sm"
                      onClick={() => {
                        setMerchandises(purchase.merchandises);
                        setPurchase(purchase);

                        setShow(true);
                      }}
                    >
                      <MDBIcon icon="shopping-cart" />
                    </MDBBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </MDBTable>
        </MDBCardBody>
      </MDBCard>
      <Remarks
        show={showRemarks}
        toggle={toggleRemarks}
        remarks={remarks}
        purchase={purchase}
      />
      <Modal
        toggle={toggle}
        show={show}
        merchandises={merchandises}
        purchase={purchase}
        setMerchandises={setMerchandises}
      />
    </>
  );
};

export default Pending;
