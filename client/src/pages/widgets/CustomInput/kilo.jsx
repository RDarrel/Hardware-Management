import { MDBRow, MDBCol, MDBInputGroup } from "mdbreact";
import React from "react";

const Kilo = ({
  isAdmin,
  baseKey,
  kilo,
  maxKilo,
  maxKiloGrams,
  setKilo,
  kiloGrams,
  setKiloGrams,
  setMerchandises,
  index,
}) => {
  return (
    <MDBRow className="mt-2 d-flex align-items-center">
      <MDBCol
        md="12"
        className="m-0 d-flex  justify-content-center align-items-center"
      >
        <MDBInputGroup
          type="number"
          style={{ width: "70%" }}
          value={String(kilo)}
          onChange={({ target }) => {
            var kilo = Number(target.value);
            if (kilo < 0) kilo = 0;
            if (!isAdmin && kilo > maxKilo) kilo = maxKilo;
            setMerchandises((prev) => {
              const _merchandises = [...prev];
              _merchandises[index] = {
                ..._merchandises[index],
                kilo: { ..._merchandises[index].kilo, [baseKey]: kilo },
              };
              return _merchandises;
            });
          }}
          className="text-center border border-light"
          append={
            <select
              className="form-control"
              value={String(kiloGrams)}
              onChange={({ target }) =>
                setMerchandises((prev) => {
                  const _merchandises = [...prev];
                  _merchandises[index] = {
                    ..._merchandises[index],
                    kiloGrams: {
                      ..._merchandises[index].kiloGrams,
                      [baseKey]: Number(target.value),
                    },
                  };
                  return _merchandises;
                })
              }
            >
              <option value={"0"}>kl</option>
              <option
                disabled={!isAdmin && kilo === maxKilo && maxKiloGrams < 0.25}
                value={"0.25"}
                className={
                  kilo === maxKilo && maxKiloGrams < 0.25 ? `bg-red` : ""
                }
              >
                1/4 kl
              </option>
              <option
                value={"0.5"}
                disabled={!isAdmin && kilo === maxKilo && maxKiloGrams < 0.5}
                className={
                  kilo === maxKilo && maxKiloGrams < 0.5 ? `bg-red` : ""
                }
              >
                1/2 kl
              </option>
              <option
                value={"0.75"}
                disabled={!isAdmin && kilo === maxKilo && maxKiloGrams < 0.75}
                className={
                  kilo === maxKilo && maxKiloGrams < 0.75 ? `bg-red` : ""
                }
              >
                3/4 kl
              </option>
            </select>
          }
        />
      </MDBCol>
    </MDBRow>
  );
};

export default Kilo;
