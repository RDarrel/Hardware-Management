import React, { useEffect, useState } from "react";
import { BROWSE } from "../../../../../services/redux/slices/administrator/report/salesReport";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCol,
  MDBRow,
  MDBTable,
} from "mdbreact";
import { ENDPOINT, variation } from "../../../../../services/utilities";
import handlePagination from "../../../../widgets/pagination";
import PaginationButtons from "../../../../widgets/pagination/buttons";
import { Header } from "../header";

const Sales = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(({ salesReport }) => salesReport);
  const [totalSales, setTotalSales] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [soldQty, setSoldQty] = useState(0);
  const [soldKilo, setSoldKilo] = useState(0);
  const [filteredSales, setFilteredSales] = useState([]);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [dispatch, token]);

  return (
    <>
      <Header
        setFilteredData={setFilteredSales}
        collections={collections}
        setSoldKilo={setSoldKilo}
        setSoldQty={setSoldQty}
        setTotalIncome={setTotalIncome}
        setTotalSales={setTotalSales}
      />
      <MDBRow>
        <MDBCol md="3" className="mb-3">
          <MDBCard>
            <MDBCardHeader color="warning-color">Total Sales</MDBCardHeader>
            <div className="d-flex  align-items-center justify-content-between">
              <h3 className="ml-4 mt-3 dark-grey-text font-weight-bold">
                ₱ {totalSales.toLocaleString()}
              </h3>
            </div>
          </MDBCard>
        </MDBCol>

        <MDBCol md="3" className="mb-3">
          <MDBCard>
            <MDBCardHeader color="info-color">Total Income</MDBCardHeader>
            <div className="d-flex  align-items-center justify-content-between">
              <h3 className="ml-4 mt-3 dark-grey-text font-weight-bold">
                ₱ {totalIncome.toLocaleString()}
              </h3>
            </div>
          </MDBCard>
        </MDBCol>

        <MDBCol md="3" className="mb-3">
          <MDBCard>
            <MDBCardHeader color="danger-color">
              Total sold in pcs
            </MDBCardHeader>
            <div className="d-flex  align-items-center justify-content-between">
              <h3 className="ml-4 mt-3 dark-grey-text font-weight-bold">
                {soldQty}
              </h3>
            </div>
          </MDBCard>
        </MDBCol>

        <MDBCol md="3" className="mb-3">
          <MDBCard>
            <MDBCardHeader color="primary-color">
              Total sold in kg
            </MDBCardHeader>
            <div className="d-flex  align-items-center justify-content-between">
              <h3 className="ml-4 mt-3 dark-grey-text font-weight-bold">
                {soldKilo}
              </h3>
            </div>
          </MDBCard>
        </MDBCol>
      </MDBRow>
      <MDBCard>
        <MDBCardBody>
          <MDBTable responsive bordered striped>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th className="th-lg text-center">Sold</th>
                <th>Unit</th>
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
                        <div className="d-flex align-items-center">
                          <img
                            src={img}
                            alt={product.name}
                            className="product-image mr-2"
                          />
                          <div>
                            <h6 className="product-name mt-1">
                              {product.name}
                            </h6>
                            {product.hasVariant && (
                              <div
                                className="d-flex align-items-center"
                                style={{ marginTop: "-20px" }}
                              >
                                <span className="mr-1">Variations:</span>
                                <span>
                                  {variation.name(sale, product.variations)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-center">{sale?.sold}</td>
                      <td>{product.isPerKilo ? "Kg" : "Pcs"}</td>
                      <td>
                        <span className="font-weight-bold text-danger">
                          ₱{sale.capital}
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-danger">
                          ₱{sale.srp.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-danger">
                          ₱{sale.income.toLocaleString()}
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
