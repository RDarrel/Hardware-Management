import React, { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBView,
  MDBBadge,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
} from "mdbreact";
import { Bar } from "react-chartjs-2";
import { Header } from "../report/header";

const Graph = ({ products }) => {
  const [filteredData, setFilteredData] = useState([]),
    [monthlyData, setMonthlyData] = useState([]),
    [usingDateRange, setUsingDateRange] = useState(false),
    [fromRange, setFromRange] = useState(new Date()),
    [toRange, setToRange] = useState(new Date()),
    [range, setRange] = useState("");

  useEffect(() => {
    if (range) {
      const currentDate = new Date();
      const from = new Date(currentDate);
      const to = new Date(currentDate);
      switch (range) {
        case "yesterday":
          console.log("true");
          from.setDate(from.getDate() - 1);
          to.setDate(to.getDate() - 1);
          break;
        case "last 7 days":
          from.setDate(from.getDate() - 6);
          break;
        case "last 30 days":
          from.setDate(from.getDate() - 29);
          break;
        case "last week":
          from.setDate(from.getDate() - 7);
          to.setDate(to.getDate() - 1);

          break;

        case "last month":
          from.setMonth(from.getMonth() - 1);
          to.setDate(to.getDate() - 1);

          break;
        default:
          break;
      }
      const filteredProducts = products.filter(({ createdAt }) => {
        const productDate = new Date(createdAt);
        return productDate >= from && productDate <= to;
      });

      let oldestProduct = null;
      filteredProducts.forEach((product) => {
        const productDate = new Date(product.createdAt);
        if (!oldestProduct || productDate < new Date(oldestProduct.createdAt)) {
          oldestProduct = { ...product, createdAt: productDate };
        }
      });

      setFromRange(oldestProduct?.createdAt || from);
      setToRange(to || new Date());
      setUsingDateRange(true);
    }
  }, [range, products]);

  useEffect(() => {
    if (filteredData.length > 0) {
      const monthlySales = {};

      filteredData.forEach(
        ({ createdAt, soldKilo, soldQty, srp, product, income }) => {
          const { isPerKilo = false } = product;
          const saleDate = new Date(createdAt);
          const month = saleDate.toLocaleString("default", { month: "long" });

          const totalSales = isPerKilo ? soldKilo * srp : srp * soldQty;

          if (!monthlySales[month]) {
            monthlySales[month] = {
              totalSales: 0,
              income: 0,
            };
          }
          monthlySales[month].totalSales += totalSales;
          monthlySales[month].income += income;
        }
      );

      const monthlyChartData = Object.keys(monthlySales).map((month) => ({
        month,
        totalSales: monthlySales[month].totalSales,
        income: monthlySales[month].income,
      }));

      setMonthlyData(monthlyChartData);
    }
  }, [filteredData]);

  const barChartData = {
    labels: monthlyData.map((data) => data.month),
    datasets: [
      {
        label: "Total Sales",
        data: monthlyData.map((data) => data.totalSales),
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Light Green
        borderColor: "rgba(75, 192, 192, 1)", // Dark Green
        borderWidth: 1,
      },
      {
        label: "Income",
        data: monthlyData.map((data) => data.income),
        backgroundColor: "rgba(255, 159, 64, 0.2)", // Light Orange
        borderColor: "rgba(255, 159, 64, 1)", // Dark Orange
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      xAxes: [
        {
          barPercentage: 0.8,
          gridLines: {
            display: true,
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            fontColor: "#7e8591",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: true,
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            beginAtZero: true,
            min: 0,
            fontColor: "#7e8591",
            callback: function (value) {
              return `₱ ${value.toLocaleString()}`; // Format y-axis labels with commas
            },
          },
        },
      ],
    },
    legend: {
      labels: {
        fontColor: "#7e8591",
        fontSize: 16,
      },
    },
  };

  return (
    <section className="mb-5">
      <MDBCard cascade narrow>
        <MDBRow>
          <MDBCol xl="5" md="12" className="mr-0">
            <MDBView
              cascade
              className="gradient-card-header light-blue lighten-1"
            >
              <h4 className="h4-responsive mb-0 font-weight-bold">Traffic</h4>
            </MDBView>
            <MDBCardBody cascade className="pb-3">
              <MDBRow className="pt-3 card-body">
                <MDBCol md="12">
                  <h4>
                    <MDBBadge className="big-badge light-blue lighten-1">
                      Data range
                    </MDBBadge>
                  </h4>
                  <MDBSelect getValue={(value) => setRange(value[0])}>
                    <MDBSelectInput selected="Choose time period" />
                    <MDBSelectOptions>
                      <MDBSelectOption disabled>
                        Choose time period
                      </MDBSelectOption>
                      <MDBSelectOption value="today">Today</MDBSelectOption>
                      <MDBSelectOption value="yesterday">
                        Yesterday
                      </MDBSelectOption>
                      <MDBSelectOption value="last 7 days">
                        Last 7 days
                      </MDBSelectOption>
                      <MDBSelectOption value="last 30 days">
                        Last 30 days
                      </MDBSelectOption>
                      <MDBSelectOption value="last week">
                        Last week
                      </MDBSelectOption>
                      <MDBSelectOption value="last month">
                        Last month
                      </MDBSelectOption>
                    </MDBSelectOptions>
                  </MDBSelect>
                  <h5>
                    <MDBBadge className="big-badge light-blue lighten-1">
                      Custom date
                    </MDBBadge>
                  </h5>
                  <br />
                  <div className="mb-1">
                    <Header
                      usingDateRange={usingDateRange}
                      setUsingDateRange={setUsingDateRange}
                      fromRange={fromRange}
                      toRange={toRange}
                      collections={products}
                      setFilteredData={setFilteredData}
                      isDashBoard={true}
                    />
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCol>
          <MDBCol md="12" xl="7">
            <MDBView cascade className="gradient-card-header white">
              <Bar data={barChartData} options={barChartOptions} height={150} />
            </MDBView>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </section>
  );
};

export default Graph;
