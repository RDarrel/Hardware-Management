import { MDBRow, MDBCol, MDBBtn, MDBIcon } from "mdbreact";
import React from "react";

const Kilo = ({ kilo, setKilo, kiloGrams, setKiloGrams }) => {
  return (
    <MDBRow className="mt-4 d-flex align-items-center">
      <MDBCol md="2">
        <h6>Kilo:</h6>
      </MDBCol>
      <MDBCol md="6" className="m-0 d-flex align-items-center">
        <input
          label="kilo"
          type="number"
          value={String(kilo)}
          onChange={({ target }) => {
            var kilo = Number(target.value);
            if (kilo < 1) kilo = 1;
            setKilo(kilo);
          }}
          className="form-control mr-2"
        />
        <select
          className="form-control"
          value={String(kiloGrams)}
          onChange={({ target }) => setKiloGrams(Number(target.value))}
        >
          <option value={"0"}>kl</option>
          <option value={"0.25"}>1/4 kl</option>
          <option value={"0.5"}>1/2 kl</option>
          <option value={"0.75"}>3/4 kl</option>
        </select>
      </MDBCol>
      <MDBCol>
        <MDBBtn color="danger" type="submit">
          <MDBIcon icon="shopping-cart" className="mr-2" /> ADD TO CART
        </MDBBtn>
      </MDBCol>
    </MDBRow>
  );
};

export default Kilo;
