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
} from "../../../../services/redux/slices/stockman/defectivePurchases";

import { useDispatch, useSelector } from "react-redux";
import Collapse from "./collapse";

export default function PurchasesDefective({ isAdmin }) {
  const [activeTab, setActiveTab] = useState("defective");
  const { token, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(
      ({ defectivePurchases }) => defectivePurchases
    ),
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
        <h4 className="mt-2 ml-2">Purchases Defective</h4>
      </div>
      <MDBBtnGroup>
        <MDBBtn
          className="m-0 rounded-top"
          color="primary z-depth-0"
          onClick={() => setActiveTab("defective")}
          outline={"defective" !== activeTab}
        >
          Defective
        </MDBBtn>
        <MDBBtn
          className="m-0 rounded-top"
          color="primary z-depth-0"
          onClick={() => setActiveTab("approved")}
          outline={"approved" !== activeTab}
        >
          Replacement
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
          onClick={() => setActiveTab("refund")}
          outline={"refund" !== activeTab}
        >
          Refund
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
        <MDBTabPane tabId="defective">
          <MDBModalBody className="pt-1 p-0 bg-primary">
            <Collapse
              collections={collections}
              status="defective"
              isAdmin={isAdmin}
            />
          </MDBModalBody>
        </MDBTabPane>
      </MDBTabContent>
    </>
  );
}
