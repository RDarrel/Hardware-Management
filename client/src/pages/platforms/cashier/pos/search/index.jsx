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
  isLoading = false,
  isCheckOut = false,
  showSuggested = true,
  setShowSuggested = () => {},
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
        document.activeElement !== inputRef.current &&
        !isCheckOut
      ) {
        event.preventDefault();
        setSearch("");
        inputRef.current.value = "";
        inputRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [search, inputRef, setSearch, isCheckOut]);
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
              readOnly={isLoading}
              onChange={({ target }) => {
                const searchValue = target.value;

                if (searchValue !== search) {
                  setShowSuggested(true);
                }
                setSearch(target.value);
              }}
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
          {search && showSuggested && (
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
