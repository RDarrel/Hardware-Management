import React, { useEffect, useState } from "react";
import incomePerSale from "./incomePerSale";
import getSalesAndIncome from "./getSalesAndIncome";
import Card from "./card";

const QUARTERLY = [
  { value: 1, text: "1st - January to March" },
  { value: 2, text: "2nd - April to June" },
  { value: 3, text: "3rd - July to September" },
  { value: 4, text: "4th - October to December" },
];

const Quarterly = ({ sales }) => {
  const [filteredSales, setFilteredSales] = useState([]);
  const [selectedQuarter, setSelectedQuarter] = useState(0);
  const [quarterly, setQuarterly] = useState({ totalSales: 0, totalIncome: 0 });
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentQuarter = Math.floor(currentMonth / 3) + 1;

    const quarterStartMonth =
      selectedQuarter > 0
        ? (selectedQuarter - 1) * 3
        : (currentQuarter - 1) * 3;
    const quarterEndMonth = quarterStartMonth + 2;

    const filtered = sales
      .filter((sale) => {
        const saleDate = new Date(sale.createdAt);
        const saleMonth = saleDate.getMonth();
        return saleMonth >= quarterStartMonth && saleMonth <= quarterEndMonth;
      })
      .map((sale) => {
        return {
          ...sale,
          income: incomePerSale(sale, sale.product?.isPerKilo),
        };
      });

    setFilteredSales(filtered);
    setSelectedQuarter((prev) => (prev === 0 ? currentQuarter : prev));
  }, [sales, selectedQuarter]);

  useEffect(() => {
    setQuarterly(getSalesAndIncome(filteredSales));
  }, [filteredSales]);
  return (
    <Card
      params={{ title: "Quarterly", ...quarterly }}
      array={QUARTERLY}
      value={selectedQuarter}
      setValue={setSelectedQuarter}
      label="Quarterly"
    />
  );
};

export default Quarterly;
