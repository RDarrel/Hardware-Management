import React from "react";
import {
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { MAXPAGE } from "../../services/redux/slices/auth";

export default function TableRowCount() {
  const { maxPage } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const handleChange = option => {
    const item = option[0];
    dispatch(MAXPAGE(Number(item)));
  };
  return (
    <MDBSelect
      getValue={handleChange}
      className="colorful-select w-10 float-left dropdown-primary mt-2 hidden-md-down"
    >
      <MDBSelectInput selected={`${maxPage} rows`} />
      <MDBSelectOptions>
        <MDBSelectOption value="5">5 rows</MDBSelectOption>
        <MDBSelectOption value="25">25 rows</MDBSelectOption>
        <MDBSelectOption value="50">50 rows</MDBSelectOption>
        <MDBSelectOption value="100">100 rows</MDBSelectOption>
      </MDBSelectOptions>
    </MDBSelect>
  );
}
