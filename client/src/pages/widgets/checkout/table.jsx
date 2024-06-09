import React from "react";
import { MDBTable } from "mdbreact";
import { ENDPOINT, variation } from "../../../services/utilities";

const Table = ({ cart }) => {
  return (
    <MDBTable>
      <thead>
        <tr>
          <th>Product Ordered</th>
          <th>Quantity/Kilo</th>
          <th>
            <div className="text-end d-flex justify-content-end mr-2">
              Subtotal
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {cart.map((obj, index) => {
          const { product } = obj;
          const { media } = product;
          const img = `${ENDPOINT}/assets/products/${product._id}/${media.product[0].label}.jpg`;
          return (
            <tr key={index}>
              <td className="font-weight-bold">
                <div className="d-flex align-items-center">
                  <img
                    src={img}
                    alt={product.name}
                    className="mr-2"
                    style={{ width: "60px" }}
                  />
                  <div>
                    <h5
                      className="text-truncate"
                      style={{
                        maxWidth: "400px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {product.name}
                    </h5>
                    {product.hasVariant && (
                      <div className="d-flex align-items-center">
                        <h6 className="mr-1">Variations:</h6>
                        <h6>{variation.name(obj, product.variations)}</h6>
                      </div>
                    )}
                  </div>
                </div>
              </td>

              <td className="font-weight-bold">
                {variation.qtyOrKilo(obj, product.isPerKilo)}
              </td>

              <td className="font-weight-bold d-flex justify-content-end mr-2">
                {obj.subtotal ? `₱${obj.subtotal}` : "--"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Table;
