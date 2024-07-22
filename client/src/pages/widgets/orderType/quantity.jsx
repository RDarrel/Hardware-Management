import React, { useEffect } from "react";
import { MDBCol, MDBRow, MDBIcon, MDBBtn, MDBInputGroup } from "mdbreact";
import Swal from "sweetalert2";

export const Quantity = ({
  quantity,
  setQuantity,
  handleSubmit,
  isCustomer = false,
  availableStocks = 0,
}) => {
  useEffect(() => {
    if (isCustomer) {
      if (quantity > availableStocks) {
        setQuantity(availableStocks);
      }
    }
  }, [quantity, setQuantity, isCustomer, availableStocks]);

  const handleChangeQuantity = (newQty) => {
    if (isCustomer) {
      if (newQty > availableStocks && availableStocks > 0) {
        setQuantity(availableStocks);
        Swal.fire({
          icon: "warning",
          title: "Purchase Limit Exceeded",
          text: `You can only purchase up to ${availableStocks} pieces.`,
          confirmButtonText: "OK",
          customClass: {
            container: "my-swal-container",
            title: "my-swal-title",
            confirmButton: "my-swal-button",
          },
        });
      } else {
        setQuantity(newQty);
      }
    } else {
      setQuantity(newQty);
    }
  };

  return (
    <MDBRow className="d-flex align-items-center mt-3">
      <MDBCol md="2">
        <h6 className={isCustomer ? "grey-text" : ""}>Quantity:</h6>
      </MDBCol>
      <MDBCol
        md={!isCustomer ? "4" : "6"}
        className="d-flex align-items-center"
      >
        <MDBInputGroup
          type="number"
          className="text-center border border-light"
          style={{ width: "70%" }}
          value={String(quantity)}
          min="1"
          onChange={({ target }) => {
            var quantity = Number(target.value);
            if (quantity < 1) quantity = 1;
            handleChangeQuantity(quantity);
          }}
          size="sm"
          prepend={
            <MDBBtn
              className="m-0 px-2 py-0"
              size="sm"
              color="light"
              onClick={() =>
                handleChangeQuantity(quantity > 1 ? quantity - 1 : quantity)
              }
              style={{ boxShadow: "0px 0px 0px 0px" }}
              outline
            >
              <MDBIcon icon="minus" style={{ color: "black" }} />
            </MDBBtn>
          }
          append={
            <MDBBtn
              className="m-0 px-2  py-0"
              size="sm"
              color="light"
              style={{ boxShadow: "0px 0px 0px 0px" }}
              onClick={() => handleChangeQuantity(quantity + 1)}
              outline
            >
              <MDBIcon icon="plus" style={{ color: "black" }} />
            </MDBBtn>
          }
        />
        {isCustomer && (
          <h6 className="grey-text ml-2 mt-2 text-nowrap">
            {availableStocks} pieces available
          </h6>
        )}
      </MDBCol>
      {!isCustomer && (
        <MDBCol md="6" className="d-flex align-items-center">
          <MDBBtn
            color="primary"
            type="submit"
            size="md"
            className="text-nowrap"
            onClick={handleSubmit}
            outline
          >
            <MDBIcon icon="shopping-cart" className="mr-1" /> ADD TO CART
          </MDBBtn>
          <MDBBtn
            color="danger"
            type="submit"
            size="md"
            onClick={() => handleSubmit(false)}
          >
            Buy Now
          </MDBBtn>
        </MDBCol>
      )}
    </MDBRow>
  );
};
