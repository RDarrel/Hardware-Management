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
} from "mdbreact";

import {
  formattedDate,
  globalSearch,
  variation,
} from "../../../../../services/utilities";
import { Header } from "../header";
import excel from "../../../../../services/utilities/downloadExcel/excel";
import Spinner from "../../../../widgets/spinner";
import formattedTotal from "../../../../../services/utilities/forattedTotal";
import Table from "./table";

const Sales = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth);
  const { collections, isLoading } = useSelector(
    ({ salesReport }) => salesReport
  );
  const [filteredSales, setFilteredSales] = useState([]);
  const [sales, setSales] = useState([]);
  const [baseFrom, setBaseFrom] = useState("");
  const [baseTo, setBaseTo] = useState("");
  const [totalSales, setTotalSales] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [soldQty, setSoldQty] = useState(0);
  const [soldKilo, setSoldKilo] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [dispatch, token]);

  useEffect(() => {
    if (search && filteredSales.length > 0) {
      const _products = [...filteredSales];
      const searchProducts = globalSearch(_products, search);
      setSales(searchProducts);
    } else {
      setSales(filteredSales);
    }
  }, [search, filteredSales]);

  useEffect(() => {
    setSales(filteredSales);
  }, [filteredSales]);

  const handleExport = () => {
    const options = {
      sheet: "Sales-Report",
      filename: "Sales-Report",
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
                ₱ {formattedTotal(totalSales)}
              </h3>
            </div>
          </MDBCard>
        </MDBCol>

        <MDBCol md="3" className="mb-3">
          <MDBCard>
            <MDBCardHeader color="info-color">Total Income</MDBCardHeader>
            <div className="d-flex  align-items-center justify-content-between">
              <h3 className="ml-4 mt-3 dark-grey-text font-weight-bold">
                ₱ {formattedTotal(totalIncome)}
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
              <MDBRow className="d-flex justify-content-end mb-2">
                <MDBCol md="3">
                  <input
                    type="search"
                    placeholder="Search a product.."
                    className="form-control"
                    value={search}
                    onChange={({ target }) => setSearch(target.value)}
                  />
                </MDBCol>
              </MDBRow>
              <Table
                sales={sales}
                page={page}
                setPage={setPage}
                maxPage={maxPage}
              />
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
