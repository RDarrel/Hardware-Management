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

export default function Request({ isAdmin }) {
  const [activeTab, setActiveTab] = useState("pending");
  const { token, auth } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(({ purchases }) => purchases),
    [purchases, setPurchases] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      BROWSE({
        token,
        key: {
          status: activeTab,
          isAdmin,
          requestBy: auth._id,
          type: "request",
        },
      })
    );
    return () => dispatch(RESET());
  }, [token, dispatch, activeTab, isAdmin, auth]);

  useEffect(() => {
    setPurchases(collections);
    console.log(collections);
    console.log("running again");
  }, [collections]);

  useEffect(() => {
    socket.on("receive_purchases", (data) => {
      const hasRequest = data.every(
        ({ type, status }) =>
          status.toLowerCase() === "pending" && type.toLowerCase() === "request"
      );
      if (hasRequest) {
        dispatch(UPDATE_COLLECTIONS({ purchases: data, isUnshift: false }));
      }
    });

    return () => {
      socket.off("receive_purchases");
    };
  }, [dispatch]);

  return (
    <>
      <div className="d-flex align-items-center mb-2 ">
        <MDBIcon icon="clipboard-list" size="2x" style={{ color: "blue" }} />
        <h4 className="mt-2 ml-2">Purchases Request</h4>
      </div>
      <MDBBtnGroup>
        <MDBBtn
          className="m-0 rounded-top"
          color="primary z-depth-0"
          onClick={() => setActiveTab("pending")}
          outline={"pending" !== activeTab}
          disabled={isLoading && "pending" !== activeTab}
        >
          Pending
        </MDBBtn>
        <MDBBtn
          className="m-0 rounded-top"
          color="primary z-depth-0"
          onClick={() => setActiveTab("approved")}
          outline={"approved" !== activeTab}
          disabled={isLoading && "approved" !== activeTab}
        >
          Approved
        </MDBBtn>

        <MDBBtn
          className="m-0 rounded-top"
          color="primary z-depth-0"
          onClick={() => setActiveTab("received")}
          outline={"received" !== activeTab}
          disabled={isLoading && "received" !== activeTab}
        >
          Received
        </MDBBtn>

        <MDBBtn
          className="m-0 rounded-top"
          color="primary z-depth-0"
          onClick={() => setActiveTab("reject")}
          outline={"reject" !== activeTab}
          disabled={isLoading && "rejected" !== activeTab}
        >
          Rejected
        </MDBBtn>
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
              isAdmin={isAdmin}
              isApproved={false}
              isLoading={isLoading}
            />
          </MDBModalBody>
        </MDBTabPane>
        <MDBTabPane tabId="approved">
          <MDBModalBody className="pt-1 p-0 bg-primary">
            <Collapse
              collections={purchases}
              isAdmin={isAdmin}
              isApproved={true}
              isRejected={false}
              isLoading={isLoading}
            />
          </MDBModalBody>
        </MDBTabPane>
        <MDBTabPane tabId="received">
          <MDBModalBody className="pt-1 p-0 bg-primary">
            <Collapse
              collections={purchases}
              isAdmin={isAdmin}
              isApproved={true}
              isReceived={true}
              isRejected={false}
              isLoading={isLoading}
            />
          </MDBModalBody>
        </MDBTabPane>
        <MDBTabPane tabId="reject">
          <MDBModalBody className="pt-1 p-0 bg-primary">
            <Collapse
              collections={purchases}
              isAdmin={isAdmin}
              isRejected={true}
              isLoading={isLoading}
            />
          </MDBModalBody>
        </MDBTabPane>
      </MDBTabContent>
    </>
  );
}
