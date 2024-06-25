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
import Pending from "./pending";
import Approved from "./approved";
import { Completed } from "./completed";

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
      <MDBIcon icon="basket" /> <h4>Purchase</h4>
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
          Completed
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
            <Pending collections={collections} isAdmin={isAdmin} />
          </MDBModalBody>
        </MDBTabPane>
        <MDBTabPane tabId="approved">
          <MDBModalBody className="pt-1 p-0 bg-primary">
            <Approved collections={collections} isAdmin={isAdmin} />
          </MDBModalBody>
        </MDBTabPane>
        <MDBTabPane tabId="received">
          <MDBModalBody className="pt-1 p-0 bg-primary">
            <Approved
              collections={collections}
              isAdmin={isAdmin}
              isReceived={true}
            />
          </MDBModalBody>
        </MDBTabPane>
      </MDBTabContent>
    </>
  );
}
