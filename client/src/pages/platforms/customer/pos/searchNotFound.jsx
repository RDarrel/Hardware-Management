import { MDBBtn } from "mdbreact";
import React from "react";

const SearchNotFound = ({ setIsResetFiltering, notFound }) => {
  return (
    <div className={`w-100  ${notFound ? "mb-4 mt-3" : "mt-5"}`}>
      <div className="d-flex justify-content-center ">
        <img
          alt="Not found"
          className="img-notFound"
          src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/categoryfe/a60759ad1dabe909c46a.png"
        />
      </div>
      <h5 className={`${!notFound ? "grey-text" : ""} text-center`}>
        {!notFound
          ? "  Uh oh! We couldn't find any listing. Try turning off some filters?"
          : "No results Found"}
      </h5>
      <h5 className="grey-text text-center">
        {!notFound ? "Or" : "Try different or more general keywords"}
      </h5>
      {!notFound && (
        <div className="d-flex justify-content-center mt-2">
          <MDBBtn color="danger" onClick={() => setIsResetFiltering(true)}>
            Reset Filters
          </MDBBtn>
        </div>
      )}
    </div>
  );
};

export default SearchNotFound;
