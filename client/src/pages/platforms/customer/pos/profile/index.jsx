import React, { useState } from "react";
import "./profile.css";
import {
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBBtn,
  MDBPopover,
  MDBPopoverBody,
} from "mdbreact";
import { useSelector } from "react-redux";
// import { fullName } from "../../../../../services/utilities";

const Profile = () => {
  const { auth } = useSelector(({ auth }) => auth);
  const [id, setId] = useState(0);
  console.log("running");
  return (
    <MDBRow>
      <MDBCol
        md="12"
        className="d-flex justify-content-end align-items-center h-100 p-1"
        onMouseLeave={() => setId((prev) => prev + 1)}
      >
        <MDBPopover placement="bottom" popover id={`popover-${id}`} key={id}>
          <MDBBtn
            className="d-flex align-items-center m-0 p-0 quotation-profile-pop-over-btn mr-5"
            size="sm"
            id={`btn-pop-over-${id}`}
          >
            <MDBIcon icon="user-alt" size="2x" style={{ color: "white" }} />
            <h6 className="text-white mt-2 ml-3">{auth.email}</h6>
          </MDBBtn>
          <MDBPopoverBody
            className="quotation-profile-popover-body"
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
        ;
      </MDBCol>
    </MDBRow>
  );
};

export default Profile;
