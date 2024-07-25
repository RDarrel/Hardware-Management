import React from "react";
import { MDBCol, MDBRow } from "mdbreact";
import Sidebar from "./sidebar";
import Sorting from "./sorting";
import Products from "./products";
import SearchNotFound from "../searchNotFound";

const ProductsCard = ({
  products,
  handleSelectProduct,
  setProducts,
  activeCategory,
  setActiveCategory,
  productsTemplate,
  setProductsTemplate,
  showSideBar = false,
  isResetFiltering,
  setIsResetFiltering,
  setInSearchFilter,
  didSearch = false,
  searchValue,
  notFound,
  searchResults,
}) => {
  return (
    <div className="mb-5">
      <div className="d-flex justify-content-center">
        <div className="w-75">
          <MDBRow className={didSearch ? "mt-3" : ""}>
            {(showSideBar || didSearch) && (
              <MDBCol md="2">
                <Sidebar
                  activeCategory={activeCategory}
                  setProducts={setProducts}
                  setProductsTemplate={setProductsTemplate}
                  productsTemplate={productsTemplate}
                  products={products}
                  setActiveCategory={setActiveCategory}
                  isResetFiltering={isResetFiltering}
                  setIsResetFiltering={setIsResetFiltering}
                  setInSearchFilter={setInSearchFilter}
                  didSearch={didSearch}
                  searchResults={searchResults}
                  searchValue={searchValue}
                />
              </MDBCol>
            )}
            <MDBCol md={showSideBar || didSearch ? "10" : "12"}>
              <MDBRow
                className="custom-row"
                style={{
                  ...((showSideBar || didSearch) && {
                    marginLeft: "60px",
                  }),
                }}
              >
                {(showSideBar || didSearch) && products.length > 0 && (
                  <Sorting
                    products={products}
                    setProducts={setProducts}
                    productsTemplate={productsTemplate}
                    setProductsTemplate={setProductsTemplate}
                    isResetFiltering={isResetFiltering}
                    setIsResetFiltering={setIsResetFiltering}
                    setActiveCategory={setActiveCategory}
                    didSearch={didSearch}
                    searchValue={searchValue}
                  />
                )}
                {(showSideBar || didSearch) && products.length === 0 && (
                  <SearchNotFound setIsResetFiltering={setIsResetFiltering} />
                )}
                {notFound && (
                  <SearchNotFound
                    setIsResetFiltering={setIsResetFiltering}
                    notFound={notFound}
                  />
                )}

                <Products
                  products={products}
                  handleSelectProduct={handleSelectProduct}
                  showSideBar={showSideBar || didSearch}
                />
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </div>
      </div>
    </div>
  );
};

export default ProductsCard;
