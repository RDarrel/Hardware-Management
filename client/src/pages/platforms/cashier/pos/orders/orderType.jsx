import React, { useEffect, useState } from "react";
import { MDBInputGroup, MDBBtn, MDBIcon } from "mdbreact";
const OrderType = ({
  item,
  index,
  handleChange,
  handleChangeGrams,
  orders,
}) => {
  const [maxQty, setMaxQty] = useState(0),
    [maxKilo, setMaxKilo] = useState(0),
    [maxKiloGrams, setMaxKiloGrams] = useState(0);

  useEffect(() => {
    if (item.product?.isPerKilo) {
      const max = String(item.max).split(".");
      const maxKl = Number(max[0] || 0);
      const maxKlg = Number(max[1] || 0);
      if (item.max >= 1) {
        setMaxKilo(maxKl || 0);
      }
      setMaxKiloGrams(maxKlg === 5 ? 50 : maxKlg || 0);
    } else {
      setMaxQty(item.max || 0);
    }
  }, [item]);

  const handleDisabledGrams = (grams) => {
    const orderKilo = orders[index].kilo;
    const orderGrams = orders[index].kiloGrams || 0;
    if (maxKilo >= 1) {
      if (orderKilo === maxKilo) {
        const gramsConverted = String(orderGrams).split(".")[1] || 0;

        if (gramsConverted > maxKiloGrams) {
          handleChangeGrams(index, 0);
        }
        return grams > maxKiloGrams;
      }
    } else {
      return grams > maxKiloGrams;
    }
  };
  return (
    <div>
      {item.product?.isPerKilo ? (
        <MDBInputGroup
          type="number"
          value={String(item.kilo)}
          onChange={({ target }) => {
            const newKilo = Number(target.value);
            if (newKilo < 0) {
              handleChange(index, 0, true);
            } else if (newKilo >= maxKilo) {
              handleChange(index, maxKilo, true);
            } else {
              handleChange(index, target.value, true);
            }
          }}
          min={0}
          style={{ width: "100%" }}
          append={
            <select
              className="form-control"
              value={String(item.kiloGrams || 0)}
              onChange={({ target }) => handleChangeGrams(index, target.value)}
            >
              <option value={"0"}>kl</option>
              <option
                value={"0.25"}
                disabled={handleDisabledGrams(25)}
                className={
                  handleDisabledGrams(25) ? "bg-danger text-white " : ""
                }
              >
                1/4
              </option>
              <option
                className={
                  handleDisabledGrams(50) ? "bg-danger text-white " : ""
                }
                value={"0.5"}
                disabled={handleDisabledGrams(50)}
              >
                1/2
              </option>
              <option
                value={"0.75"}
                disabled={handleDisabledGrams(75)}
                className={
                  handleDisabledGrams(75) ? "bg-danger text-white " : ""
                }
              >
                3/4
              </option>
            </select>
          }
        />
      ) : (
        <MDBInputGroup
          type="number"
          className="text-center border border-light "
          style={{ width: "100%" }}
          value={String(item.quantity)}
          onChange={({ target }) => {
            const newQty = Number(target.value);
            if (newQty < 1) {
              handleChange(index, 1, false);
            } else if (newQty >= maxQty) {
              handleChange(index, maxQty, false);
            } else {
              handleChange(index, newQty, false);
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
              onClick={() =>
                handleChange(
                  index,
                  item.quantity >= maxQty ? maxQty : item.quantity + 1
                )
              }
              color="light"
              style={{ boxShadow: "0px 0px 0px 0px" }}
              outline
            >
              <MDBIcon icon="plus" style={{ color: "black" }} />
            </MDBBtn>
          }
        />
      )}
    </div>
  );
};

export default OrderType;
