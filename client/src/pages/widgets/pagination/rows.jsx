import React from "react";
import {
  MDBSelectOptions,
  MDBSelectOption,
  MDBSelect,
  MDBSelectInput,
} from "mdbreact";

function Rows({ setMax, max }) {
  return (
    <div className="ml-2 ">
      <MDBSelect
        className="colorful-select float-left dropdown-primary hidden-md-down"
        style={{ position: "absolute" }}
        value={max}
        getValue={(e) => setMax(e[0])}
      >
        <MDBSelectInput selected="Rows number" />
        <MDBSelectOptions>
          <MDBSelectOption disabled>Rows number</MDBSelectOption>
          <MDBSelectOption value={5}>5 rows</MDBSelectOption>
          <MDBSelectOption value={10}>10 rows</MDBSelectOption>
          <MDBSelectOption value={25}>25 rows</MDBSelectOption>
          <MDBSelectOption value={50}>50 rows</MDBSelectOption>
          <MDBSelectOption value={100}>100 rows</MDBSelectOption>
        </MDBSelectOptions>
      </MDBSelect>
    </div>
  );
}

export default Rows;
