import { MDBRow, MDBCol, MDBBtn, MDBIcon, MDBInputGroup } from "mdbreact";
import React from "react";

const Kilo = ({ kilo, setKilo, kiloGrams, setKiloGrams, handleSubmit }) => {
  return (
    <MDBRow className="mt-1 d-flex align-items-center">
      <MDBCol md="2">
        <h6>Kilo:</h6>
      </MDBCol>
      <MDBCol md="4" className="m-0 d-flex align-items-center">
        <MDBInputGroup
          type="number"
          value={String(kilo)}
          onChange={({ target }) => {
            let filteredKilo = target.value.replace(/[^0-9]/g, "");
            var kilo = Number(filteredKilo);
            if (kilo < 0) kilo = 0;
            setKilo(kilo);
          }}
          className="text-center border border-light"
          append={
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
          }
        />
      </MDBCol>
      <MDBCol md="6" className="d-flex align-items-center">
        <MDBBtn
          color="primary"
          type="submit"
          size="md"
          className="text-nowrap"
          outline
          onClick={handleSubmit}
        >
          <MDBIcon icon="shopping-cart" className="mr-1" /> ADD TO CART
        </MDBBtn>
        <MDBBtn
          color="danger"
          type="button"
          size="md"
          onClick={() => handleSubmit(false)}
        >
          Request Now
        </MDBBtn>
      </MDBCol>
    </MDBRow>
  );
};

export default Kilo;
