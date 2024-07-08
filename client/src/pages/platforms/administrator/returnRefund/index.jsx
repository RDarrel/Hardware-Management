import React, { useCallback, useEffect, useState } from "react";
import {
  MDBBtn,
  MDBBtnGroup,
  MDBIcon,
  MDBModalBody,
  MDBTabContent,
  MDBTabPane,
} from "mdbreact";
import { BROWSE } from "../../../../services/redux/slices/administrator/returnRefund";
import { useDispatch, useSelector } from "react-redux";
import Content from "./content";

export default function ReturnRefund() {
  const [activeTab, setActiveTab] = useState("returnBy");
  const { token } = useSelector(({ auth }) => auth),
    [returnRefund, setReturnRefund] = useState([]),
    { collections } = useSelector(({ returnRefund }) => returnRefund),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [dispatch, token]);

  const handleFiltered = useCallback(
    (filterBy, baseKey) => {
      return collections
        ? collections
            .filter(({ status }) => status === filterBy)
            .reduce((acc, curr) => {
              const key = curr[baseKey]?._id;
              const index = acc.findIndex((obj) => obj[baseKey]?._id === key);
              if (index > -1) {
                acc[index].arrangeByCashier.push(curr);
              } else {
                acc.push({ ...curr, key, arrangeByCashier: [curr] });
              }
              return acc;
            }, [])
        : [];
    },
    [collections] // Dependencies
  );

  useEffect(() => {
    if (activeTab) {
      setReturnRefund(
        handleFiltered(
          activeTab === "returnBy" ? "return" : "refund",
          activeTab
        )
      );
    }
  }, [activeTab, handleFiltered]);

  return (
    <>
      <div className="d-flex align-items-center mb-2 ">
        <MDBIcon icon="exchange-alt" size="2x" style={{ color: "blue" }} />
        <h4 className="mt-2 ml-2">Return/Refund</h4>
      </div>
      <MDBBtnGroup>
        <MDBBtn
          className="m-0 rounded-top"
          color="primary z-depth-0"
          onClick={() => setActiveTab("returnBy")}
          outline={"returnBy" !== activeTab}
        >
          Replacement
        </MDBBtn>
        <MDBBtn
          className="m-0 rounded-top"
          color="primary z-depth-0"
          onClick={() => setActiveTab("refundBy")}
          outline={"refundBy" !== activeTab}
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
        <MDBTabPane tabId="returnBy">
          <MDBModalBody className="pt-1 p-0 bg-primary">
            <Content
              collections={returnRefund}
              isReturn={true}
              baseKey={"cashier"}
            />
          </MDBModalBody>
        </MDBTabPane>
        <MDBTabPane tabId="refundBy">
          <MDBModalBody className="pt-1 p-0 bg-primary">
            <Content
              collections={returnRefund}
              isReturn={false}
              baseKey={"cashier"}
            />
          </MDBModalBody>
        </MDBTabPane>
      </MDBTabContent>
    </>
  );
}
