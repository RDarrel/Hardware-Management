import React, { useState } from "react";
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage } from "mdbreact";
import { ENDPOINT } from "../../../../../services/utilities";
import { Pagination } from "./pagination";

export const Products = ({
  products,
  setShowVariant,
  setSelectedProduct,
  handleAddOrder,
  page,
  setPage,
}) => {
  const [itemsPerPage] = useState(12); // Adjust the number of items per page as needed

  const indexOfLastProduct = page * itemsPerPage;
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
    setPage(pageNumber);
  };

  return (
    <>
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
              className="mt-1 cursor-pointer h-25"
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
                  style={{ height: "90px", width: "100px" }}
                />
                <MDBCardBody className="d-flex flex-column justify-content-between ">
                  <h6 className="text-truncate font-weight-bolder ">
                    {product.name.toUpperCase()}
                  </h6>
                  <p className="text-truncate text-danger m-0">₱ {showPrice}</p>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          );
        })}
      </MDBRow>
      <Pagination
        currentPage={page}
        pageNumbers={pageNumbers}
        handlePageChange={handlePageChange}
      />
    </>
  );
};
