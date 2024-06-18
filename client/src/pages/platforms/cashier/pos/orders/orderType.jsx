import React from "react";
import { MDBInputGroup, MDBBtn, MDBIcon } from "mdbreact";
const OrderType = ({ item, index, handleChange, handleChangeGrams }) => {
  return (
    <>
      {item.product?.isPerKilo ? (
        <MDBInputGroup
          type="number"
          value={String(item.kilo)}
          onChange={({ target }) => {
            if (target.value < 0) {
              handleChange(index, 0, true);
            } else {
              handleChange(index, target.value, true);
            }
          }}
          min={0}
          style={{ width: "25%", height: "30%" }}
          append={
            <select
              className="form-control"
              value={String(item.kiloGrams || 0)}
              onChange={({ target }) => handleChangeGrams(index, target.value)}
            >
              <option value={"0"}>kl</option>
              <option value={"0.25"}>1/4</option>
              <option value={"0.5"}>1/2</option>
              <option value={"0.75"}>3/4</option>
            </select>
          }
        />
      ) : (
        <MDBInputGroup
          type="number"
          className="text-center border border-light"
          style={{ width: "25%", height: "30%" }}
          value={String(item.quantity)}
          onChange={({ target }) => {
            if (target.value < 1) {
              handleChange(index, 1, false);
            } else {
              handleChange(index, target.value, false);
            }
          }}
          size="sm"
          prepend={
            <MDBBtn
              className="m-0 px-2 py-0"
              size="sm"
              color="light"
              onClick={() =>
                handleChange(
                  index,
                  item.quantity > 1 ? item.quantity - 1 : item.quantity
                )
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
              onClick={() => handleChange(index, item.quantity + 1)}
              color="light"
              style={{ boxShadow: "0px 0px 0px 0px" }}
              outline
            >
              <MDBIcon icon="plus" style={{ color: "black" }} />
            </MDBBtn>
          }
        />
      )}
    </>
  );
};

export default OrderType;
