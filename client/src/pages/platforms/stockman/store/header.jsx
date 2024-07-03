import React from "react";
import { MDBCol, MDBIcon, MDBRow } from "mdbreact";
// import { categories } from "../../../../services/fakeDb";
// import CustomSelect from "../../../../components/customSelect";

export const Header = () => {
  return (
    <MDBRow className="d-flex align-items-center m-0 p-0">
      <MDBCol md="2" className="d-flex justify-content-start">
        <h6 style={{ fontWeight: 500 }} className="mt-1">
          <MDBIcon icon="store" className="mr-2" /> Store
        </h6>
      </MDBCol>
      <MDBCol md="6" className="d-flex justify-content-center text-white ">
        {/* <CustomSelect
          className="m-0 p-0 w-75 text-white  customSelect"
          label={"All"}
          choices={categories}
          inputClassName="text-white"
        /> */}
      </MDBCol>
      <MDBCol className="m-0 p-0 d-flex justify-content-end " md="4">
        <form className="cashier-search">
          <input placeholder="Search..." autoCorrect="off" spellCheck={false} />
          <button type="submit">
            <MDBIcon icon={"search"} className="search-icon" />
          </button>
        </form>
      </MDBCol>
    </MDBRow>
  );
};
