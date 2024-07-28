import React, { useEffect, useState } from "react";
import { BROWSE } from "../../../../../services/redux/slices/administrator/report/salesReport";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCol,
  MDBIcon,
  MDBRow,
  MDBTable,
} from "mdbreact";
import {
  ENDPOINT,
  formattedDate,
  variation,
} from "../../../../../services/utilities";
import handlePagination from "../../../../widgets/pagination";
import PaginationButtons from "../../../../widgets/pagination/buttons";
import { Header } from "../header";
import excel from "../../../../../services/utilities/downloadExcel/excel";
import Spinner from "../../../../widgets/spinner";

const Sales = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth);
  const { collections, isLoading } = useSelector(
    ({ salesReport }) => salesReport
  );
  const [baseFrom, setBaseFrom] = useState("");
  const [baseTo, setBaseTo] = useState("");
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

  const handleExport = () => {
    const options = {
      sheet: "SHSF-8",
      filename: "SF-Form-8",
      title: "Sales Report",
      from: formattedDate(baseFrom),
      to: formattedDate(baseTo),
      income: `₱${totalIncome.toLocaleString()}`,
      sales: `₱${totalSales.toLocaleString()}`,
      pcs: soldQty,
      kg: soldKilo,
    };

    const formatSales = filteredSales.map((sale) => {
      const { product, sold, capital, income, srp } = sale;
      return {
        product: product.name,
        hasVariant: product.hasVariant,
        ...(product.hasVariant && {
          variant: variation.name(sale, product.variations),
        }),
        sold,
        unit: product.isPerKilo ? "Kg" : "Pcs",
        capital: `₱ ${capital.toLocaleString()}`,
        srp: `₱ ${srp.toLocaleString()}`,
        sales: `₱ ${Number(srp * sold).toLocaleString()}`,
        income: `₱ ${income.toLocaleString()}`,
      };
    });
    excel({ options, array: formatSales });
  };
  return (
    <>
      <MDBRow className="d-flex align-items-center">
        <MDBCol md="10">
          <Header
            setFilteredData={setFilteredSales}
            collections={collections}
            setSoldKilo={setSoldKilo}
            setSoldQty={setSoldQty}
            setTotalIncome={setTotalIncome}
            setTotalSales={setTotalSales}
            setBaseFrom={setBaseFrom}
            setBaseTo={setBaseTo}
          />
        </MDBCol>
        <MDBCol>
          <MDBBtn size="sm" onClick={handleExport}>
            <MDBIcon icon="file-excel" className="mr-2" />
            Export In Excel
          </MDBBtn>
        </MDBCol>
      </MDBRow>
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
          {!isLoading ? (
            <>
              <MDBTable responsive bordered striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th className=" text-center">Sold</th>
                    <th className="text-center">Unit</th>
                    <th className="text-center">Capital</th>
                    <th className="text-center">SRP</th>
                    <th className="text-center">Sales</th>
                    <th className="text-center">INCOME</th>
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
                          <td className="text-center">
                            {product.isPerKilo ? "Kg" : "Pcs"}
                          </td>
                          <td className="text-center">
                            <span className="font-weight-bold text-danger ">
                              ₱{sale.capital}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="font-weight-bold text-danger">
                              ₱{sale.srp.toLocaleString()}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="font-weight-bold text-danger">
                              ₱{(sale.srp * sale.sold).toLocaleString()}
                            </span>
                          </td>
                          <td className="text-center">
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
            </>
          ) : (
            <Spinner />
          )}
        </MDBCardBody>
      </MDBCard>
    </>
  );
};

export default Sales;
