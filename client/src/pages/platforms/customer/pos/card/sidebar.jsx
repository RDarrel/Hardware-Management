import React, { useEffect, useState } from "react";
import { MDBInput, MDBBtn, MDBIcon } from "mdbreact";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../../services/redux/slices/administrator/productManagement/category";
import capitalize from "../../../../../services/utilities/capitalize";
import sortBy from "../../../../../services/utilities/sorting";

const Sidebar = ({
  activeCategory,
  setProducts,
  setActiveCategory,
  productsTemplate,
  setProductsTemplate,
  isResetFiltering,
  setInSearchFilter,
  setIsResetFiltering,
  didSearch,
  products,
  searchResults = [],
  searchValue = "",
}) => {
  const { token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ category }) => category),
    [categories, setCategories] = useState([]),
    [copyOfOrigCategory, setCopyOfOrigCategory] = useState(""),
    [isValidPriceRange, setIsValidPriceRange] = useState(true),
    [minPrice, setMinPrice] = useState(""),
    [maxPrice, setMaxPrice] = useState(""),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    setInSearchFilter(true);
  }, [setInSearchFilter]);

  useEffect(() => {
    setCategories(collections);
  }, [collections]);

  useEffect(() => {
    if (isResetFiltering) {
      const defaultTemplate = [...productsTemplate].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateA - dateB;
      });

      setProductsTemplate(defaultTemplate);
      setMaxPrice("");
      setMinPrice("");
      setIsResetFiltering(false);

      if (!didSearch) {
        setActiveCategory("");
        setProducts(defaultTemplate);
      } else {
        setProducts(sortBy.relevance(searchResults, searchValue));
      }
    }
  }, [
    isResetFiltering,
    productsTemplate,
    setProductsTemplate,
    setProducts,
    setActiveCategory,
    setIsResetFiltering,
    searchResults,
    didSearch,
    searchValue,
  ]);

  useEffect(() => {
    if (activeCategory !== copyOfOrigCategory && !didSearch) {
      const _products = [...productsTemplate].filter(
        ({ category }) => category._id === activeCategory
      );
      setProducts(_products);
      setMaxPrice("");
      setMinPrice("");
      setCopyOfOrigCategory(activeCategory);
    }
  }, [
    activeCategory,
    setProducts,
    productsTemplate,
    copyOfOrigCategory,
    didSearch,
  ]);

  useEffect(() => {
    if (!activeCategory && minPrice === "" && maxPrice === "" && !didSearch) {
      setProducts(productsTemplate);
    }
  }, [
    activeCategory,
    setProducts,
    productsTemplate,
    minPrice,
    maxPrice,
    didSearch,
  ]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handlePriceChange = (e, type) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    if (type === "min") {
      setMinPrice(Number(numericValue));
    } else {
      setMaxPrice(Number(numericValue));
    }
  };

  const handleApplyClick = () => {
    if (
      maxPrice < minPrice ||
      isNaN(Number(minPrice)) ||
      isNaN(Number(maxPrice)) ||
      minPrice === "" ||
      maxPrice === ""
    ) {
      return setIsValidPriceRange(false);
    } else {
      const baseArray = didSearch
        ? products
        : activeCategory
        ? productsTemplate.filter(
            ({ category }) => category._id === activeCategory
          )
        : productsTemplate;

      const _products = baseArray.filter(
        ({ defaultSrp = 0 }) => defaultSrp >= minPrice && defaultSrp <= maxPrice
      );
      setProducts(_products);
      setIsValidPriceRange(true);
    }
  };

  return (
    <div className="sidebar">
      <div
        className={`sidebar-title ${
          didSearch ? "sidebar-title-borderNone" : ""
        }`}
      >
        <MDBIcon icon="filter" className="mr-2" /> SEARCH FILTER
      </div>

      {!didSearch && (
        <>
          <div className="sidebar-category-title">By Category</div>
          {categories.map((category, index) => (
            <div
              key={index}
              className={`sidebar-category ${
                activeCategory === category._id ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {activeCategory === category._id && (
                <span className="arrow">►</span>
              )}
              <span className="text-nowrap">
                {capitalize.firstLetter(category.name)}
              </span>
            </div>
          ))}
        </>
      )}
      <div className="sidebar-price-range">
        <div className="price-range-title">Price Range</div>
        <div className="price-range-inputs">
          <MDBInput
            label="₱ MIN"
            value={minPrice}
            onChange={(e) => handlePriceChange(e, "min")}
          />
          <span className="price-range-separator">—</span>
          <MDBInput
            label="₱ MAX"
            value={maxPrice}
            onChange={(e) => handlePriceChange(e, "max")}
          />
        </div>
        {!isValidPriceRange && (
          <div className="warning-message-price-range">
            <small>Please input valid price range</small>
          </div>
        )}
        <MDBBtn
          color="danger"
          onClick={handleApplyClick}
          block
          size="sm"
          className="apply-btn"
        >
          APPLY
        </MDBBtn>
      </div>
      <hr />
      <MDBBtn
        block
        size="sm"
        color="danger"
        className="mt-3"
        onClick={() => setIsResetFiltering(true)}
      >
        Clear All
      </MDBBtn>
    </div>
  );
};

export default Sidebar;
