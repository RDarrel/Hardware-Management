import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
  MDBRow,
  MDBCol,
  MDBTypography,
  MDBTable,
  MDBBtnGroup,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";

const _form = {
  name: "",
};

export default function SuspendedTransacs({ show, toggle, collections = [] }) {
  const { token } = useSelector(({ auth }) => auth);

  const handleClose = () => {
    toggle();
  };
  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      disableFocusTrap={false}
      size="lg"
    >
      <MDBModalHeader
        toggle={handleClose}
        tag="h5"
        className="light-blue darken-3 white-text"
      >
        <MDBIcon far icon="pause-circle" className="mr-2" /> Suspended
        Transactions
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBTable>
          <thead>
            <tr>
              <th>#</th>
              <th className="text-center">Invoice No.</th>
              <th className="text-center">Total Amount</th>
              <th className="text-center"> Action</th>
            </tr>
          </thead>
          <tbody>
            {collections?.length > 0 ? (
              collections.map((order, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="text-center">{order.invoice_no}</td>
                  <td className="text-center text-danger font-weight-bold">
                    ₱{order.total}
                  </td>
                  <td className="text-center">
                    <MDBBtnGroup>
                      <MDBBtn size="sm" rounded color="warning">
                        <MDBIcon icon="eye" />
                      </MDBBtn>
                      <MDBBtn size="sm" rounded color="primary">
                        <MDBIcon icon="sign-out-alt" />
                      </MDBBtn>
                    </MDBBtnGroup>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center"></td>No records.
              </tr>
            )}
          </tbody>
        </MDBTable>
      </MDBModalBody>
    </MDBModal>
  );
}
