import React from "react";
import { MDBRow, MDBCol, MDBIcon, MDBBtn } from "mdbreact";
import { categories } from "../../../../services/fakeDb";

export const Header = ({ setShow, setIsViewProductInformation }) => {
  return (
    <MDBRow className="align-items-center">
      <MDBCol md="2">
        <MDBBtn
          color="primary"
          onClick={() => setIsViewProductInformation(true)}
        >
          <MDBIcon icon="plus" />
        </MDBBtn>
      </MDBCol>
      <MDBCol>
        <select
          className="form-control"
          style={{ height: 50, borderRadius: 20 }}
        >
          {categories.map((categorie, index) => (
            <option value={categorie} key={index}>
              {categorie}
            </option>
          ))}
        </select>
      </MDBCol>
      <MDBCol className="d-flex justify-content-end" md="4">
        <div className="cashier-search-cotaniner">
          <form className="cashier-search">
            <input
              placeholder="Search..."
              autoCorrect="off"
              spellCheck={false}
            />
            <button type="submit">
              <MDBIcon icon={"search"} className="search-icon" />
            </button>
          </form>
        </div>
      </MDBCol>
    </MDBRow>
  );
};
