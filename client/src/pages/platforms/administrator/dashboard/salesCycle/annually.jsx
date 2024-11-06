import React, { useEffect, useState } from "react";
import getSalesAndIncome from "./getSalesAndIncome";
import netAndIncome from "./netAndIncome";
import Card from "./card";

const YEARS = [
  {
    value: 2024,
    text: 2024,
  },
];

const Annually = ({ sales }) => {
  const [filteredSales, setFilteredSales] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [annually, setAnnually] = useState({
    totalSales: 0,
    totalIncome: 0,
    totalNetSales: 0,
  });

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Filter sales based on the current year
    const filtered = sales
      .filter((sale) => {
        const saleDate = new Date(sale.createdAt);
        return saleDate.getFullYear() === currentYear;
      })
      .map((sale) => {
        return {
          ...sale,
          ...netAndIncome(sale, sale.product?.isPerKilo),
        };
      });

    setFilteredSales(filtered);
  }, [sales]);

  useEffect(() => {
    setAnnually(getSalesAndIncome(filteredSales));
  }, [filteredSales]);

  return (
    <Card
      params={{ title: "Annually", ...annually }}
      color="warning"
      array={YEARS}
      value={selectedYear}
      setValue={setSelectedYear}
      label="Annually"
    />
  );
};

export default Annually;
