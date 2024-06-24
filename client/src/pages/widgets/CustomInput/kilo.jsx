import { MDBRow, MDBCol, MDBInputGroup } from "mdbreact";
import React from "react";

const Kilo = ({
  kilo,
  setKilo,
  kiloGrams,
  setKiloGrams,
  setMerchandises,
  index,
}) => {
  return (
    <MDBRow className="mt-4 d-flex align-items-center">
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
            setMerchandises((prev) => {
              const _merchandises = [...prev];
              _merchandises[index] = {
                ..._merchandises[index],
                kilo: { ..._merchandises[index].kilo, approved: kilo },
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
                      approved: target.value,
                    },
                  };
                  return _merchandises;
                })
              }
            >
              <option value={"0"}>kl</option>
              <option value={"0.25"}>1/4 kl</option>
              <option value={"0.5"}>1/2 kl</option>
              <option value={"0.75"}>3/4 kl</option>
            </select>
          }
        />
      </MDBCol>
    </MDBRow>
  );
};

export default Kilo;
