import React, { useEffect, useState } from "react";
import { BROWSE } from "../../../../../services/redux/slices/administrator/report/salesReport";
import { useDispatch, useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBCol, MDBRow, MDBTable } from "mdbreact";
import { ENDPOINT, variation } from "../../../../../services/utilities";
import handlePagination from "../../../../widgets/pagination";
import PaginationButtons from "../../../../widgets/pagination/buttons";
import { Header } from "../header";

const Sales = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(({ salesReport }) => salesReport);
  const [filteredSales, setFilteredSales] = useState([]);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [dispatch, token]);

  return (
    <>
      <Header
        collections={collections}
        setFilteredData={setFilteredSales}
        title="Sales"
      />

      <MDBCard className="mt-3">
        <MDBCardBody>
          <MDBTable responsive bordered striped>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Unit</th>
                <th className="th-lg">Sales</th>
                <th>Capital</th>
                <th>SRP</th>
                <th>INCOME</th>
              </tr>
            </thead>
            <tbody>
              {handlePagination(filteredSales, page, maxPage).map(
                (sale, index) => {
                  const { product } = sale;
                  const { media } = product;
                  const img = `${ENDPOINT}/assets/products/${product._id}/${media.product[0].label}.jpg`;

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="product-info">
                          <img
                            src={img}
                            alt={product.name}
                            className="product-image mr-2"
                          />
                          <div>
                            <h5 className="product-name">{product.name}</h5>
                            {product.hasVariant && (
                              <div className="d-flex align-items-center">
                                <span className="mr-1">Variations:</span>
                                <span>
                                  {variation.name(sale, product.variations)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{product.isPerKilo ? "Kilo" : "Pcs"}</td>
                      <td>{product.isPerKilo ? sale.kilo : sale.quantity}</td>
                      <td>
                        <span className="font-weight-bold text-danger">
                          ₱{sale.capital}
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-danger">
                          ₱{sale.srp}
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-danger">
                          ₱{sale.income}
                        </span>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </MDBTable>
          <MDBRow className="m-0 p-0">
            <MDBCol md="12 m-2">
              <PaginationButtons
                page={page}
                max={maxPage}
                mt={1}
                setPage={setPage}
                array={filteredSales}
                title={"Product"}
              />
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </>
  );
};

export default Sales;
