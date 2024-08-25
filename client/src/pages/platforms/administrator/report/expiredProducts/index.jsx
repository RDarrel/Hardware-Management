import React, { useEffect, useState } from "react";
import { MDBCard, MDBCardBody, MDBIcon, MDBTable } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../../services/redux/slices/administrator/report/expiredProductsReport";
import {
  ENDPOINT,
  formattedDate,
  fullName,
  variation,
} from "../../../../../services/utilities";
import handlePagination from "../../../../widgets/pagination";
import PaginationButtons from "../../../../widgets/pagination/buttons";
const ExpiredProducts = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    { collections } = useSelector(
      ({ expiredProductsReport }) => expiredProductsReport
    ),
    [expireds, setExpireds] = useState([]),
    [page, setPage] = useState(1),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [dispatch, token]);

  useEffect(() => {
    setExpireds(collections);
  }, [collections]);

  return (
    <>
      <MDBCard>
        <MDBCardBody>
          <div className="d-flex align-items-center">
            <MDBIcon
              icon="clipboard-list"
              className="mr-2"
              size="2x"
              style={{ color: "blue" }}
            />
            <h4 className="mt-2">Expired Products</h4>
          </div>
          <MDBTable bordered striped className="mt-4">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Quantity/Kilo</th>
                <th>Expiration Date</th>
                <th>Removed By</th>
                <th>Removed Date</th>
              </tr>
            </thead>
            <tbody>
              {handlePagination(expireds, page, maxPage).map(
                (expired, index) => {
                  const { product } = expired;
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
                            className=" mr-2"
                            style={{ height: "45px", width: "60px" }}
                          />
                          <div>
                            <h6 className="product-name mt-3">
                              {product.name}
                            </h6>
                            {product.hasVariant && (
                              <div
                                className="d-flex align-items-center"
                                style={{ marginTop: "-20px" }}
                              >
                                <span className="mr-1">Variant:</span>
                                <span>
                                  {variation.name(expired, product.variations)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        {product.isPerKilo
                          ? `${expired.quantity} kg`
                          : `${expired.quantity} pcs`}
                      </td>
                      <td>{formattedDate(expired.expirationDate)}</td>
                      <td>{fullName(expired.removeBy?.fullName)}</td>
                      <td>{formattedDate(expired.removeDate)}</td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </MDBTable>
          <PaginationButtons
            page={page}
            max={maxPage}
            mt={1}
            setPage={setPage}
            array={expireds}
            title={"expired Product"}
          />
        </MDBCardBody>
      </MDBCard>
    </>
  );
};

export default ExpiredProducts;
