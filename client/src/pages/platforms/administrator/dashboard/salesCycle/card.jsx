import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCol,
  MDBProgress,
} from "mdbreact";
import CustomSelect from "../../../../../components/customSelect";
import formattedTotal from "../../../../../services/utilities/forattedTotal";

const Card = ({
  params = {},
  array = [],
  setValue = () => {},
  value = "",
  lastTitle = "Worse than last year",
  label = "",
  color = "info",
}) => {
  console.log(params);
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
          <div className="d-flex justify-content-between">
            <h6>Gross Sales:</h6>
            <h6>
              <strong style={{ marginLeft: "26.2px" }}>
                ₱{formattedTotal(params.totalSales || 0)}
              </strong>
            </h6>
          </div>
          <div className="d-flex justify-content-between">
            <h6>Net Sales:</h6>
            <h6>
              <strong>₱{formattedTotal(params.totalNetSales || 0)}</strong>
            </h6>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <h6>Income:</h6>
            <h6>
              <strong>&nbsp; ₱{formattedTotal(params.totalIncome || 0)}</strong>
            </h6>
          </div>

          <MDBProgress
            value={120}
            // value={yearlyDifferenceSale}
            barClassName="grey darken-2"
          />
          <p className="font-small grey-text text-nowrap">
            {lastTitle}
            {/* {currentYearIsBetter ? "Better" : "Worse"} than last year (
              {yearlyDifferenceSale}%) */}
          </p>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default Card;
