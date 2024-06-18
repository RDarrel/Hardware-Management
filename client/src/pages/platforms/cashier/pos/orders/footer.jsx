import React from "react";
import { MDBBtn, MDBIcon } from "mdbreact";

const Footer = ({ invoice_no, total, setCheckout, orderDetails }) => {
  return (
    <div className="transac">
      <hr className="dotted" />
      <div className="mb-3 bg-light p-1">
        <div className="d-flex justify-content-between m-1">
          <h6 className="ml-1 mt-1">Invoice No.</h6>
          <h6 className="ml-1 mt-1">{invoice_no ? invoice_no : ""}</h6>
        </div>
        <div className="d-flex justify-content-between m-1">
          <h4 className="font-weight-bold">Total</h4>
          <h4 className="text-danger">
            {total ? `₱${total.toLocaleString()}` : ""}
          </h4>
        </div>
      </div>
      <MDBBtn
        color="primary"
        size="sm"
        block
        onClick={() => setCheckout(true)}
        disabled={orderDetails.length === 0}
        className="d-flex justify-content-center btn-paid"
      >
        <div className="d-flex ">
          <h5 className="text-white mr-2 font-weight-bold "> Paid</h5>
          <MDBIcon icon="money-bill" className="paid-icon" size="2x" />
        </div>
      </MDBBtn>
    </div>
  );
};

export default Footer;
