import React, { useCallback, useEffect, useState } from "react";
import { MDBCol, MDBDatePicker, MDBIcon, MDBRow } from "mdbreact";
import "../header/header.css";
import GET from "./GET";
import arrangeBy from "./arrangeBy";

export const Header = ({
  collections,
  isTransaction = false,
  isEmployees = false,
  mb = "3",
  title = "Sales",
  setFilteredData = () => {},
  setSoldQty = () => {},
  setSoldKilo = () => {},
  setTotalIncome = () => {},
  setTotalSales = () => {},
  setTotalNetSales = () => {},
  setUsingDateRange = () => {},
  setBaseFrom = () => {},
  setTotalVat = () => {},
  setBaseTo = () => {},
  isDashBoard = false,
  usingDateRange = false,
  fromRange = new Date(),
  toRange = new Date(),
}) => {
  const [soldKiloState, setSoldKiloState] = useState(0);
  const [soldQtyState, setSoldQtyState] = useState(0);
  const [totalIncomeState, setTotalIncomeState] = useState(0);
  const [totalVatState, setTotalVatState] = useState(0);
  const [totalSalesState, setTotalSalesState] = useState(0);
  const [totalNetSalesState, setTotalNetSalesState] = useState(0);
  const [from, setFrom] = useState(new Date()),
    [sales, setSales] = useState([]),
    [to, setTo] = useState(new Date()),
    [minDate, setMinDate] = useState(new Date()),
    [maxDate, setMaxDate] = useState(new Date());

  useEffect(() => {
    if (usingDateRange) {
      setFrom(new Date(fromRange));
      setTo(new Date(toRange));
      setUsingDateRange(false);
    }
  }, [usingDateRange, setUsingDateRange, setFrom, fromRange, toRange]);

  useEffect(() => {
    setSoldKilo(soldKiloState);
    setSoldQty(soldQtyState);
    setTotalIncome(totalIncomeState);
    setTotalSales(totalSalesState);
    setTotalNetSales(totalNetSalesState);
    setTotalVat(totalVatState);
    setBaseFrom(from);
    setBaseTo(to);
  }, [
    soldKiloState,
    totalIncomeState,
    totalSalesState,
    totalNetSalesState,
    soldQtyState,
    totalVatState,
    from,
    to,
    setSoldKilo,
    setSoldQty,
    setTotalIncome,
    setTotalSales,
    setTotalNetSales,
    setBaseFrom,
    setBaseTo,
  ]);

  const getTheCreatedAt = useCallback(
    (latest = false) => {
      if (collections.length === 0) {
        return null;
      }

      if (latest) {
        return collections.reduce((maxDate, currentItem) => {
          const currentDate = new Date(currentItem.createdAt);
          return currentDate > maxDate ? currentDate : maxDate;
        }, new Date(0));
      } else {
        return collections.reduce((minDate, currentItem) => {
          const currentDate = new Date(currentItem.createdAt);
          return currentDate < minDate ? currentDate : minDate;
        }, new Date());
      }
    },
    [collections]
  );

  useEffect(() => {
    setSales(
      collections.map((sale) => {
        return { ...sale, income: handleIncome(sale, sale.product?.isPerKilo) };
      })
    );
    setFrom(getTheCreatedAt(true) || new Date());
    setTo(getTheCreatedAt(true) || new Date());
    setMinDate(getTheCreatedAt() || new Date());
    setMaxDate(getTheCreatedAt(true) || new Date());
  }, [collections, getTheCreatedAt]);

  const handleIncome = (sale, isPerKilo) => {
    const { kilo, quantity, capital, srp, refund = 0, discount = 0 } = sale;
    const totalSales = isPerKilo ? srp * kilo : srp * quantity; // Total Sales
    const salesAfterDiscount = totalSales - discount; // Bawasan ang discount
    const netSales = salesAfterDiscount - refund; // Bawasan ang refund
    return netSales - (isPerKilo ? capital * kilo : capital * quantity); // Income
  };

  // const handleIncome = (sale, isPerKilo) => {
  //   const { kilo, quantity, capital, srp } = sale;
  //   return isPerKilo
  //     ? srp * kilo - capital * kilo
  //     : srp * quantity - capital * quantity;
  // };

  const isSales = !isEmployees && !isTransaction;

  useEffect(() => {
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (toDate < fromDate) {
        setTo(fromDate);
      } else {
        const filteredSales = sales.filter(({ createdAt }) => {
          const _from = new Date(fromDate.setHours(0, 0, 0, 0));
          const _to = new Date(toDate.setHours(23, 59, 59, 999));
          const _createdAt = new Date(createdAt);

          return _createdAt >= _from && _createdAt <= _to;
        });
        let filteredCollections = [];
        if (isTransaction || isEmployees) {
          filteredCollections = isTransaction
            ? filteredSales
            : arrangeBy.employees(filteredSales);
        } else {
          filteredCollections = arrangeBy.sales(filteredSales);
        }

        setFilteredData(filteredCollections);

        if (!isEmployees || !isTransaction) {
          const {
            sales: totalSales,
            income: totalIncome,
            totalVat = 0,
            netSales = 0,
          } = GET.salesAndIncome(filteredCollections);
          const { _soldKilo = 0, _soldQty = 0 } = GET.sold(filteredCollections);
          setSoldKiloState(_soldKilo);
          setSoldQtyState(_soldQty);
          setTotalSalesState(totalSales);
          setTotalIncomeState(totalIncome);
          setTotalVatState(totalVat);
          setTotalNetSalesState(netSales);
        }
      }
    }
  }, [
    from,
    to,
    isEmployees,
    isTransaction,
    sales,
    setFilteredData,
    setSoldKiloState,
    setSoldQtyState,
    setTotalSalesState,
    setTotalIncomeState,
  ]);

  return (
    <MDBRow className={`d-flex align-items-center mb-${mb}`}>
      <MDBCol md="12" className="d-flex align-items-center">
        {!isDashBoard && (
          <>
            <MDBIcon
              icon="newspaper"
              size="2x"
              className="mt-2 mr-2"
              style={{ color: "blue" }}
            />
            <h4 className={`mt-3  ${isSales ? "font-weight-bolder" : ""}`}>
              {title} Report
            </h4>
          </>
        )}
        <div
          className={`d-flex align-items-center ${
            !isDashBoard ? "mt-2 ml-5" : ""
          }`}
        >
          <h6 className={`font-weight-bold ${isDashBoard && "grey-text"} mr-3`}>
            From
          </h6>
          <MDBDatePicker
            value={new Date(from).toDateString()}
            getValue={(value) => setFrom(new Date(value))}
            minDate={new Date(minDate).toDateString()}
            maxDate={new Date(maxDate).toDateString()}
          />
          <h6
            className={`font-weight-bold ${
              isDashBoard && "grey-text"
            } ml-3 mr-4 `}
          >
            To
          </h6>
          <MDBDatePicker
            value={new Date(to).toDateString()}
            maxDate={new Date(maxDate).toDateString()}
            getValue={(value) => setTo(new Date(value))}
            minDate={new Date(from).toDateString()}
          />
        </div>
      </MDBCol>
    </MDBRow>
  );
};
