import React, { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardHeader,
  MDBIcon,
  MDBPopover,
  MDBPopoverBody,
  MDBBtn,
} from "mdbreact";
import { fullName } from "../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import "./header.css";
import Transactions from "../transactions";
import { BROWSE } from "../../../../../services/redux/slices/cashier/suspendedTransacs";
import SuspendedTransacs from "../suspendedTransacs";
import Guide from "../guide";

const Header = ({
  setOrders,
  setInvoice_no,
  products,
  showSuspend,
  toggleSuspended,
  showGuide,
  toggleGuide,
  showFindTransac,
  toggleFindTransac,
  isLoading = false,
}) => {
  const { auth, token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ suspendedTransacs }) => suspendedTransacs),
    [suspendedTransacs, setSuspendedTransacs] = useState([]),
    [id, setId] = useState(0),
    dispatch = useDispatch();

  useEffect(() => {
    if (auth._id) {
      dispatch(BROWSE({ token, key: { cashier: auth._id } }));
    }
  }, [dispatch, token, auth]);

  useEffect(() => {
    setSuspendedTransacs(collections);
  }, [collections]);

  return (
    <MDBCard className="w-100 mb-2">
      <MDBCardHeader className="d-flex align-items-center justify-content-between ">
        <h5 className="font-weight-bold">Liberty Hardware </h5>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center mr-2 m-0 p-0">
            <MDBBtn
              color="warning"
              size="sm"
              className="font-weight-bold"
              onClick={toggleFindTransac}
              disabled={isLoading}
            >
              <MDBIcon icon="handshake" far size="1x" className="mr-1" />
              Transaction
            </MDBBtn>
          </div>

          <div className="d-flex align-items-center  m-0 p-0">
            <MDBBtn
              size="sm"
              color="info"
              className="font-weight-bold"
              disabled={isLoading}
              onClick={toggleSuspended}
            >
              <MDBIcon far icon="pause-circle" className="mr-1" />
              Suspended Transactions
            </MDBBtn>
          </div>
        </div>
        <div onMouseLeave={() => setId((prev) => prev + 1)} className="p-1">
          <MDBPopover placement="bottom" popover id={`popover-${id}`} key={id}>
            <MDBBtn
              className="d-flex align-items-center m-0 p-0 profile-pop-over-btn mr-5"
              size="sm"
              id={`btn-pop-over-${id}`}
            >
              <MDBIcon icon="user-alt" size="2x" style={{ color: "black" }} />
              <h6 className="text-black mt-2 ml-3">
                {fullName(auth.fullName)}
              </h6>
            </MDBBtn>
            <MDBPopoverBody
              className="profile-popover-body"
              id={`pop-body-${id}`}
            >
              <MDBBtn
                color="primary"
                size="sm"
                block
                onClick={() => {
                  if (auth._id) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("email");
                  }
                  window.location.href = "/";
                }}
              >
                Logout
              </MDBBtn>
            </MDBPopoverBody>
          </MDBPopover>
        </div>
      </MDBCardHeader>
      <Guide show={showGuide} toggle={toggleGuide} />
      <SuspendedTransacs
        show={showSuspend}
        products={products}
        toggle={toggleSuspended}
        setOrders={setOrders}
        setInvoice_no={setInvoice_no}
        collections={suspendedTransacs}
      />
      <Transactions show={showFindTransac} toggle={toggleFindTransac} />
    </MDBCard>
  );
};

export default Header;
