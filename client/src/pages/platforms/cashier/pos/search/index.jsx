import React from "react";
import Categories from "../categories";
import { MDBCard, MDBCardBody, MDBBtn, MDBIcon } from "mdbreact";
const Search = ({
  search,
  setSearch,
  handleSearch,
  setDidSearch,
  didSearch,
  setProducts,
  collections,
}) => {
  return (
    <MDBCard className="mb-3">
      <MDBCardBody className="m-0 p-1">
        <div className="m-2  search-container">
          <form id="search-form" onSubmit={handleSearch}>
            <input
              className="form-control search-input"
              placeholder="Seach.."
              required
              value={search}
              onChange={({ target }) => setSearch(target.value)}
              name="search"
            />
            <MDBBtn
              size="sm"
              color="primary"
              rounded
              onClick={() => {
                if (!didSearch) return;
                setDidSearch(false);
                setSearch("");
                setProducts(collections);
              }}
              type={didSearch ? "button" : "submit"}
              className="search-btn"
            >
              <MDBIcon icon={didSearch ? "times" : "search"} />
            </MDBBtn>
          </form>
          <Categories />
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default Search;
