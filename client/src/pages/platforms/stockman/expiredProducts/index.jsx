import React, { useState } from "react";
import { MDBBadge, MDBCard, MDBCardBody, MDBIcon, MDBTable } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { BROWSE } from "../../../../services/redux/slices/stockman/expiredProducts";
import {
  ENDPOINT,
  formattedDate,
  handlePagination,
  variation,
} from "../../../../services/utilities";
import PaginationButtons from "../../../widgets/pagination/buttons";
import Spinner from "../../../widgets/spinner";

const ExpiredProducts = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(
      ({ expiredProducts }) => expiredProducts
    ),
    [expiredProducts, setExpiredProducts] = useState([]),
    [page, setPage] = useState(1),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    setExpiredProducts(collections);
  }, [collections]);

  return (
    <MDBCard>
      <MDBCardBody>
        <div className="d-flex align-items-center">
          <MDBIcon
            icon="exclamation-circle"
            style={{ color: "blue" }}
            size="2x"
          />
          <h5 className=" mt-2 ml-2">Expired Product List</h5>
        </div>
        {!isLoading ? (
          <>
            <MDBTable>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th className="text-center">Expired On</th>
                  <th className="text-center">Expired Quantity/Kilo</th>
                  <th className="text-center">Unit</th>
                </tr>
              </thead>
              <tbody>
                {expiredProducts.length > 0 ? (
                  handlePagination(expiredProducts, page, maxPage).map(
                    (expiredProduct, index) => {
                      const { product } = expiredProduct;
                      const { media } = product;
                      const img = `${ENDPOINT}/assets/products/${product._id}/${media.product[0].label}.jpg`;
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
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
                                    <span className="mr-1">Variatiant:</span>
                                    <span>
                                      {variation.name(
                                        expiredProduct,
                                        product.variations
                                      )}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="text-center font-weight-bolder">
                            {formattedDate(expiredProduct.expirationDate)}
                          </td>

                          <td className="text-center">
                            <MDBBadge pill className="p-2" color="red">
                              <h6>
                                {product.isPerKilo
                                  ? expiredProduct.expiredKilo
                                  : expiredProduct.expiredQuantity}
                              </h6>
                            </MDBBadge>
                          </td>
                          <td className="text-center">
                            {expiredProduct.product.isPerKilo ? "kg" : "Pcs"}
                          </td>
                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No records.
                    </td>
                  </tr>
                )}
              </tbody>
            </MDBTable>
            <PaginationButtons
              page={page}
              setPage={setPage}
              max={maxPage}
              title={"Expired Product"}
            />
          </>
        ) : (
          <Spinner />
        )}
      </MDBCardBody>
    </MDBCard>
  );
};

export default ExpiredProducts;
