import React from "react";
import { MDBRow, MDBCol, MDBIcon, MDBBtn } from "mdbreact";

export const Search = ({ title, disable, toggleCreate, icon = "" }) => {
  const { create = false } = disable || {};
  return (
    <MDBRow className="mt-0  mb-2 d-flex align-items-center">
      <MDBCol md="4" className="d-flex align-items-center">
        <MDBIcon
          className="ml-2"
          size="2x"
          style={{ color: "blue" }}
          icon={icon}
        />
        <h4 style={{ fontWeight: 400 }} className="mt-2 ml-3">
          {title}
        </h4>
      </MDBCol>
      <MDBCol className="d-flex justify-content-end align-items-center" md="8">
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
