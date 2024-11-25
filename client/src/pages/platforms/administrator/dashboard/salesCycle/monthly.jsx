import React, { useEffect, useState } from "react";
import getSalesAndIncome from "./getSalesAndIncome";
import Card from "./card";
import netAndIncome from "./netAndIncome";

const MONTHS = [
  { text: "JANUARY", value: 1 },
  { text: "FEBRUARY", value: 2 },
  { text: "MARCH", value: 3 },
  { text: "APRIL", value: 4 },
  { text: "MAY", value: 5 },
  { text: "JUNE", value: 6 },
  { text: "JULY", value: 8 },
  { text: "AUGUST", value: 8 },
  { text: "SEPTEMBER", value: 9 },
  { text: "OCTOBER", value: 10 },
  { text: "NOVEMBER", value: 11 },
  { text: "DECEMBER", value: 12 },
];

const Monthly = ({ sales = [] }) => {
  const [filteredSales, setFilteredSales] = useState([]);
  const [latestMonth, setLatestMonth] = useState(-1);
  const [monthly, setMonthly] = useState({
    totalSales: 0,
    totalIncome: 0,
    totalNetSales: 0,
  });

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const currentYear = currentDate.getFullYear();

    const currentMonth =
      latestMonth > -1 ? latestMonth : currentDate.getMonth();

    const _sales = [...sales];

    const normalizedSales = _sales.map((sale) => {
      const saleDate = new Date(sale.createdAt);
      return {
        ...sale,
        ...netAndIncome(sale, sale.product?.isPerKilo),
        createdAt: saleDate.toISOString(),
      };
    });

    const salesInCurrentMonth = normalizedSales.filter((sale) => {
      const saleDate = new Date(sale.createdAt);
      return (
        saleDate.getFullYear() === currentYear &&
        saleDate.getMonth() === currentMonth
      );
    });

    setFilteredSales(salesInCurrentMonth);
    setLatestMonth(currentMonth);
  }, [sales, latestMonth]);

  useEffect(() => {
    setMonthly(getSalesAndIncome(filteredSales));
  }, [filteredSales]);

  return (
    <Card
      color="primary"
      params={{ title: "Monthly", ...monthly }}
      array={MONTHS}
      value={latestMonth + 1}
      setValue={(value) => setLatestMonth(value - 1)}
      label="Monthly"
    />
  );
};

export default Monthly;
