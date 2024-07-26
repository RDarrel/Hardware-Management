import React, { useEffect, useState } from "react";
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBIcon } from "mdbreact";
import sortBy from "../../../../../services/utilities/sorting";

const Sorting = ({
  products,
  setProducts,
  productsTemplate,
  setProductsTemplate,
  isResetFiltering,
  didSearch,
  searchValue,
}) => {
  const [isLatest, setIsLates] = useState(null),
    [sortByPrice, setSortByPrice] = useState("");

  useEffect(() => {
    if (isResetFiltering) {
      setIsLates(null);
      setSortByPrice("");
    }
  }, [isResetFiltering]);

  useEffect(() => {
    if (didSearch) {
      setIsLates(null);
    }
  }, [didSearch]);

  const handleSort = (_isLates, array) => {
    return _isLates === null
      ? sortBy.relevance(array, searchValue)
      : [...array].sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return _isLates ? dateB - dateA : b.sold - a.sold;
        });
  };

  const handleChangeIsLates = (_isLates) => {
    const sorted = handleSort(_isLates, products);
    const sortedTemplate = handleSort(_isLates, productsTemplate);
    setProductsTemplate(sortedTemplate);
    setIsLates(_isLates);
    setProducts(sorted);
    setSortByPrice("");
  };

  const handlesortByPricePrice = (_sortByPrice, array) => {
    return [...array].sort((a, b) => {
      return _sortByPrice === "low"
        ? a.defaultSrp - b.defaultSrp
        : b.defaultSrp - a.defaultSrp;
    });
  };

  const handleChangesortByPrice = (_sortByPrice) => {
    const _products = handlesortByPricePrice(_sortByPrice, products);
    const _templateProducts = handlesortByPricePrice(
      _sortByPrice,
      productsTemplate
    );
    setProductsTemplate(_templateProducts);
    setSortByPrice(_sortByPrice);
    setProducts(_products);
  };

  return (
    <MDBCol md="12" className="col-sorting ">
      {didSearch && (
        <div className="d-flex mb-3 mt-2">
          <MDBIcon
            far
            icon="lightbulb"
            size="2x"
            style={{ color: "red" }}
            className="mr-2"
          />
          <h5 className="mt-1">Search result for </h5>
          <h5 className="text-danger ml-2 mt-1">'{searchValue}'</h5>
        </div>
      )}
      <MDBCard className="boxshadow-none card-sorting">
        <MDBCardBody className="m-0 p-2">
          <div className="d-flex align-items-center">
            <h6 className="mt-2 mr-3">Sort By</h6>
            {didSearch && (
              <MDBBtn
                size="sm"
                color={isLatest === null ? "danger" : "white"}
                onClick={() => handleChangeIsLates(null)}
              >
                Relevance
              </MDBBtn>
            )}
            <MDBBtn
              size="sm"
              color={isLatest && isLatest !== null ? "danger" : "white"}
              onClick={() => handleChangeIsLates(true)}
            >
              Latest
            </MDBBtn>
            <MDBBtn
              size="sm"
              color={!isLatest && isLatest !== null ? "danger" : "white"}
              onClick={() => handleChangeIsLates(false)}
            >
              Top Sales
            </MDBBtn>
            <select
              className="form-control w-25 bg-white ml-2"
              value={sortByPrice}
              onChange={({ target }) => handleChangesortByPrice(target.value)}
            >
              {!sortByPrice && <option value={""}>Price </option>}
              <option value={"low"}> Price: Low to High </option>
              <option value={"high"}>Price: High to Low </option>
            </select>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default Sorting;
