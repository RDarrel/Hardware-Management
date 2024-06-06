import React, { useState } from "react";
import "./style.css";
import {
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBBtn,
  MDBPopover,
  MDBPopoverBody,
} from "mdbreact";

const Profile = () => {
  const [id, setId] = useState(0);
  return (
    <MDBRow>
      <MDBCol
        md="12"
        className="d-flex justify-content-end align-items-center h-100 p-1"
        onMouseLeave={() => setId((prev) => prev + 1)}
      >
        <MDBPopover placement="bottom" popover id={`popover-${id}`} key={id}>
          <MDBBtn
            className="d-flex align-items-center m-0 p-0 pop-over-btn mr-3"
            size="sm"
            id={`btn-pop-over-${id}`}
          >
            <MDBIcon icon="user-alt" size="2x" style={{ color: "white" }} />
            <h6 className="text-white mt-2 ml-3">Ric Darrel Pajarilaga</h6>
          </MDBBtn>
          <MDBPopoverBody className="popover-body" id={`pop-body-${id}`}>
            <MDBBtn block color="primary">
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
