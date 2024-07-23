import React, { useState } from "react";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCol } from "mdbreact";
import { ENDPOINT } from "../../../../../services/utilities";
const Products = ({ products = [], showSideBar, handleSelectProduct }) => {
  const [didHoverID, setDidHoverID] = useState(-1);

  return (
    <>
      {products.map((product, index) => {
        const { defaultSrp = 0 } = product;

        return (
          <MDBCol
            md="3"
            className={`mt-2 custom-col${showSideBar ? "-withSidebar" : ""}`}
            key={index}
            style={{ paddingLeft: "5px", paddingRight: "5px" }}
          >
            <MDBCard
              onClick={() => {
                handleSelectProduct(product);
              }}
              onMouseEnter={() => setDidHoverID(index)}
              onMouseLeave={() => setDidHoverID(-1)}
              style={{
                boxShadow: "none",
                border: `1px solid ${
                  didHoverID === index ? "red" : "lightgray"
                }`,
                height: "250px",
                transform: didHoverID === index ? "translateY(-3px)" : "",
                transition: "transform 0.3s ease-in-out",
              }}
              className={`h-100 cursor-pointer product-card transition-all z-depth-${
                didHoverID === index ? "1" : "0"
              }`}
            >
              <div className="d-flex justify-content-center">
                <MDBCardImage
                  top
                  waves
                  className="img-fluid d-flex justify-content-center"
                  src={`${ENDPOINT}/assets/products/${product._id}/Cover Photo.jpg`}
                  style={{ height: "160px", width: "70%" }}
                />
              </div>
              <MDBCardBody>
                <h6
                  className="mb-4"
                  style={{
                    whiteSpace: "nowrap",
                    maxWidth: "800px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {product.name}
                </h6>
                <div
                  style={{ position: "absolute", bottom: 0 }}
                  className="mt-5"
                >
                  <h6 className="text-danger font-weight-bold">
                    ₱ {defaultSrp.toLocaleString()}
                  </h6>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        );
      })}
    </>
  );
};

export default Products;
