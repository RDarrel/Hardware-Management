import React from "react";
import { MDBTable } from "mdbreact";
import { ENDPOINT, variation } from "../../../services/utilities";
import formattedTotal from "../../../services/utilities/forattedTotal";

const Table = ({ cart }) => {
  return (
    <MDBTable>
      <thead>
        <tr>
          <th>Products Ordered</th>
          <th>SRP</th>
          <th>Quantity/Kilo</th>
          <th>Subtotal</th>
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
                    className="mr-2 "
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div>
                    <h6
                      className="text-truncate font-weight-bold"
                      style={{
                        maxWidth: "400px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {product.name}
                    </h6>
                    {product.hasVariant && (
                      <div
                        className="d-flex align-items-center"
                        style={{ marginTop: "-7px" }}
                      >
                        <h6 className="mr-1">Variant:</h6>
                        <h6>{variation.name(obj, product.variations)}</h6>
                      </div>
                    )}
                  </div>
                </div>
              </td>

              <td className="font-weight-bold">
                ₱
                {formattedTotal(
                  variation.getTheCapitalOrSrp("srp", obj, product)
                )}
              </td>

              <td className="font-weight-bold ">
                {variation.qtyOrKilo(obj, product.isPerKilo)}
              </td>

              <td className="font-weight-bold ">
                ₱{formattedTotal(obj.subtotal)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Table;
