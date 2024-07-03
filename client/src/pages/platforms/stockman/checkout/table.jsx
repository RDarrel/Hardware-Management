import React from "react";
import { MDBTable } from "mdbreact";
import { ENDPOINT, variation } from "../../../../services/utilities";

const Table = ({ cart, setCart }) => {
  // const handleChangePrice = (price, index, product, isPerKilo) => {
  //   const _cart = [...cart];

  //   if (isPerKilo) {
  //     const subtotal = price * product.kilo + price * product.kiloGrams;
  //     _cart[index] = { ..._cart[index], subtotal, price };
  //   } else {
  //     _cart[index] = {
  //       ..._cart[index],
  //       subtotal: price * product.quantity,
  //       price,
  //     };
  //   }

  //   setCart(_cart);
  // };

  return (
    <div style={{ maxHeight: "600px", overflowY: "auto" }}>
      <MDBTable>
        <thead>
          <tr>
            <th>Products</th>
            {/* <th>Unit Price</th> */}
            <th className="text-center">Quantity/Kilo</th>
            {/* <th>
            <div className="text-end d-flex justify-content-end mr-2">
              Item Subtotal
            </div>
          </th> */}
          </tr>
        </thead>
        <tbody>
          {cart.map((obj, index) => {
            const { product } = obj;
            const { media } = product;
            const img = `${ENDPOINT}/assets/products/${product._id}/${media.product[0].label}.jpg`;
            return (
              <tr key={index}>
                <td className="font-weight-bold text-center">
                  <div className="d-flex align-items-center">
                    <img
                      src={img}
                      alt={product.name}
                      className="mr-2"
                      style={{ width: "50px", height: "50px" }}
                    />
                    <div>
                      <h6
                        className="text-truncate d-flex justify-content-start font-weight-bold"
                        style={{
                          maxWidth: "400px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          marginBottom: "1px",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {product.name}
                      </h6>
                      {product.hasVariant && (
                        <div className="d-flex align-items-center">
                          <h6 className="mr-1">Variations:</h6>
                          <h6>{variation.name(obj, product.variations)}</h6>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                {/* <td>
                <MDBInputGroup
                  required
                  prepend="₱"
                  style={{ width: "200px" }}
                  value={String(obj?.price || 0)}
                  onChange={({ target }) =>
                    handleChangePrice(
                      Number(target.value),
                      index,
                      obj,
                      product.isPerKilo
                    )
                  }
                />
              </td> */}
                <td className="font-weight-bold text-center">
                  {variation.qtyOrKilo(obj, product.isPerKilo)}
                </td>

                {/* <td className="font-weight-bold d-flex justify-content-end mr-2">
                {obj.subtotal ? `₱${obj.subtotal}` : "--"}
              </td> */}
              </tr>
            );
          })}
        </tbody>
      </MDBTable>
    </div>
  );
};

export default Table;
