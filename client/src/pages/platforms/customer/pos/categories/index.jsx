import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBRow,
} from "mdbreact";
import React, { useEffect, useRef, useState } from "react";
import { ENDPOINT } from "../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../../services/redux/slices/administrator/productManagement/category";
import sortBy from "../../../../../services/utilities/sorting";
import scrollBy from "../scrollBy";
import capitalize from "../../../../../services/utilities/capitalize";
const ITEMS_PER_PAGE = 6;

const Categories = ({ products, handleSelectCategory }) => {
  const { token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ category }) => category),
    [categories, setCategories] = useState([]),
    disptach = useDispatch();

  useEffect(() => {
    disptach(BROWSE({ token }));
  }, [disptach, token]);

  useEffect(() => {
    sortBy.categories({
      categories: collections,
      setCategories,
      products,
    });
  }, [collections, products]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    scrollBy(
      scrollContainerRef,
      categories,
      currentIndex,
      setCurrentIndex,
      direction
    );
  };

  const visibleProducts = categories.slice(
    currentIndex,
    currentIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-center ">
        <div className="w-75">
          <MDBCard className="boxshadow-none ">
            <MDBCardHeader className="bg-white grey-text" tag="h6">
              CATEGORIES
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
                  {visibleProducts.map((category, index) => {
                    const { products } = category;
                    const product = products[2] || {};
                    return (
                      <MDBCol lg="2" key={index} className="w-100">
                        <MDBCard
                          className="boxshadow-none w-100"
                          onClick={() => handleSelectCategory(category)}
                        >
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
                          {capitalize.firstLetter(category.name)}
                        </h6>
                      </MDBCol>
                    );
                  })}
                </MDBRow>
              </div>
              {!currentIndex + ITEMS_PER_PAGE >= categories.length && (
                <button
                  className="scroll-btn right-btn"
                  onClick={() => handleScroll("right")}
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

export default Categories;
