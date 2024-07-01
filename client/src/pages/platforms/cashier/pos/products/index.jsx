import React, { useRef, useState } from "react";
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage } from "mdbreact";
import { ENDPOINT } from "../../../../../services/utilities";
import { Pagination } from "./pagination";

export const Products = ({
  products,
  setShowVariant,
  setSelectedProduct,
  handleAddOrder,
}) => {
  const [currentPage, setCurrentPage] = useState(1),
    [itemsPerPage] = useState(12); // Adjust the number of items per page as needed

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const inputRef = useRef(null);

  console.log(inputRef.current?.offsetHeight);
  return (
    <>
      <div className="product-container" ref={inputRef}>
        <MDBRow>
          {currentProducts.map((product, index) => {
            const { variations = [], hasVariant, has2Variant, srp } = product;

            const showPrice = hasVariant
              ? has2Variant
                ? variations[0]?.options[0].prices[0]?.srp
                : variations[0]?.options[0].srp
              : srp;
            return (
              <MDBCol
                key={index}
                md="3"
                className="mt-1 cursor-pointer "
                onClick={() => {
                  if (product.hasVariant) {
                    setShowVariant(true);
                    setSelectedProduct(product);
                  } else {
                    handleAddOrder(product);
                  }
                }}
              >
                <MDBCard>
                  <MDBCardImage
                    top
                    waves
                    className=" mx-auto "
                    src={`${ENDPOINT}/assets/products/${product._id}/Cover Photo.jpg`}
                    style={{ height: "100px", width: "100px" }}
                  />
                  <MDBCardBody className="d-flex flex-column justify-content-between">
                    <h6 className="text-truncate font-weight-bold">
                      {product.name}
                    </h6>
                    <p className="text-truncate text-danger">₱ {showPrice}</p>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            );
          })}
        </MDBRow>
        <Pagination
          currentPage={currentPage}
          pageNumbers={pageNumbers}
          handlePageChange={handlePageChange}
        />
      </div>
    </>
  );
};
