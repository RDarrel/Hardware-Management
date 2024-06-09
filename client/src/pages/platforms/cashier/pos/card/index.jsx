import React, { useState } from "react";

import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage } from "mdbreact";
import { ENDPOINT } from "../../../../../services/utilities";

const Card = ({ products, setSelected, setIsView }) => {
  const [didHoverID, setDidHoverID] = useState(-1);
  return (
    <MDBRow className="mb-5">
      <MDBCol size="12" className=" d-flex justify-content-center">
        <MDBRow className="mt-4 w-75">
          {products.map((product, index) => {
            const { variations = [], hasVariant, has2Variant, srp } = product;

            const showPrice = hasVariant
              ? has2Variant
                ? variations[0]?.options[0].prices[0]?.srp
                : variations[0]?.options[0].srp
              : srp;
            return (
              <MDBCol md="3" className="mt-2 " key={index}>
                <MDBCard
                  onClick={() => {
                    setSelected(product);
                    setIsView(true);
                  }}
                  onMouseEnter={() => setDidHoverID(index)}
                  onMouseLeave={() => setDidHoverID(-1)}
                  style={{
                    boxShadow: "none",
                    border: `1px solid ${
                      didHoverID === index ? "red" : "lightgray"
                    }`,
                    maxHeight: "300px",
                    height: "250px",
                    transform: didHoverID === index ? "translateY(-8px)" : "",
                    transition: "transform 0.3s ease-in-out",
                  }}
                  className={`h-100 cursor-pointer transition-all z-depth-${
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
                    <h6 className="mb-4"> {product.name}</h6>
                    <div
                      style={{ position: "absolute", bottom: 0 }}
                      className="mt-5"
                    >
                      <h6 className="text-danger font-weight-bold">
                        ₱ {showPrice}
                      </h6>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            );
          })}
        </MDBRow>
      </MDBCol>
    </MDBRow>
  );
};

export default Card;
