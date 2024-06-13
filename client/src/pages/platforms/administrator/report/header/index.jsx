import React, { useCallback, useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBIcon,
  MDBRow,
  MDBTypography,
} from "mdbreact";
import "./header.css";

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
  setFilteredData,
  isTransaction = false,
  isEmployees = false,
  title = "",
}) => {
  const [params, setParams] = useState({
    year: 2024,
    month: 0,
    week: 0,
    day: 0,
  });
  const [sales, setSales] = useState([]);
  const [years, setYears] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [months, setMonths] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [days, setDays] = useState([]);

  const getWeek = (day) => {
    if (day >= 1 && day <= 7) {
      return 1;
    } else if (day >= 8 && day <= 14) {
      return 2;
    } else if (day >= 9 && day <= 21) {
      return 3;
    } else {
      return 4;
    }
  };

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
  }, [collections, handleFormatData, handleGetMonths]);

  const handleIncome = (sale, isPerKilo) => {
    const { kilo, quantity, capital, srp } = sale;
    return isPerKilo
      ? srp * kilo - capital * kilo
      : srp * quantity - capital * quantity;
  };

  const handleChangeSales = useCallback(
    (data, isMonth) => {
      //use this to get the months in the year what we choose this is based on the main array
      const filteredData = sales.filter(({ year }) => year === params.year);
      //arrange the sales
      var arrangeSales = [];
      if (isTransaction) {
        arrangeSales = data;
      } else if (isEmployees) {
        arrangeSales = data //this is for the employees report arrange by transaction
          .reduce((accumulator, currentValue) => {
            const { cashier, total } = currentValue;
            const key = `${cashier._id}`;
            const index = accumulator?.findIndex((accu) => accu.key === key);
            if (index > -1) {
              accumulator[index].transactionsHandle += 1;
              accumulator[index].total += total;
            } else {
              accumulator.push({
                ...currentValue,
                key,
                transactionsHandle: 1,
                total,
              });
            }
            return accumulator;
          }, [])
          .sort((a, b) => b.transactionsHandle - a.transactionsHandle);
      } else {
        arrangeSales = data //this is for the sales i arranged the data by the product then sort this into the sold
          .reduce((accumulator, currentValue) => {
            const { product, variant1, variant2, quantity, kilo, income } =
              currentValue;
            const key = `${product._id}-${variant1}-${variant2}`;
            const index = accumulator?.findIndex((accu) => accu.key === key);
            if (index > -1) {
              accumulator[index].sold += quantity || kilo;
              accumulator[index].income += income;
            } else {
              accumulator.push({
                ...currentValue,
                key,
                sold: quantity || kilo,
              });
            }
            return accumulator;
          }, [])
          .sort((a, b) => b.sold - a.sold);
      }

      const _months = handleGetMonths(filteredData);
      const { sales: totalSales, income: totalIncome } =
        computeTotalSalesAndIncome(arrangeSales);

      if (isMonth) {
        const _days = new Set(data.map(({ day }) => day));
        const sortedDays = Array.from(_days).sort((a, b) => b - a);
        const _weeks = new Set(data.map(({ week }) => week));
        const sortedWeeks = Array.from(_weeks).sort((a, b) => b - a);
        setDays(sortedDays);
        setWeeks(sortedWeeks);
      }
      setTotalSales(totalSales);
      setTotalIncome(totalIncome);
      setFilteredData(arrangeSales);
      setMonths(_months);
    },
    [
      computeTotalSalesAndIncome,
      handleGetMonths,
      sales,
      isTransaction,
      params,
      setFilteredData,
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

  useEffect(() => {
    var filteredData = [];
    if (params.year && !params.month) {
      filteredData = sales.filter(({ year }) => year === params.year);
      handleChangeSales(filteredData);

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

      handleChangeSales(filteredData, true);

      if (filteredData.length === 0) resetParams();

      if (params[params.option]) {
        //params.option = week || day
        filteredData = sales.filter(
          (sale) =>
            sale.year === params.year &&
            sale.month === params.month &&
            sale[params.option] === params[params.option]
        );
        handleChangeSales(filteredData, false);

        if (filteredData.length === 0) {
          setParams((prev) => ({
            ...prev,
            week: 0,
            day: 0,
          }));
        }
      }
    }
  }, [
    params,
    sales,
    resetParams,
    handleGetMonths,
    computeTotalSalesAndIncome,
    handleChangeSales,
  ]);

  const handleRemoveOption = () => setParams({ ...params, option: "" });

  const handleWeekShow = () => {
    switch (params.week) {
      case 1:
        return "1st Week";
      case 2:
        return "2nd Week";
      case 3:
        return "3rd Week";
      default:
        return "4th Week";
    }
  };

  const handleTitleReport = () => {
    if (params.week && params.option === "week") {
      return `${handleWeekShow()} of ${MONTHS[params.month - 1]}, ${
        params.year
      }`;
    } else if (params.day && params.option === "day") {
      return ` ${MONTHS[params.month - 1]} ${params.day} ,${params.year}`;
    } else if (params.month && !params[params.option]) {
      return ` ${MONTHS[params.month - 1]}, ${params.year}`;
    } else if (params.year && !params.month && !params[params.option]) {
      return `${params.year}`;
    }
  };

  const isShowIncome = isEmployees || isTransaction;
  return (
    <MDBCard>
      <MDBCardBody className="sales-report-body">
        <h4 className="text-nowrap mr-3 mt-1 text-center font-weight-bold">
          {title} Report
        </h4>
        <MDBRow className=" ml-2 mt-0  ">
          <MDBCol
            md="12"
            className="d-flex align-items-center justify-content-center "
          >
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
                  <span className="ml-1 text-primary font-weight-bold">
                    Week
                  </span>
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
        <hr />
        <div className="d-flex mt-2 mb-3 justify-content-around ">
          <MDBTypography
            className="mb-0 text-black-80 ml-1 w-25 text-center"
            noteColor="success"
            colorText="grey"
            note
            noteTitle="Report On:"
          >
            &nbsp;{handleTitleReport()}
          </MDBTypography>

          <MDBTypography
            className="mb-0 text-black-80 ml-1 w-25 text-center"
            noteColor="danger"
            note
            noteTitle="Total Sales:"
          >
            &nbsp; ₱{totalSales}
          </MDBTypography>
          {!isShowIncome && (
            <MDBTypography
              className="mb-0 text-black-80 ml-1 w-25 text-center"
              noteColor="danger"
              note
              noteTitle="Total Income:"
            >
              &nbsp; ₱{totalIncome}
            </MDBTypography>
          )}
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};
