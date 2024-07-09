import React, { useState } from "react";
import { MDBTable } from "mdbreact";
import {
  ENDPOINT,
  formattedDate,
  handlePagination,
  variation,
} from "../../../../services/utilities";
import PaginationButtons from "../../../widgets/pagination/buttons";
const Table = ({ products = [], isStock = false }) => {
  const [page, setPage] = useState(1);
  const maxPage = 5;
  return (
    <>
      <MDBTable>
        <thead>
          <tr>
            <th className="font-weight-bold dark-grey-text">
              <strong>Product</strong>
            </th>
            {!isStock && (
              <th className="font-weight-bold dark-grey-text text-center th-lg">
                <strong>Expired On</strong>
              </th>
            )}
            <th className="font-weight-bold dark-grey-text text-center th-lg">
              <strong>Quantity/Kilo</strong>
            </th>
            <th className="font-weight-bold dark-grey-text text-center th-lg">
              <strong>Unit</strong>
            </th>
          </tr>
        </thead>
        <tbody>
          {!products.length && (
            <tr>
              <td className="text-center" colSpan="5">
                No recent records.
              </td>
            </tr>
          )}
          {handlePagination(products, page, maxPage).map((obj) => {
            const { product, _id } = obj;
            const { media } = product;
            const img = `${ENDPOINT}/assets/products/${product._id}/${media.product[0].label}.jpg`;
            return (
              <tr key={_id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={img}
                      alt={product.name}
                      className="mr-2"
                      style={{
                        width: "50px",
                        borderRadius: "4px",
                        height: "50px",
                      }}
                    />
                    <div>
                      <h6
                        className="text-truncate"
                        style={{
                          maxWidth: "400px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          marginBottom: "-15px",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {product.name}
                      </h6>
                      {product.hasVariant && (
                        <div className="d-flex align-items-center">
                          <span className="mr-1">Variations:</span>
                          <span>{variation.name(obj, product.variations)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                {!isStock && (
                  <td className="text-center font-weight-bold">
                    {formattedDate(obj.expirationDate)}
                  </td>
                )}
                <td className="text-center font-weight-bold">
                  {!isStock
                    ? product.isPerKilo
                      ? obj.kiloStock
                      : obj.quantityStock
                    : obj.stock}
                </td>

                <td className="text-center">
                  {product.isPerKilo ? "kg" : "Pcs"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </MDBTable>
      <PaginationButtons
        page={page}
        setPage={setPage}
        title={"Nearly"}
        max={maxPage}
        array={products}
      />
    </>
  );
};

export default Table;
