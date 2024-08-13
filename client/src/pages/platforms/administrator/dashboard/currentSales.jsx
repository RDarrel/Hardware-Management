import React, { useCallback, useEffect, useState } from "react";
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBIcon,
  MDBProgress,
} from "mdbreact";
import formattedTotal from "../../../../services/utilities/forattedTotal";

function CurrentSales({ sales }) {
  const [totalYearlySales, setTotalYearlySales] = useState(0),
    [totalLastYearlySales, setTotalLastYearlySales] = useState(0),
    [yearlyDifferenceSale, setYearlyDifferenceSale] = useState(0),
    [totalMonthlySales, setTotalMonthlySales] = useState(0),
    [totalLastMonthlySales, setTotalLastMonthlySales] = useState(0),
    [monthlyDifferenceSale, setMonthlyDifferenceSale] = useState(0),
    [totalWeeklySales, setTotalWeeklySales] = useState(0),
    [totalLastWeeklySales, setTotalLastWeeklySales] = useState(0),
    [weeklyDifferenceSale, setWeeklyDifferenceSale] = useState(0),
    [totalDailySales, setTotalDailySales] = useState(0),
    [totalLastDailySales, setTotalLastDailySales] = useState(0),
    [dailyDifferenceSale, setDailyDifferenceSale] = useState(0);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const currentYear = currentDate.getFullYear();

  const currentMonth = currentDate.getMonth() + 1; // 1-based month (1 = January, 2 = February, etc.)
  const currentDay = currentDate.getDate();
  const currentWeekDay = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)

  // Calculate last month and last month year
  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const currentWeekStart = new Date(currentDate);
  currentWeekStart.setDate(currentDate.getDate() - currentWeekDay);
  currentWeekStart.setHours(0, 0, 0, 0);
  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
  currentWeekEnd.setHours(23, 59, 59, 999);

  // Calculate last week start and end dates
  const lastWeekStart = new Date(currentWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  lastWeekStart.setHours(0, 0, 0, 0);
  const lastWeekEnd = new Date(currentWeekStart);
  lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
  lastWeekEnd.setHours(23, 59, 59, 999);

  let lastWeekYesterday = new Date(currentDate);
  lastWeekYesterday.setDate(lastWeekYesterday.getDate() - 1);
  // if (currentWeekDay === 0) {
  //   lastWeekYesterday.setDate(currentWeekStart.getDate() - 1);
  //   lastWeekYesterday.setHours(0, 0, 0, 0);
  // }

  const filterdYearlySales = useCallback(
    (_sales, isCurrent = true) => {
      const targetYear = isCurrent ? currentYear : currentYear - 1;
      return _sales?.filter(({ createdAt }) => {
        const saleDate = new Date(createdAt);
        saleDate.setHours(0, 0, 0, 0);
        return saleDate.getFullYear() === targetYear;
      });
    },
    [currentYear]
  );

  const filterdWeeklySales = useCallback(
    (_sales, isCurrent = true) => {
      const weekStart = isCurrent ? currentWeekStart : lastWeekStart;
      const weekEnd = isCurrent ? currentWeekEnd : lastWeekEnd;
      return _sales.filter(({ createdAt }) => {
        const saleDate = new Date(createdAt);
        saleDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
        return saleDate >= weekStart && saleDate <= weekEnd;
      });
    },
    [currentWeekStart, lastWeekStart, currentWeekEnd, lastWeekEnd]
  );

  const filteredDailySales = useCallback(
    (_sales, isCurrent = true) => {
      const day = isCurrent ? currentDate : lastWeekYesterday;
      return _sales.filter(({ createdAt }) => {
        const saleDate = new Date(createdAt);
        saleDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
        return saleDate.toDateString() === day.toDateString();
      });
    },
    [currentDate, lastWeekYesterday]
  );

  const filtereMonthlySales = useCallback(
    (_sales, isCurrent = true) => {
      const targetYear = isCurrent ? currentYear : lastMonthYear;
      const targetMonth = isCurrent ? currentMonth : lastMonth;
      const targetDay = isCurrent ? currentDay : 1; // If not current, default to 1st day
      // if not current the saleDate.getDate() is not belong
      return _sales?.filter(({ createdAt }) => {
        const saleDate = new Date(createdAt);
        saleDate.setHours(0, 0, 0, 0);
        return (
          saleDate.getFullYear() === targetYear &&
          saleDate.getMonth() + 1 === targetMonth &&
          saleDate.getDate() <= targetDay
        );
      });
    },
    [currentYear, currentMonth, currentDay, lastMonthYear, lastMonth]
  );

  const computeTotalSales = useCallback((_sales) => {
    return _sales?.reduce((acc, curr) => {
      const { product, kilo = 0, quantity = 0, srp } = curr;
      acc += product.isPerKilo ? kilo * srp : quantity * srp;
      return acc;
    }, 0);
  }, []);

  useEffect(() => {
    if (sales.length > 0) {
      const currentYearSales = filterdYearlySales(sales);
      const lastYearSales = filterdYearlySales(sales, false);
      const _totalYearlySale = computeTotalSales(currentYearSales);
      const _totalLastYearSale = computeTotalSales(lastYearSales);

      const currentMonthSales = filtereMonthlySales(sales);
      const lastMonthSales = filtereMonthlySales(sales, false);
      const _totalMonthlySale = computeTotalSales(currentMonthSales);
      const _totalLastMonthSale = computeTotalSales(lastMonthSales);

      const currentWeekSales = filterdWeeklySales(sales);
      const lastWeekSales = filterdWeeklySales(sales, false);
      const _totalWeeklySale = computeTotalSales(currentWeekSales);
      const _totalLastWeeklySale = computeTotalSales(lastWeekSales);
      const yesterdaySales = filteredDailySales(sales, false);
      const currentDaySales = filteredDailySales(sales);

      const _totalLastDailySale = computeTotalSales(yesterdaySales);
      const _totalDailySale = computeTotalSales(currentDaySales);

      setTotalYearlySales(_totalYearlySale);
      setTotalLastYearlySales(_totalLastYearSale);
      setTotalMonthlySales(_totalMonthlySale);
      setTotalLastMonthlySales(_totalLastMonthSale);
      setTotalLastWeeklySales(_totalLastWeeklySale);
      setTotalWeeklySales(_totalWeeklySale);
      setTotalDailySales(_totalDailySale);
      setTotalLastDailySales(_totalLastDailySale);
    }
  }, [
    sales,
    filterdWeeklySales,
    filterdYearlySales,
    filteredDailySales,
    filtereMonthlySales,
    computeTotalSales,
  ]);

  const getDiffPercentage = useCallback((current, last) => {
    if (last > 0) {
      const diff = current - last;
      const result = Math.abs((diff / last) * 100);
      const wholeResult = Math.floor(result);

      return Math.min(wholeResult, 100);
    } else {
      return 100;
    }
  }, []);

  useEffect(() => {
    setYearlyDifferenceSale(
      getDiffPercentage(totalYearlySales, totalLastYearlySales)
    );
    setMonthlyDifferenceSale(
      getDiffPercentage(totalMonthlySales, totalLastMonthlySales)
    );
    setWeeklyDifferenceSale(
      getDiffPercentage(totalWeeklySales, totalLastWeeklySales)
    );

    setDailyDifferenceSale(
      getDiffPercentage(totalDailySales, totalLastDailySales)
    );
  }, [
    totalYearlySales,
    totalLastYearlySales,
    totalMonthlySales,
    totalLastMonthlySales,
    totalWeeklySales,
    totalLastWeeklySales,
    totalDailySales,
    totalLastDailySales,
    getDiffPercentage,
  ]);

  const currentYearIsBetter = totalYearlySales > totalLastYearlySales;
  const currentMonthIsBetter = totalMonthlySales > totalLastMonthlySales;
  const currentWeekIsBetter = totalWeeklySales > totalLastWeeklySales;
  const currentDayISBetter = totalDailySales > totalLastDailySales;

  return (
    <section className="mt-2">
      <MDBRow>
        <MDBCol xl="3" md="6" className="mb-4">
          <MDBCard>
            <MDBCardHeader color="primary-color">Yearly Sales</MDBCardHeader>
            <h6 className="ml-4 mt-5 dark-grey-text font-weight-bold">
              <MDBIcon
                icon={`long-arrow-alt-${currentYearIsBetter ? "up" : "down"}`}
                className="blue-text mr-3"
              />
              ₱{formattedTotal(totalYearlySales || 0)}
            </h6>
            <MDBCardBody>
              <MDBProgress
                value={yearlyDifferenceSale}
                barClassName="grey darken-2"
              />
              <p className="font-small grey-text text-nowrap">
                {currentYearIsBetter ? "Better" : "Worse"} than last year (
                {yearlyDifferenceSale}%)
              </p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol xl="3" md="6" className="mb-4">
          <MDBCard>
            <MDBCardHeader color="warning-color">Monthly Sales</MDBCardHeader>
            <h6 className="ml-4 mt-5 dark-grey-text font-weight-bold">
              <MDBIcon
                icon={`long-arrow-alt-${currentMonthIsBetter ? "up" : "down"}`}
                className="blue-text mr-3"
              />
              ₱{formattedTotal(totalMonthlySales || 0)}
            </h6>
            <MDBCardBody>
              <MDBProgress
                value={monthlyDifferenceSale}
                barClassName="grey darken-2"
              />
              <p className="font-small grey-text text-nowrap">
                {currentMonthIsBetter ? "Better" : "Worse"} than last month (
                {monthlyDifferenceSale}%)
              </p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol xl="3" md="6" className="mb-4">
          <MDBCard>
            <MDBCardHeader color="info-color">Weekly Sales</MDBCardHeader>
            <h6 className="ml-4 mt-5 dark-grey-text font-weight-bold">
              <MDBIcon
                icon={`long-arrow-alt-${currentWeekIsBetter ? "up" : "down"}`}
                className="red-text mr-3"
              />
              ₱{formattedTotal(totalWeeklySales || 0)}
            </h6>
            <MDBCardBody>
              <MDBProgress
                value={weeklyDifferenceSale}
                barClassName="grey darken-2"
              />
              <p className="font-small grey-text">
                {currentWeekIsBetter ? "Better" : "Worse"} than last week (
                {weeklyDifferenceSale}%)
              </p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol xl="3" md="6" className="mb-4">
          <MDBCard>
            <MDBCardHeader color="danger-color">Daily Sales</MDBCardHeader>
            <h6 className="ml-4 mt-5 dark-grey-text font-weight-bold">
              <MDBIcon
                icon={`long-arrow-alt-${currentDayISBetter ? "up" : "down"}`}
                className="red-text mr-3"
              />{" "}
              ₱{formattedTotal(totalDailySales || 0)}
            </h6>
            <MDBCardBody>
              <MDBProgress
                value={dailyDifferenceSale}
                barClassName="grey darken-2"
              />
              <p className="font-small grey-text">
                {currentDayISBetter ? "Better" : "Worse"} than yesterday (
                {dailyDifferenceSale}%)
              </p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </section>
  );
}

export default CurrentSales;
