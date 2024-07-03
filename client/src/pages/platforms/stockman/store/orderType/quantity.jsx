import React from "react";
import { MDBCol, MDBRow, MDBIcon, MDBBtn, MDBInputGroup } from "mdbreact";

export const Quantity = ({ quantity, setQuantity, handleSubmit }) => {
  return (
    <MDBRow className="d-flex align-items-center mt-1">
      <MDBCol md="2">Quantity:</MDBCol>
      <MDBCol md="4">
        <MDBInputGroup
          type="number"
          className="text-center border border-light"
          style={{ width: "70%" }}
          value={String(quantity)}
          min="1"
          onChange={({ target }) => {
            var quantity = Number(target.value);
            if (quantity < 1) quantity = 1;
            setQuantity(quantity);
          }}
          size="sm"
          prepend={
            <MDBBtn
              className="m-0 px-2 py-0"
              size="sm"
              color="light"
              onClick={() =>
                setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
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
              onClick={() => setQuantity((prev) => prev + 1)}
              outline
            >
              <MDBIcon icon="plus" style={{ color: "black" }} />
            </MDBBtn>
          }
        />
      </MDBCol>
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
          Request Now
        </MDBBtn>
      </MDBCol>
    </MDBRow>
  );
};
