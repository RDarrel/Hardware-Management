import React, { useCallback, useEffect, useState } from "react";
import { MDBCol, MDBIcon, MDBRow } from "mdbreact";
import "../header/header.css";
import arrangeBy from "./arrangeBy";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
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
}) => {
  const [params, setParams] = useState({
    year: 2024,
    month: 0,
    week: 0,
    day: 0,
  });
  const [soldKiloState, setSoldKiloState] = useState(0);
  const [soldQtyState, setSoldQtyState] = useState(0);
  const [totalIncomeState, setTotalIncomeState] = useState(0);
  const [totalSalesState, setTotalSalesState] = useState(0);
  const [sales, setSales] = useState([]);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [days, setDays] = useState([]);

  const getWeek = (day) => {
    return Math.ceil(day / 7);
  };

  //use this to avoid the infinite loop
  useEffect(() => {
    setSoldKilo(soldKiloState);
    setSoldQty(soldQtyState);
    setTotalIncome(totalIncomeState);
    setTotalSales(totalSalesState);
  }, [
    soldKiloState,
    totalIncomeState,
    totalSalesState,
    soldQtyState,
    setSoldKilo,
    setSoldQty,
    setTotalIncome,
    setTotalSales,
  ]);

  const handleFormatData = useCallback((sale) => {
    const date = new Date(sale.createdAt);
    return {
      ...sale,
      income: handleIncome(sale, sale?.product?.isPerKilo),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      week: getWeek(date.getDate()),
    };
  }, []);

  const handleGetMonths = useCallback((_sales) => {
    const _months = new Set(_sales.map(({ month }) => month));
    const sortedMonths = Array.from(_months).sort((a, b) => b - a);
    return sortedMonths;
  }, []);

  const computeTotalSalesAndIncome = useCallback(
    (_sales) => {
      const totalIncome = _sales.reduce(
        (accumulator, currentValue) => accumulator + currentValue?.income,
        0
      );

      const totalSales = _sales.reduce((accumulator, currentValue) => {
        if (isTransaction || isEmployees) {
          return (accumulator += currentValue.total);
        }
        return (accumulator += currentValue.srp * currentValue.sold);
      }, 0);
      return { income: totalIncome, sales: totalSales };
    },
    [isTransaction, isEmployees]
  );

  useEffect(() => {
    const _years = new Set(
      collections.map(({ createdAt }) => new Date(createdAt).getFullYear())
    );
    const sortedYears = Array.from(_years).sort((a, b) => b - a);
    const salesWithoutFiltered = collections.map((sale) => {
      return handleFormatData(sale);
    });

    setYears(sortedYears);
    setSales(salesWithoutFiltered);
  }, [collections, handleFormatData]);

  const handleIncome = (sale, isPerKilo) => {
    const { kilo, quantity, capital, srp } = sale;
    return isPerKilo
      ? srp * kilo - capital * kilo
      : srp * quantity - capital * quantity;
  };

  const handleGetSold = useCallback((_sales) => {
    const _soldQty = _sales.reduce((acc, curr) => {
      acc += curr.soldQty;
      return acc;
    }, 0);

    const _soldKilo = _sales.reduce((acc, curr) => {
      acc += curr.soldKilo;
      return acc;
    }, 0);

    return { _soldKilo, _soldQty };
  }, []);

  const handleChangeSales = useCallback(
    (data, _params, isMonth) => {
      //use this to get the months in the year what we choose this is based on the main array
      const years = sales.filter(({ year }) => year === _params.year);
      var arrangeSales = [];

      if (isTransaction || isEmployees) {
        arrangeSales = isTransaction ? data : arrangeBy.employees(data);
      } else {
        arrangeSales = arrangeBy.sales(data);
      }

      const _months = handleGetMonths(years);

      if (isMonth) {
        const _days = new Set(data.map(({ day }) => day));
        const sortedDays = Array.from(_days).sort((a, b) => b - a);
        const _weeks = new Set(data.map(({ week }) => week));
        const sortedWeeks = Array.from(_weeks).sort((a, b) => b - a);
        setDays(sortedDays);
        setWeeks(sortedWeeks);
      }

      if (!isEmployees || !isTransaction) {
        const { sales: totalSales, income: totalIncome } =
          computeTotalSalesAndIncome(arrangeSales);
        const { _soldKilo = 0, _soldQty = 0 } = handleGetSold(arrangeSales);
        setSoldKiloState(_soldKilo);
        setSoldQtyState(_soldQty);
        setTotalSalesState(totalSales);
        setTotalIncomeState(totalIncome);
      }
      setMonths(_months);
      setFilteredData(arrangeSales);
    },
    [
      computeTotalSalesAndIncome,
      handleGetMonths,
      handleGetSold,
      setSoldKiloState,
      setSoldQtyState,
      setTotalIncomeState,
      setTotalSalesState,
      setFilteredData,
      sales,
      isTransaction,
      isEmployees,
    ]
  );

  const resetParams = useCallback((name) => {
    setParams((prev) => ({
      ...prev,
      month: 0,
      week: 0,
      day: 0,
      [name || "key"]: "",
    }));
  }, []);

  //for filtering the year months days weeks
  useEffect(() => {
    var filteredData = [];
    if (params.year && !params.month) {
      filteredData = sales.filter(({ year }) => year === params.year);
      handleChangeSales(filteredData, params);

      if (params.option) {
        setParams((prev) => ({
          year: prev.year,
          month: 0,
          week: 0,
          day: 0,
          option: "",
        }));
      }
    }

    if (params.year && params.month) {
      filteredData = sales.filter(
        ({ year, month }) => year === params.year && month === params.month
      );

      handleChangeSales(filteredData, params, true);

      if (filteredData.length === 0) resetParams();

      if (params[params.option]) {
        //params.option = week || day
        filteredData = sales.filter(
          (sale) =>
            sale.year === params.year &&
            sale.month === params.month &&
            sale[params.option] === params[params.option]
        );
        handleChangeSales(filteredData, params, false);

        if (filteredData.length === 0) {
          setParams((prev) => ({
            ...prev,
            week: 0,
            day: 0,
          }));
        }
      }
    }
  }, [params, sales, resetParams, handleChangeSales]);

  const handleRemoveOption = () => setParams({ ...params, option: "" });
  const isSales = !isEmployees && !isTransaction;
  return (
    <MDBRow className={`d-flex align-items-center mb-${mb}`}>
      <MDBCol md={isSales ? "2" : "3"} className="d-flex align-items-center">
        <MDBIcon
          icon="newspaper"
          size="2x"
          className="mt-2 mr-2"
          style={{ color: "blue" }}
        />{" "}
        <h4 className={`mt-3 ${isSales ? "font-weight-bolder" : ""}`}>
          {title} Report
        </h4>
      </MDBCol>
      <MDBCol md={isSales ? "10" : "9"} className="d-flex align-items-center ">
        <label className="w-25">
          <span className="ml-1 text-primary font-weight-bold">Year</span>
          <select
            className="form-control mr-3 custom-select"
            value={String(params.year)}
            onChange={({ target }) =>
              setParams({ ...params, year: Number(target.value) })
            }
          >
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <label className="w-25 ml-3">
          <span className="ml-1 text-primary font-weight-bold">Month</span>
          <select
            className="form-control custom-select"
            value={String(params.month)}
            onChange={({ target }) =>
              setParams({ ...params, month: Number(target.value) })
            }
          >
            <option>Choose a month</option>
            {months.map((month, index) => (
              <option key={index} value={month}>
                {MONTHS[month - 1]}
              </option>
            ))}
          </select>
        </label>

        {params.option === "day" ? (
          <div className="close-container">
            <label className="w-25 ml-3">
              <span className="ml-1 text-primary">Day</span>
              <select
                className="form-control custom-select"
                style={{ width: "160px" }}
                value={String(params.day)}
                onChange={({ target }) =>
                  setParams({ ...params, day: Number(target.value) })
                }
              >
                <option>Choose a day</option>
                {days.map((day, index) => (
                  <option key={index} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <MDBIcon
                icon="times"
                className="remove-option"
                onClick={handleRemoveOption}
              />
            </label>
          </div>
        ) : (
          ""
        )}

        {params.option === "week" ? (
          <div className="close-container">
            <label className="w-25 ml-3">
              <span className="ml-1 text-primary font-weight-bold">Week</span>
              <select
                className="form-control custom-select"
                style={{ width: "165px" }}
                value={String(params.week)}
                onChange={({ target }) =>
                  setParams({ ...params, week: Number(target.value) })
                }
              >
                <option>Choose a week</option>
                {weeks.map((week, index) => (
                  <option key={index} value={week}>
                    {week}
                  </option>
                ))}
              </select>
              <MDBIcon
                icon="times"
                className="remove-option"
                onClick={handleRemoveOption}
              />
            </label>
          </div>
        ) : (
          ""
        )}
        {!params.option && params.month ? (
          <select
            className="form-control custom-select  ml-3 mt-3"
            style={{ width: "160px" }}
            value={params.option}
            onChange={({ target }) =>
              setParams({ ...params, option: target.value })
            }
          >
            <option value={""}>Other Options..</option>
            <option value={"week"}>Week</option>
            <option value={"day"}>Day</option>
          </select>
        ) : (
          ""
        )}
      </MDBCol>
    </MDBRow>
  );
};
