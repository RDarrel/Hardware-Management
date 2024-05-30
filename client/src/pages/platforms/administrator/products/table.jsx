import React from "react";
import { MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";

export const Table = ({
  products,
  handleTableData,
  getProductImg,
  handleDelete,
  handleUpdate,
}) => {
  return (
    <table>
      <thead>
        <tr className="bg-light">
          <th className="ml-4">#</th>
          <th className="th-lg">Name</th>
          <th>Variation</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, indexProduct) =>
          product?.variations?.length === 2 ? (
            product.variations.map((variation, indexVariation) =>
              variation.options.map((option, indexOption) =>
                option.prices?.map((price, indexPrice) => {
                  const isFirstRow =
                    indexVariation === 0 &&
                    indexOption === 0 &&
                    indexPrice === 0;
                  const key = price._id;
                  return handleTableData(
                    key,
                    product,
                    isFirstRow,
                    indexProduct,
                    {
                      variation,
                      option,
                      actionFor: "variant2",
                      price,
                    }
                  );
                })
              )
            )
          ) : product?.variations?.length === 1 ? (
            product.variations.map((variation, indexVariation) =>
              variation.options.map((option, indexOption) => {
                const isFirstRow = indexVariation === 0 && indexOption === 0;
                const key = option._id;

                return handleTableData(key, product, isFirstRow, indexProduct, {
                  variation,
                  option,
                  actionFor: "",
                });
              })
            )
          ) : (
            <tr key={product._id} className="border-top">
              <td>{indexProduct + 1}</td>
              <td>
                <div className="d-flex align-items-center">
                  {getProductImg(product)}
                  <h5>{product.name}</h5>
                </div>
              </td>
              <td>N/A</td>
              <td className="">
                <h5>₱{product.price}</h5>
              </td>
              <td>
                <MDBBtnGroup>
                  <MDBBtn
                    size="sm"
                    rounded
                    color="danger"
                    onClick={() => handleDelete(product._id)}
                  >
                    <MDBIcon icon="trash" />
                  </MDBBtn>
                  <MDBBtn
                    rounded
                    size="sm"
                    color="primary"
                    onClick={() => handleUpdate(product)}
                  >
                    <MDBIcon icon="pencil-alt" />
                  </MDBBtn>
                </MDBBtnGroup>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};
