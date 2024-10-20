import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBBtnGroup,
  MDBIcon,
  MDBModalBody,
  MDBTabContent,
  MDBTabPane,
} from "mdbreact";
import {
  BROWSE,
  RESET,
  UPDATE_COLLECTIONS,
} from "../../../../services/redux/slices/stockman/purchases";
import { socket } from "../../../../services/utilities";

import { useDispatch, useSelector } from "react-redux";
import Collapse from "./collapse";

export default function PurchasesDefective({ isAdmin, isDefective = true }) {
  const [activeTab, setActiveTab] = useState("pending");
  const { token, auth } = useSelector(({ auth }) => auth),
    [purchases, setPurchases] = useState([]),
    { collections = [], isLoading } = useSelector(({ purchases }) => purchases),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      BROWSE({
        token,
        key: {
          status: activeTab,
          isAdmin,
          type: isDefective ? "defective" : "discrepancy",
        },
      })
    );
    return () => dispatch(RESET());
  }, [token, dispatch, activeTab, isAdmin, auth, isDefective]);

  useEffect(() => {
    const sorted = [...collections].sort((a, b) => {
      return new Date(b.received) - new Date(a.received);
    });
    setPurchases(sorted);
  }, [collections]);

  useEffect(() => {
    socket.on("receive_purchases", (data) => {
      const baseType = isDefective ? "defective" : "discrepancy";
      const filteredPurchases = data.filter(
        ({ type, status }) =>
          status.toLowerCase() === "pending" && type.toLowerCase() === baseType
      );
      if (!!filteredPurchases) {
        dispatch(
          UPDATE_COLLECTIONS({ purchases: filteredPurchases, isUnshift: true })
        );
      }
    });

    return () => {
      socket.off("receive_purchases");
    };
  }, [dispatch, isDefective]);

  return (
    <>
      <div className="d-flex align-items-center mb-2 ">
        <MDBIcon icon="clipboard-list" size="2x" style={{ color: "blue" }} />
        <h4 className="mt-2 ml-2">
          Purchases {isDefective ? "Defective" : "Discrepancy"}
        </h4>
      </div>
      <MDBBtnGroup>
        <MDBBtn
          className="m-0 rounded-top"
          disabled={isLoading && "pending" !== activeTab}
          color="primary z-depth-0"
          onClick={() => setActiveTab("pending")}
          outline={"pending" !== activeTab}
        >
          {isDefective ? "Defective" : "Discrepancy"}
        </MDBBtn>
        <MDBBtn
          className="m-0 rounded-top"
          color="primary z-depth-0"
          onClick={() => setActiveTab("approved")}
          disabled={isLoading && "approved" !== activeTab}
          outline={"approved" !== activeTab}
        >
          {isDefective ? "Replacement" : "Acknowledge "}
        </MDBBtn>
        <MDBBtn
          className="m-0 rounded-top"
          color="primary z-depth-0"
          onClick={() => setActiveTab("received")}
          disabled={isLoading && "received" !== activeTab}
          outline={"received" !== activeTab}
        >
          Received
        </MDBBtn>
        {isAdmin && (
          <MDBBtn
            className="m-0 rounded-top"
            color="primary z-depth-0"
            onClick={() => setActiveTab("refund")}
            disabled={isLoading && "refund" !== activeTab}
            outline={"refund" !== activeTab}
          >
            Refund
          </MDBBtn>
        )}
      </MDBBtnGroup>
      <MDBTabContent
        activeItem={activeTab}
        style={{
          border: "2px solid",
          borderBottomRadius: "5px",
        }}
        className="p-0 border-primary z-depth-1"
      >
        <MDBTabPane tabId="pending">
          <MDBModalBody className="pt-1 p-0 bg-primary">
            <Collapse
              collections={purchases}
              status="defective"
              isAdmin={isAdmin}
              isDefective={isDefective}
              isLoading={isLoading}
            />
          </MDBModalBody>
        </MDBTabPane>

        <MDBTabPane tabId="approved">
          <MDBModalBody className="pt-1 p-0 bg-primary">
            <Collapse
              collections={purchases}
              status="replacement"
              isDefective={isDefective}
              isAdmin={isAdmin}
              isLoading={isLoading}
            />
          </MDBModalBody>
        </MDBTabPane>
        <MDBTabPane tabId="received">
          <MDBModalBody className="pt-1 p-0 bg-primary">
            <Collapse
              collections={purchases}
              status="received"
              isDefective={isDefective}
              isAdmin={isAdmin}
              isLoading={isLoading}
            />
          </MDBModalBody>
        </MDBTabPane>

        <MDBTabPane tabId="refund">
          <MDBModalBody className="pt-1 p-0 bg-primary">
            <Collapse
              collections={purchases}
              status="refund"
              isDefective={isDefective}
              isAdmin={isAdmin}
              isLoading={isLoading}
            />
          </MDBModalBody>
        </MDBTabPane>
      </MDBTabContent>
    </>
  );
}
