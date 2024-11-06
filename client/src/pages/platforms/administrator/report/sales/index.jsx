import React, { useEffect, useState } from "react";
import { BROWSE } from "../../../../../services/redux/slices/administrator/report/salesReport";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBIcon,
  MDBRow,
} from "mdbreact";

import CustomSelect from "../../../../../components/customSelect";
import {
  // globalSearch,
  variation,
} from "../../../../../services/utilities";
import { Header } from "../header";
import excel from "../../../../../services/utilities/downloadExcel/excel";
import Spinner from "../../../../widgets/spinner";
import Table from "./table";
import Overview from "./overview";

const Sales = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth);
  const { collections, isLoading } = useSelector(
    ({ salesReport }) => salesReport
  );
  const [filteredSales, setFilteredSales] = useState([]);
  const [sales, setSales] = useState([]);
  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(new Date());
  const [frequency, setFrequency] = useState("Daily");
  const [type, setType] = useState("Detailed");
  const [totalSales, setTotalSales] = useState(0);
  const [totalRefund, setTotalRefund] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [soldQty, setSoldQty] = useState(0);
  const [soldKilo, setSoldKilo] = useState(0);
  // const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [dispatch, token]);

  // useEffect(() => {
  //   if (search && filteredSales.length > 0) {
  //     const _products = [...filteredSales];
  //     const searchProducts = globalSearch(_products, search);
  //     setSales(searchProducts);
  //   } else {
  //     setSales(filteredSales);
  //   }
  // }, [search, filteredSales]);

  useEffect(() => {
    setSales(filteredSales);
  }, [filteredSales]);

  const handleExport = () => {
    const options = {
      sheet: "Sales-Report",
      filename: "Sales-Report",
      title: "Sales Report",
      // from: formattedDate(baseFrom),
      // to: formattedDate(baseTo),
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

  const netSales = totalSales - (totalDiscount + totalRefund);
  const totalVatSales = Number(netSales / 1.12).toFixed(2);

  console.log(filteredSales);

  return (
    <>
      <MDBRow className="d-flex align-items-center">
        <MDBCol md="10">
          <MDBRow className={`d-flex align-items-center `}>
            <MDBCol md="12" className="d-flex align-items-center">
              <MDBIcon
                icon="newspaper"
                size="2x"
                className="mt-2 mr-2"
                style={{ color: "blue" }}
              />
              <h4 className={`mt-3  font-weight-bolder`}>Sales Report</h4>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBCol>
          <MDBBtn size="sm" onClick={handleExport}>
            <MDBIcon icon="file-excel" className="mr-2" />
            Export In Excel
          </MDBBtn>
        </MDBCol>
      </MDBRow>

      <MDBCard>
        <MDBCardBody>
          <MDBRow className="d-flex justify-content-center">
            <MDBCol md="3" className="text-center font-weight-bold">
              <span>Type</span>
            </MDBCol>
            <MDBCol md="4" className="text-center font-weight-bold">
              <span>Date Range</span>
            </MDBCol>
            <MDBCol md="3" className="text-center font-weight-bold">
              <span>Frequency</span>
            </MDBCol>
          </MDBRow>

          <MDBRow className=" d-flex justify-content-center">
            <MDBCol md="2">
              <CustomSelect
                className="m-0 p-0"
                choices={["Detailed", "Summary"]}
                preValue={type}
                onChange={(value) => setType(value)}
              />
            </MDBCol>
            <MDBCol
              md="5"
              className="d-flex align-items-center justify-content-center"
            >
              <Header
                setFilteredData={setFilteredSales}
                collections={collections}
                setSoldKilo={setSoldKilo}
                setSoldQty={setSoldQty}
                setTotalIncome={setTotalIncome}
                setTotalSales={setTotalSales}
                setBaseFrom={setFrom}
                isSalesReport={true}
                setBaseTo={setTo}
                setTotalDiscount={setTotalDiscount}
                setTotalRefund={setTotalRefund}
                frequency={frequency}
                type={type}
              />
            </MDBCol>
            <MDBCol md="2">
              <CustomSelect
                className="m-0 p-0"
                choices={["Daily", "Weekly", "Monthly", "Yearly"]}
                onChange={(value) => setFrequency(value)}
                preValue={frequency}
              />
            </MDBCol>
          </MDBRow>

          {/* <hr /> */}
          {!isLoading ? (
            <>
              {/* <MDBRow className="d-flex justify-content-end mb-2">
                <MDBCol md="3">
                  <input
                    type="search"
                    placeholder="Search a product.."
                    className="form-control"
                    value={search}
                    onChange={({ target }) => setSearch(target.value)}
                  />
                </MDBCol>
              </MDBRow> */}
              <Overview
                totalIncome={totalIncome}
                totalRefund={totalRefund}
                totalSales={totalSales}
                totalVatSales={totalVatSales}
                from={from}
                to={to}
                netSales={netSales}
                totalDiscount={totalDiscount}
              />

              <Table
                sales={sales}
                page={page}
                setPage={setPage}
                maxPage={maxPage}
                isDetailedType={type === "Detailed"}
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
