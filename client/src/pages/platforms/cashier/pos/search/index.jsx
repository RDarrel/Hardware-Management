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
  products,
  handleAddOrder,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key.toUpperCase()) {
        case "F":
          event.preventDefault();
          break;
        default:
          return; // Allow default behavior for other keys
      }

      switch (event.key.toUpperCase()) {
        case "F":
          inputRef.current.focus();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <MDBCard className="mb-1">
      <MDBCardBody className="m-0 p-1">
        <div className="m-2  search-container">
          <form id="search-form" onSubmit={handleSearch}>
            <input
              className="form-control search-input"
              placeholder="Seach.."
              required
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
              products={products}
              setDidSearch={setDidSearch}
              search={search}
              handleAddOrder={handleAddOrder}
              setSearch={setSearch}
            />
          )}
          <Categories />
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default Search;
