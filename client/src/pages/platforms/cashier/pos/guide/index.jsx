import React from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTable,
  MDBTableBody,
  MDBCard,
  MDBCardBody,
  MDBTableHead,
} from "mdbreact";

const GUIDES = [
  { shorcut: "F", func: "SEARCH PRODUCT", laptop: "F" },
  { shorcut: "F1", func: "ENTER CASH", laptop: "FN + F1" },
  { shorcut: "F2", func: "PAID", laptop: "FN + F1" },
  { shorcut: "F3", func: "SUSPEND TRANSACTION", laptop: "FN + F2" },
  { shorcut: "F4", func: "VIEW SUSPENDED TRANSACTIONS", laptop: "FN + F3" },
  { shorcut: "F5", func: "FIND TRANSACTION", laptop: "FN + F4" },
  { shorcut: "F6", func: "VIEW GUIDE", laptop: "FN + F5" },
];

export default function Guide({ show, toggle }) {
  const handleClose = () => {
    toggle();
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="lg" centered>
      <MDBModalHeader
        tag="h5"
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="chalkboard-teacher" className="mr-2" />
        Shorcut Key Guide
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBCard>
          <MDBCardBody>
            <MDBTable hover responsive>
              <MDBTableHead>
                <tr>
                  <th className="text-center">Shortcut key for desktop</th>
                  <th className="text-center">Shortcut key for laptop</th>
                  <th className="text-center">Function</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {GUIDES.map((guide, index) => (
                  <tr key={index}>
                    <td className="text-center font-weight-bold">
                      {guide.shorcut}
                    </td>
                    <td className="text-center font-weight-bold">
                      {guide.laptop}
                    </td>
                    <td className="text-center font-weight-bold">
                      {guide.func}
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </MDBCardBody>
        </MDBCard>
      </MDBModalBody>
    </MDBModal>
  );
}
