import React, { useEffect } from "react";
import { MDBBtn, MDBCard, MDBCardBody, MDBIcon, MDBInputGroup } from "mdbreact";
import Swal from "sweetalert2";

const Footer = ({
  invoice_no,
  total,
  setCheckout,
  orderDetails,
  cash,
  setCash,
}) => {
  useEffect(() => {
    setCash(total);
  }, [total, setCash]);
  const change = Number(cash) - Number(total);

  const handlePaid = () => {
    if (cash < total)
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Cash is not sufficient.",
      });

    setCheckout(true);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "F1") {
        event.preventDefault(); // Prevent the default browser action for F1
        document.getElementById("paid").click();
        // Perform your suspend action here
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <>
      <MDBCard className="m-0 p-0 mb-2 bg-light mt-3 dotted-order order">
        <div className="striped-border-order"></div>
        <MDBCardBody className="m-0 p-0 ">
          <div className="mb-1  p-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="m-0">Invoice No.</span>
              <h6 className="m-0">{invoice_no ? invoice_no : ""}</h6>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="m-0 font-weight-bold">Total</span>
              <h5 className="text-danger m-0">
                {invoice_no
                  ? total
                    ? `₱${total.toLocaleString()}.00`
                    : "0.00"
                  : ""}
              </h5>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className=" m-0">Cash</span>
              {invoice_no ? (
                <div className="w-25">
                  <MDBInputGroup
                    className="m-0 p-0  font-weight-bold text-danger d-flex align-items-center"
                    prepend={
                      <h5 className="d-flex align-items-center mt-2 text-danger">
                        ₱
                      </h5>
                    }
                    value={String(cash)}
                    type="number"
                    onChange={({ target }) => setCash(Number(target.value))}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="d-flex justify-content-between align-items-center ">
              <span className="font-weight-bold m-0">Change</span>
              <h5 className="text-danger m-0 ">
                {invoice_no
                  ? change
                    ? `₱${change ? change : 0}.00`
                    : "0.00"
                  : ""}
              </h5>
            </div>
          </div>
          {/* <div className="striped-border-order"></div> */}
        </MDBCardBody>
      </MDBCard>
      <MDBBtn
        color="primary"
        size="sm"
        id="paid"
        block
        onClick={handlePaid}
        disabled={orderDetails.length === 0}
        className="d-flex justify-content-center btn-paid mt-3"
      >
        <div className="d-flex ">
          <h5 className="text-white mr-2 font-weight-bold "> Paid</h5>
          <MDBIcon icon="cash-register" className="paid-icon" size="2x" />
        </div>
      </MDBBtn>
    </>
  );
};

export default Footer;
