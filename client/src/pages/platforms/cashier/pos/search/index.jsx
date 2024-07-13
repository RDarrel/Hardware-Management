import React, { useEffect, useRef } from "react";
import Categories from "../categories";
import "./search.css";
import { MDBCard, MDBCardBody, MDBBtn, MDBIcon } from "mdbreact";
import SuggestedProducts from "./suggestedProducts";
const Search = ({
  search,
  setSearch,
  handleSearch,
  setDidSearch,
  didSearch,
  setProducts,
  collections,
  handleAddOrder,
  setPage,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key.toUpperCase() === "F" &&
        document.activeElement !== inputRef.current
      ) {
        event.preventDefault(); // Prevent the default action of the "F" key
        setSearch(""); // Clear the search state
        inputRef.current.value = ""; // Clear the input field value directly
        inputRef.current.focus(); // Focus the input field
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [search, inputRef, setSearch]);
  return (
    <MDBCard className="mb-1">
      <MDBCardBody className="m-0 p-1">
        <div className="m-2  search-container">
          <form id="search-form" onSubmit={handleSearch}>
            <input
              className="form-control search-input"
              placeholder="Seach.."
              value={search}
              id="search"
              autoComplete="off"
              ref={inputRef}
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
              type={!didSearch ? "button" : "submit"}
              className="search-btn"
            >
              <MDBIcon icon={didSearch ? "times" : "search"} />
            </MDBBtn>
          </form>
          {search && (
            <SuggestedProducts
              products={collections}
              setDidSearch={setDidSearch}
              search={search}
              handleAddOrder={handleAddOrder}
              setSearch={setSearch}
            />
          )}
          <Categories
            setProducts={setProducts}
            collections={collections}
            setPage={setPage}
          />
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default Search;
