import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBTable } from "mdbreact";

import { Search } from "../../../widgets/search";
import Modal from "./modal";

const Suppliers = () => {
  const { token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ suppliers }) => suppliers),
    [suppliers, setSuppliers] = useState([]),
    [willCreate, setWillCreate] = useState(true),
    [show, setShow] = useState(false),
    [selected, setSelected] = useState({});

  const toggle = () => setShow(!show);

  return (
    <MDBCard>
      <MDBCardBody>
        <Search title="Supplier List" setShow={setShow} />
        <MDBTable>
          <thead>
            <tr>
              <th>#</th>
              <th>Company Name</th>
              <th>Location</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
        </MDBTable>
      </MDBCardBody>
      <Modal
        show={show}
        toggle={() => {
          if (!willCreate) {
            setWillCreate(true);
            setSelected({});
          }
          setShow(false);
        }}
        selected={selected}
        willCreate={willCreate}
      />
    </MDBCard>
  );
};

export default Suppliers;
