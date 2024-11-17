import React from "react";
import { MDBRow, MDBCol, MDBIcon, MDBBtn } from "mdbreact";

export const Search = ({
  title,
  disable,
  toggleCreate,
  icon = "",
  collections = [],
  didSearch = false,
  search,
  showExpiredProducts = false,
  expiredProducts = [],
  handleExport = () => {},
  toggleExpiredProducts = () => {},
  handleSearch = () => {},
  setContainer = () => {},
  setDidSearch = () => {},
  setSearch = () => {},
}) => {
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

      <MDBCol className="d-flex justify-content-end align-items-center">
        <div className="cashier-search-cotaniner ">
          <form className="cashier-search" onSubmit={handleSearch}>
            <input
              placeholder="Search..."
              autoCorrect="off"
              spellCheck={false}
              required={didSearch ? false : true}
              value={search}
              onChange={({ target }) => setSearch(target.value.toUpperCase())}
            />
            <button
              onClick={() => {
                if (!didSearch) return;
                setDidSearch(false);
                setSearch("");
                setContainer(collections);
              }}
              type={didSearch ? "button" : "submit"}
            >
              <MDBIcon
                icon={didSearch ? "times" : "search"}
                className="search-icon"
              />
            </button>
          </form>
        </div>
        {showExpiredProducts && (
          <>
            <MDBBtn
              size="sm"
              rounded
              color="info"
              title="Expired Products  List"
              onClick={toggleExpiredProducts}
            >
              <MDBIcon icon="clipboard-list" size="2x" />
            </MDBBtn>
            <span
              className="counter"
              style={{ marginBottom: "-20px", marginRight: "-5px" }}
            >
              {expiredProducts.length}
            </span>

            <MDBBtn
              size="sm"
              rounded
              color="primary"
              className="ml-3"
              title="Export to excel"
              onClick={handleExport}
            >
              <MDBIcon icon="file-excel" size="2x" />
            </MDBBtn>
          </>
        )}
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
