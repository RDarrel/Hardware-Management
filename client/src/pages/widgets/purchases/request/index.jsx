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
} from "../../../../services/redux/slices/stockman/purchases";

import { useDispatch, useSelector } from "react-redux";
import Collapse from "./collapse";

export default function Request({ isAdmin }) {
  const [activeTab, setActiveTab] = useState("pending");
  const { token, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ purchases }) => purchases),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      BROWSE({
        token,
        key: { status: activeTab, isAdmin, requestBy: auth._id },
      })
    );
    return () => dispatch(RESET());
  }, [token, dispatch, activeTab, isAdmin, auth]);

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
        >
          Pending
        </MDBBtn>
        <MDBBtn
          className="m-0 rounded-top"
          color="primary z-depth-0"
          onClick={() => setActiveTab("approved")}
          outline={"approved" !== activeTab}
        >
          Approved
        </MDBBtn>

        <MDBBtn
          className="m-0 rounded-top"
          color="primary z-depth-0"
          onClick={() => setActiveTab("received")}
          outline={"received" !== activeTab}
        >
          Received
        </MDBBtn>

        <MDBBtn
          className="m-0 rounded-top"
          color="primary z-depth-0"
          onClick={() => setActiveTab("reject")}
          outline={"reject" !== activeTab}
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
              collections={collections}
              isAdmin={isAdmin}
              isApproved={false}
            />
          </MDBModalBody>
        </MDBTabPane>
        <MDBTabPane tabId="approved">
          <MDBModalBody className="pt-1 p-0 bg-primary">
            <Collapse
              collections={collections}
              isAdmin={isAdmin}
              isApproved={true}
              isRejected={false}
            />
          </MDBModalBody>
        </MDBTabPane>
        <MDBTabPane tabId="received">
          <MDBModalBody className="pt-1 p-0 bg-primary">
            <Collapse
              collections={collections}
              isAdmin={isAdmin}
              isApproved={true}
              isReceived={true}
              isRejected={false}
            />
          </MDBModalBody>
        </MDBTabPane>
        <MDBTabPane tabId="reject">
          <MDBModalBody className="pt-1 p-0 bg-primary">
            <Collapse
              collections={collections}
              isAdmin={isAdmin}
              isRejected={true}
            />
          </MDBModalBody>
        </MDBTabPane>
      </MDBTabContent>
    </>
  );
}
