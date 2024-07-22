import React, { useEffect, useState } from "react";
import { MDBInput, MDBBtn } from "mdbreact";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../../services/redux/slices/administrator/productManagement/category";
import capitalize from "../../../../../services/utilities/capitalize";

const Sidebar = ({
  activeCategory,
  setProducts,
  setActiveCategory,
  products,
  productsTemplate,
  setProductsTemplate,
}) => {
  const { token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ category }) => category),
    [categories, setCategories] = useState([]),
    [isValidPriceRange, setIsValidPriceRange] = useState(true),
    [minPrice, setMinPrice] = useState(""),
    [maxPrice, setMaxPrice] = useState(""),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    setCategories(collections);
  }, [collections]);

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
    // Implement your price range filter logic here
    if (maxPrice < minPrice) {
      setIsValidPriceRange(false);
    }
    const _products = products.filter(
      ({ defaultSrp = 0 }) => defaultSrp >= minPrice && defaultSrp <= maxPrice
    );
    setProducts(_products);

    console.log("Price Range:", { min: minPrice, max: maxPrice });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-title">All Categories</div>
      {categories.map((category, index) => (
        <div
          key={index}
          className={`sidebar-category ${
            activeCategory === category._id ? "active" : ""
          }`}
          onClick={() => handleCategoryClick(category)}
        >
          {activeCategory === category._id && <span className="arrow">►</span>}
          <span className="text-nowrap">
            {capitalize.firstLetter(category.name)}
          </span>
        </div>
      ))}
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
      <MDBBtn block size="sm" color="danger" className="mt-3">
        Clear All
      </MDBBtn>
    </div>
  );
};

export default Sidebar;
