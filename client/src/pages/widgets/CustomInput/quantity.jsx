import React from "react";
import { MDBCol, MDBRow, MDBIcon, MDBBtn, MDBInputGroup } from "mdbreact";

export const Quantity = ({ quantity, setQuantity, index, setMerchandises }) => {
  const handleChange = (newQuantity) => {
    setMerchandises((prev) => {
      const _merchandises = [...prev];
      _merchandises[index] = {
        ..._merchandises[index],
        quantity: {
          ..._merchandises[index].quantity,
          approved: newQuantity,
        },
      };
      return _merchandises;
    });
  };
  return (
    <MDBRow className="d-flex align-items-center mt-3">
      <MDBCol md="12" className="d-flex justify-content-center">
        <MDBInputGroup
          type="number"
          className="text-center border border-light"
          style={{ width: "85%" }}
          value={String(quantity)}
          min="1"
          onChange={({ target }) => {
            var quantity = Number(target.value);
            if (quantity < 1) quantity = 1;
            handleChange(quantity);
          }}
          size="sm"
          prepend={
            <MDBBtn
              className="m-0 px-2 py-0"
              size="sm"
              color="light"
              onClick={() =>
                handleChange(quantity > 1 ? quantity - 1 : quantity)
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
              onClick={() => handleChange(quantity + 1)}
              outline
            >
              <MDBIcon icon="plus" style={{ color: "black" }} />
            </MDBBtn>
          }
        />
      </MDBCol>
    </MDBRow>
  );
};
