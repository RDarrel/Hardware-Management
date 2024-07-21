import React, { useState } from "react";

import { MDBCard, MDBCardBody, MDBCardImage } from "mdbreact";
import { ENDPOINT } from "../../../../../services/utilities";

const Card = ({ products, setSelected, setIsView, selected }) => {
  const [didHoverID, setDidHoverID] = useState(-1);
  return (
    <div className="mb-5">
      <div className="d-flex justify-content-center">
        <div
          className=" w-75 d-flex flex-wrap justify-content-around"
          style={{ padding: 0 }}
        >
          {products.map((product, index) => {
            const { variations = [], hasVariant, has2Variant, srp } = product;

            const showPrice = hasVariant
              ? has2Variant
                ? variations[0]?.options[0].prices[0]?.srp
                : variations[0]?.options[0].srp
              : srp;

            return (
              <div
                className="mt-2"
                key={index}
                style={{
                  flex: "0 0 18%",
                  maxWidth: "18%",
                  margin: "0 1px",
                  marginBottom: "0px",
                }}
              >
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
                    transform: didHoverID === index ? "translateY(-3px)" : "",
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
                        ₱ {showPrice.toLocaleString()}
                      </h6>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Card;
