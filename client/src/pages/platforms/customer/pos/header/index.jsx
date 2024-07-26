import React, { useEffect, useRef, useState } from "react";
import "./cart-btn.css";
import {
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBCard,
  MDBCardBody,
  MDBBtn,
} from "mdbreact";
import Profile from "../profile";
import capitalize from "../../../../../services/utilities/capitalize";
import Cart from "./cart";
import sortBy from "../../../../../services/utilities/sorting";

export const Header = ({
  cart,
  setIsShowCart,
  activeCategory,
  inSearchFilter,
  setDidSearch,
  setHasMovingUp,
  setSearchValue,
  setActiveCategory,
  setInSearchFilter,
  setProducts,
  productsTemplate,
  setSelected,
  setNotFound,
  setShowSideBar,
  setSearchResults,
}) => {
  const [id, setID] = useState(-1),
    [baseSearch, setBaseSearch] = useState(""),
    [activeSearch, setActiveSearch] = useState("default"),
    [isOpen, setIsOpen] = useState(false),
    [selectedOption, setSelectedOption] = useState(""),
    selectRef = useRef(null),
    options = [
      {
        text: `In ${capitalize?.firstLetter(activeCategory?.name)}`,
        value: activeCategory._id,
      },
      { text: "In Liberty", value: "default" },
    ];

  useEffect(() => {
    if (activeCategory?._id && inSearchFilter) {
      setActiveSearch(activeCategory._id);
    } else {
      setActiveSearch("default");
    }
  }, [inSearchFilter, activeCategory]);

  const search = (array) => {
    const searched = [...array].filter(({ name }) =>
      name.toUpperCase().includes(baseSearch.toUpperCase())
    );

    if (searched?.length === 0 || !searched) {
      setDidSearch(false);
      setShowSideBar(false);
      setNotFound(true);
      setProducts(productsTemplate);
      setInSearchFilter(false);
      setActiveCategory({});
      setSelected({});
      setActiveSearch("default");
    } else {
      setDidSearch(true);
      setNotFound(false);
      setProducts(sortBy.relevance(searched, baseSearch));
      setSearchResults(sortBy.relevance(searched, baseSearch));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (activeSearch === "default") {
      search(productsTemplate);
      setInSearchFilter(false);
      setActiveCategory({});
      setSelected({});
    } else {
      const filteredByCategory = [...productsTemplate].filter(
        ({ category }) => category._id === activeCategory._id
      );

      search(filteredByCategory);
    }
    setSearchValue(baseSearch);
    setBaseSearch("");
    setHasMovingUp(true);
  };

  useEffect(() => {
    if (activeCategory._id) {
      setSelectedOption(`In ${capitalize.firstLetter(activeCategory.name)}`);
    }
  }, [activeCategory]);

  const handleSelect = (option) => {
    setActiveSearch(option.value);
    setSelectedOption(option.text);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <MDBCard style={{ position: "sticky", top: "0", zIndex: "1000" }}>
      <MDBCardBody className="m-0 p-0 " style={{ backgroundColor: "#F6412D" }}>
        <Profile />

        <MDBRow className="d-flex align-items-center justify-content-center   mb-1">
          <MDBCol md="9">
            <MDBRow className="d-flex align-items-center justify-content-center">
              <MDBCol md="12" className="d-flex align-items-center">
                <MDBIcon
                  icon="shopping-bag"
                  size="3x"
                  style={{ color: "white" }}
                  className="mr-2 bag-icon"
                />
                <h5 className="mt-2 text-white text-nowrap">
                  LIBERTY HARDWARE
                </h5>

                <div className="input-container ml-3">
                  <form onSubmit={handleSearch}>
                    <input
                      className="form-control input"
                      style={{ height: "50px" }}
                      value={baseSearch}
                      required
                      onChange={({ target }) => setBaseSearch(target.value)}
                      placeholder={`Search ${
                        inSearchFilter &&
                        activeCategory._id &&
                        activeSearch !== "all"
                          ? `In ${capitalize.firstLetter(activeCategory.name)}`
                          : ""
                      }`}
                    />
                    {inSearchFilter && activeCategory._id && (
                      <div className="custom-select-wrapper" ref={selectRef}>
                        <div
                          className="custom-select"
                          onClick={() => setIsOpen(!isOpen)}
                        >
                          <span className="active-search">
                            {selectedOption}
                          </span>
                          <div className="custom-arrow">▼</div>
                        </div>
                        {isOpen && (
                          <div className="custom-options">
                            {options.map((option, index) => (
                              <div
                                key={index}
                                className={`custom-option ${
                                  option === selectedOption ? "selected" : ""
                                }`}
                                onClick={() => handleSelect(option)}
                              >
                                <span className="option-text">
                                  {option.text}
                                </span>
                                {option.value === activeSearch && (
                                  <span className="checkmark">✔</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <MDBBtn
                      size="sm"
                      color="danger"
                      className="btn-search"
                      type="submit"
                    >
                      <MDBIcon icon="search" />
                    </MDBBtn>
                  </form>
                </div>
                <Cart
                  id={id}
                  setIsShowCart={setIsShowCart}
                  cart={cart}
                  setID={setID}
                />
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBCardBody>
    </MDBCard>
  );
};
