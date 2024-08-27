import React, { useEffect, useRef } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBIcon,
  MDBInputGroup,
  MDBRow,
} from "mdbreact";
import Swal from "sweetalert2";

const Footer = ({
  invoice_no,
  total,
  // setCheckout,
  isWalkin,
  orderDetails,
  cash,
  toggle,
  setCash,
  setIsWalkInQuotation,
}) => {
  const change = Number(cash) - Number(total);
  const cashDivRef = useRef(null);

  useEffect(() => {
    setCash(total);
  }, [total, setCash]);

  const handlePaid = (e) => {
    e.preventDefault();
    if (cash < total)
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Cash is not sufficient.",
      });

    toggle();
  };
  const handleQuotation = () => {
    toggle();
    setIsWalkInQuotation(true);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "F2") {
        event.preventDefault(); // Prevent the default browser action for F1
        // setCheckout(false);
        document.getElementById("paid").click();
        // Perform your suspend action here
      } else if (event.key.toUpperCase() === "F1") {
        event.preventDefault(); // Prevent the default browser action for F1

        const inputElement = cashDivRef?.current?.querySelector("input");
        if (inputElement) {
          inputElement.focus();
        }
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
      <form onSubmit={handlePaid}>
        <MDBCard className="m-0 p-0 mb-2 bg-light mt-3 dotted-order order">
          <div className="striped-border-order"></div>
          <MDBCardBody className="m-0 p-0 ">
            <div className="mb-1  p-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="m-0">
                  {!isWalkin ? "Invoice No." : "Quotation No."}
                </span>
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
              {!isWalkin && (
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className=" m-0">Cash</span>
                  {invoice_no ? (
                    <div className="w-25" ref={cashDivRef}>
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
              )}
              {!isWalkin && (
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
              )}
            </div>
          </MDBCardBody>
        </MDBCard>
        <MDBRow>
          <MDBCol>
            <MDBBtn
              color="primary"
              size="sm"
              id="paid"
              type="submit"
              block
              disabled={orderDetails.length === 0}
              className="d-flex justify-content-center btn-paid "
            >
              <div className="d-flex ">
                <h5 className="text-white mr-2 font-weight-bold "> Pay</h5>
                <MDBIcon icon="cash-register" className="paid-icon" size="2x" />
              </div>
            </MDBBtn>
          </MDBCol>
          <MDBCol>
            <MDBBtn
              color="danger"
              size="sm"
              id="paid"
              type="button"
              onClick={handleQuotation}
              block
              disabled={orderDetails.length === 0}
              className="d-flex justify-content-center btn-paid "
            >
              <div className="d-flex ">
                <h5 className="text-white mr-2 font-weight-bold ">Quotation</h5>
                <MDBIcon icon="walking" className="paid-icon" size="2x" />
              </div>
            </MDBBtn>
          </MDBCol>
        </MDBRow>
      </form>
    </>
  );
};

export default Footer;
