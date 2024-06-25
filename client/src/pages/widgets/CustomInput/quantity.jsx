import React from "react";
import { MDBCol, MDBRow, MDBIcon, MDBBtn, MDBInputGroup } from "mdbreact";

export const Quantity = ({
  isAdmin,
  maxQuantity,
  quantity,
  setQuantity,
  index,
  setMerchandises,
  baseKey,
}) => {
  const handleChange = (newQuantity) => {
    setMerchandises((prev) => {
      const _merchandises = [...prev];
      _merchandises[index] = {
        ..._merchandises[index],
        quantity: {
          ..._merchandises[index].quantity,
          [baseKey]: newQuantity,
        },
      };
      return _merchandises;
    });
  };
  return (
    <MDBRow className="d-flex align-items-center mt-2">
      <MDBCol md="12" className="d-flex justify-content-center">
        <MDBInputGroup
          type="number"
          className="text-center border border-light"
          style={{ width: "85%" }}
          value={String(quantity)}
          min="1"
          onChange={({ target }) => {
            var quantity = Number(target.value);
            if (quantity < 1 && baseKey !== "defective") quantity = 1;
            if (quantity < 1 && baseKey === "defective") quantity = 0;
            if (!isAdmin && quantity > maxQuantity) quantity = maxQuantity;
            handleChange(quantity);
          }}
          size="sm"
          prepend={
            <MDBBtn
              className="m-0 px-2 py-0"
              size="sm"
              color="light"
              onClick={() => {
                var newQuantity = quantity;

                if (baseKey !== "defective" && newQuantity > 1) {
                  newQuantity -= 1;
                } else if (baseKey === "defective" && newQuantity > 0) {
                  newQuantity -= 1;
                }

                handleChange(newQuantity);
              }}
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
              onClick={() =>
                handleChange(
                  !isAdmin && quantity >= maxQuantity
                    ? maxQuantity
                    : quantity + 1
                )
              }
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
