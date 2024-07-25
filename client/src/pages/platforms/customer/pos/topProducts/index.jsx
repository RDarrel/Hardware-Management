import React, { useRef, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBRow,
} from "mdbreact";
import { ENDPOINT } from "../../../../../services/utilities";
import scrollBy from "../scrollBy";
import capitalize from "../../../../../services/utilities/capitalize";

const ITEMS_PER_PAGE = 6;

const TopProducts = ({ products, handleSelectProduct }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    scrollBy(
      scrollContainerRef,
      products,
      currentIndex,
      setCurrentIndex,
      direction
    );
  };

  const visibleProducts = products.slice(
    currentIndex,
    currentIndex + ITEMS_PER_PAGE
  );
  return (
    <div className="mt-3">
      <div className="d-flex justify-content-center ">
        <div className="w-75">
          <MDBCard className="boxshadow-none ">
            <MDBCardHeader className="bg-white text-danger" tag="h6">
              TOP PRODUCTS
            </MDBCardHeader>
            <MDBCardBody className="w-100">
              {currentIndex >= 1 && (
                <button
                  className="scroll-btn left-btn"
                  onClick={() => handleScroll("left")}
                >
                  &lt;
                </button>
              )}
              <div
                className="d-flex justify-content-center"
                style={{
                  overflowX: "none",
                  whiteSpace: "nowrap",
                  scrollBehavior: "smooth",
                }}
                ref={scrollContainerRef}
              >
                <MDBRow className=" w-100">
                  {visibleProducts.map((product, index) => (
                    <MDBCol lg="2" key={index} className="w-100">
                      <MDBCard
                        className="boxshadow-none w-100"
                        onClick={() => handleSelectProduct(product)}
                      >
                        <div className="product-badge">
                          <div className="badge-text">TOP</div>
                          <div className="badge-number">
                            {currentIndex + index + 1}
                          </div>
                        </div>
                        <MDBCardImage
                          className="img-fluid d-flex justify-content-center"
                          src={`${ENDPOINT}/assets/products/${product._id}/Cover Photo.jpg`}
                          style={{ height: "150px" }}
                        />
                      </MDBCard>
                      <h6
                        className="mb-4 text-center"
                        style={{
                          whiteSpace: "nowrap",
                          maxWidth: "800px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {capitalize.firstLetter(product.name)}
                      </h6>
                    </MDBCol>
                  ))}
                </MDBRow>
              </div>
              {currentIndex + ITEMS_PER_PAGE < products.length && (
                <button
                  className="scroll-btn right-btn"
                  onClick={() => handleScroll("right")}
                  disabled={currentIndex + ITEMS_PER_PAGE >= products.length}
                >
                  &gt;
                </button>
              )}
            </MDBCardBody>
          </MDBCard>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
