import React from "react";
import { MDBCol, MDBRow } from "mdbreact";
import Sidebar from "./sidebar";
import Sorting from "./sorting";
import Products from "./products";

const ProductsCard = ({
  products,
  handleSelectProduct,
  setProducts,
  activeCategory,
  setActiveCategory,
  productsTemplate,
  setProductsTemplate,
  showSideBar = false,
}) => {
  return (
    <div className="mb-5">
      <div className="d-flex justify-content-center" style={{ padding: 0 }}>
        <div className="w-75">
          <MDBRow>
            {showSideBar && (
              <MDBCol md="2">
                <Sidebar
                  activeCategory={activeCategory}
                  setProducts={setProducts}
                  setProductsTemplate={setProductsTemplate}
                  productsTemplate={productsTemplate}
                  products={products}
                  setActiveCategory={setActiveCategory}
                />
              </MDBCol>
            )}
            <MDBCol md={showSideBar ? "10" : "12"}>
              <MDBRow
                className="custom-row"
                style={{
                  ...(showSideBar && {
                    marginLeft: "60px",
                    marginRight: "-5px",
                  }),
                }}
              >
                {showSideBar && (
                  <Sorting products={products} setProducts={setProducts} />
                )}
                <Products
                  products={products}
                  handleSelectProduct={handleSelectProduct}
                  showSideBar={showSideBar}
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
