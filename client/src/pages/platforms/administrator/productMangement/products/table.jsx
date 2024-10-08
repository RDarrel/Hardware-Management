import React, { useState } from "react";
import handlePagination from "../../../../widgets/pagination";
import PaginationButtons from "../../../../widgets/pagination/buttons";
import { MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";
import { useSelector } from "react-redux";

export const Table = ({
  products,
  handleTableData,
  getProductImg,
  handleDelete,
  handleUpdate,
}) => {
  const { maxPage } = useSelector(({ auth }) => auth),
    [page, setPage] = useState(1);

  console.log(products);
  return (
    <>
      <table>
        <thead>
          <tr>
            <th className="th-lg ">Product Name</th>
            <th>Variation</th>
            <th>Capital</th>
            <th>SRP</th>
            <th>Markup</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            <>
              {handlePagination(products, page, maxPage).map((product) =>
                product?.variations?.length === 2 ? (
                  product.variations.map((variation, indexVariation) =>
                    variation.options.map((option, indexOption) =>
                      option.prices?.map((price, indexPrice) => {
                        const isFirstRow =
                          indexVariation === 0 &&
                          indexOption === 0 &&
                          indexPrice === 0;
                        const key = price._id;
                        return handleTableData(key, product, isFirstRow, {
                          variation,
                          option,
                          actionFor: "variant2",
                          price,
                        });
                      })
                    )
                  )
                ) : product?.variations?.length === 1 ? (
                  product.variations.map((variation, indexVariation) =>
                    variation.options.map((option, indexOption) => {
                      const isFirstRow =
                        indexVariation === 0 && indexOption === 0;
                      const key = option._id;

                      return handleTableData(key, product, isFirstRow, {
                        variation,
                        option,
                        actionFor: "",
                      });
                    })
                  )
                ) : (
                  <tr key={product._id} className="border-top">
                    <td className="m-2">
                      <div className="d-flex align-items-center text-truncate mt-3 mb-3">
                        {getProductImg(product)}
                        <h6
                          className="text-truncate"
                          style={{
                            maxWidth: "250px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {product.name}
                        </h6>
                      </div>
                    </td>
                    <td>{null} </td>
                    <td>
                      <h6>₱{product?.capital?.toLocaleString()}</h6>
                    </td>
                    <td>
                      <h6>₱{product?.srp?.toLocaleString()}</h6>
                    </td>
                    <td>
                      <h6>
                        ₱
                        {Number(
                          product?.srp - product?.capital
                        ).toLocaleString()}
                      </h6>
                    </td>
                    <td className="text-center">
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
            </>
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                No Records
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <PaginationButtons
        page={page}
        setPage={setPage}
        max={maxPage}
        array={products}
        title="Product"
      />
    </>
  );
};
