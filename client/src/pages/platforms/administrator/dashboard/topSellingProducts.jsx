import { MDBCard, MDBCardBody, MDBTable, MDBCardHeader } from "mdbreact";
import React from "react";
import { ENDPOINT, variation } from "../../../../services/utilities";

const TopSellingProducts = ({ products }) => {
  return (
    <MDBCard className="mb-4">
      <MDBCardHeader color="success-color">
        Top 10 selling products
      </MDBCardHeader>
      <MDBCardBody>
        <MDBTable>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((sale, index) => {
                const { product } = sale;
                const { media } = product || {};
                const img = `${ENDPOINT}/assets/products/${product?._id}/${media?.product[0].label}.jpg`;

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="text-center">
                      <div className="d-flex align-items-center">
                        <img
                          src={img}
                          alt={product.name}
                          className="product-image mr-2"
                        />
                        <div>
                          <h6 className="product-name mt-2 font-weight-bold">
                            {product.name}
                          </h6>
                          {product.hasVariant && (
                            <div
                              className="d-flex align-items-center variant-name"
                              style={{ marginTop: "-15px" }}
                            >
                              <span className="mr-1">Variant:</span>
                              <span>
                                {variation.name(sale, product.variations)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="2">No Records</td>
              </tr>
            )}
          </tbody>
        </MDBTable>
      </MDBCardBody>
    </MDBCard>
  );
};

export default TopSellingProducts;
