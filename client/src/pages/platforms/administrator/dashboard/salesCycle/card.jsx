import React from "react";
import { MDBCard, MDBCardBody, MDBCardHeader, MDBCol } from "mdbreact";
import CustomSelect from "../../../../../components/customSelect";
import formattedTotal from "../../../../../services/utilities/forattedTotal";

const Card = ({
  params = {},
  array = [],
  setValue = () => {},
  value = "",
  label = "",
  color = "info",
}) => {
  return (
    <MDBCol md="4">
      <MDBCard>
        <MDBCardHeader color={`${color}-color`}>{params.title}</MDBCardHeader>
        <MDBCardBody>
          <CustomSelect
            choices={array}
            preValue={value}
            _key={value}
            onChange={(v) => setValue(v)}
            label={label}
            values="value"
            texts="text"
          />
          <h6>
            Sales:
            <strong style={{ marginLeft: "26.2px" }}>
              ₱{formattedTotal(params.totalSales || 0)}
            </strong>
          </h6>
          <h6>
            Income:
            <strong> &nbsp; ₱{formattedTotal(params.totalIncome || 0)}</strong>
          </h6>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default Card;
