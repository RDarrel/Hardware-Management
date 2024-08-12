import React, { useEffect, useState } from "react";
import { MDBCol, MDBRow, MDBSpinner } from "mdbreact";
import Sidebar from "./sidebar";
import Sorting from "./sorting";
import Products from "./products";
import SearchNotFound from "../searchNotFound";
import { StorePagination } from "../../../../widgets/storePagination";

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
  isLoading,
}) => {
  const [itemsPerPage, setItemsPerPage] = useState(42);
  const [page, setPage] = useState(1);
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

  useEffect(() => {
    if (showSideBar) {
      setItemsPerPage(40);
    } else {
      setItemsPerPage(42);
    }
  }, [showSideBar]);

  useEffect(() => {
    setPage(1);
  }, [products]);
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

                {!isLoading && (
                  <Products
                    products={currentProducts}
                    handleSelectProduct={handleSelectProduct}
                    showSideBar={showSideBar || didSearch}
                  />
                )}
              </MDBRow>
              <MDBRow>
                <MDBCol md="12" className="d-flex justify-content-center">
                  {!isLoading ? (
                    <>
                      {currentProducts.length > 0 && (
                        <StorePagination
                          pageNumbers={pageNumbers}
                          handlePageChange={handlePageChange}
                          currentPage={page}
                        />
                      )}
                    </>
                  ) : (
                    <div className="mt-3">
                      <MDBSpinner />
                    </div>
                  )}
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </div>
      </div>
    </div>
  );
};

export default ProductsCard;
