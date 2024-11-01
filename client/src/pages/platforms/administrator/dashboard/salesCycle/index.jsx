import { MDBRow } from "mdbreact";
import React from "react";
import Monthly from "./monthly";
import Quarterly from "./quarterly";
import Annually from "./annually";

const SalesCycles = ({ sales }) => {
  return (
    <MDBRow className="mb-5">
      <Monthly sales={sales} />
      <Quarterly sales={sales} />
      <Annually sales={sales} />
    </MDBRow>
  );
};

export default SalesCycles;
