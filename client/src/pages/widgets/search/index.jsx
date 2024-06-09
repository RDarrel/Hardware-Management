import React from "react";
import { MDBRow, MDBCol, MDBIcon, MDBBtn } from "mdbreact";

export const Search = ({ title, disable, toggleCreate }) => {
  const { create = false } = disable || {};
  return (
    <MDBRow className="mt-0  mb-2 d-flex align-items-center">
      <MDBCol md="2">
        <h4 className="ml-4" style={{ fontWeight: 400 }}>
          {title}
        </h4>
      </MDBCol>
      <MDBCol className="d-flex justify-content-end align-items-center" md="10">
        <div className="cashier-search-cotaniner ">
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
        {!create && (
          <MDBBtn
            size="sm"
            color="primary"
            floating
            rounded
            onClick={toggleCreate}
          >
            <MDBIcon icon="plus" />
          </MDBBtn>
        )}
      </MDBCol>
    </MDBRow>
  );
};
