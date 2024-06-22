import React, { useState } from "react";
import {
  MDBCard,
  MDBCardHeader,
  MDBIcon,
  MDBPopover,
  MDBPopoverBody,
  MDBBtn,
} from "mdbreact";
import { fullName } from "../../../../../services/utilities";
import { useSelector } from "react-redux";
import "./header.css";
import Transactions from "../transactions";

const Header = () => {
  const { auth } = useSelector(({ auth }) => auth);
  const [id, setId] = useState(0);
  const [show, setShow] = useState(false);

  const toggle = () => setShow(!show);

  return (
    <MDBCard className="w-100 mb-2">
      <MDBCardHeader className="d-flex align-items-center justify-content-between ">
        <h5 className="font-weight-bold">Liberty Hardware </h5>
        <div
          className="d-flex align-items-center cursor-pointer"
          onClick={toggle}
        >
          <MDBIcon
            icon="handshake"
            far
            size="2x"
            className="mr-3"
            style={{ color: "#4285F4" }}
          />
          <h5 className="mt-2">Transactions</h5>
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
      <Transactions show={show} toggle={toggle} />
    </MDBCard>
  );
};

export default Header;
