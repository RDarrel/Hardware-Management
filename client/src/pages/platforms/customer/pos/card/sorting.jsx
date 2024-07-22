import { MDBBtn, MDBCard, MDBCardBody, MDBCol } from "mdbreact";
import React, { useState } from "react";

const Sorting = ({ products, setProducts }) => {
  const [isLatest, setIsLates] = useState(true),
    [sortBy, setSortBy] = useState("all");

  const handleChangeIsLates = (_isLates) => {
    const sorted = [...products].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return _isLates ? dateB - dateA : b.sold - a.sold;
    });

    setIsLates(_isLates);
    setProducts(sorted);
  };

  const handleChangeSortBy = (_sortBy) => {
    if (_sortBy !== "all") {
    } else {
    }
  };
  return (
    <MDBCol md="12" className="col-sorting">
      <MDBCard className="boxshadow-none card-sorting">
        <MDBCardBody className="m-0 p-2">
          <div className="d-flex align-items-center">
            <h6 className="mt-2 mr-3">Sort By</h6>
            <MDBBtn
              size="sm"
              color={isLatest ? "danger" : "white"}
              onClick={() => handleChangeIsLates(true)}
            >
              Latest
            </MDBBtn>
            <MDBBtn
              size="sm"
              color={!isLatest ? "danger" : "white"}
              onClick={() => handleChangeIsLates(false)}
            >
              Top Sales
            </MDBBtn>
            <select
              className="form-control w-25 bg-white ml-2"
              value={sortBy}
              onChange={({ target }) => handleChangeSortBy(target.value)}
            >
              <option value={"all"}>Price </option>
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
