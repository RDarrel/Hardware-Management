import React, { useEffect } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
  MDBIcon,
  MDBBadge,
  MDBProgress,
  MDBBtn,
  MDBTable,
  MDBView,
  MDBDatePicker,
} from "mdbreact";
import { Bar } from "react-chartjs-2";
import Total from "./total";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../services/redux/slices/administrator/adminDashboard";
import TopSellingProducts from "./topSellingProducts";

const barChartData = {
  labels: ["January", "February", "March", "April", "May"],
  datasets: [
    {
      label: "Sales",
      data: [100, 19, 3, 5, 2],
      backgroundColor: [
        "rgba(75, 192, 192, 0.2)", // Light Green
        "rgba(75, 192, 192, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(75, 192, 192, 0.2)",
      ],
      borderColor: [
        "rgba(75, 192, 192, 1)", // Dark Green
        "rgba(75, 192, 192, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(75, 192, 192, 1)",
      ],
      borderWidth: 1,
    },
    {
      label: "Income",
      data: [12, 19, 3, 5, 2],
      backgroundColor: [
        "rgba(255, 159, 64, 0.2)", // Light Orange
        "rgba(255, 159, 64, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 159, 64, 1)", // Dark Orange
        "rgba(255, 159, 64, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(255, 159, 64, 1)",
      ],
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
        barPercentage: 1,
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

const Dashboard = () => {
  const { token } = useSelector(({ auth }) => auth),
    { sales, topSellingProducts } = useSelector(
      ({ adminDashboard }) => adminDashboard
    ),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [dispatch, token]);

  return (
    <MDBContainer fluid id="v6" className="mb-5">
      <Total sales={sales} />
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
                    <MDBSelect>
                      <MDBSelectInput selected="Choose time period" />
                      <MDBSelectOptions>
                        <MDBSelectOption disabled>
                          Choose time period
                        </MDBSelectOption>
                        <MDBSelectOption value="1">Today</MDBSelectOption>
                        <MDBSelectOption value="2">Yesterday</MDBSelectOption>
                        <MDBSelectOption value="3">Last 7 days</MDBSelectOption>
                        <MDBSelectOption value="4">
                          Last 30 days
                        </MDBSelectOption>
                        <MDBSelectOption value="5">Last week</MDBSelectOption>
                        <MDBSelectOption value="6">Last month</MDBSelectOption>
                      </MDBSelectOptions>
                    </MDBSelect>
                    <h5>
                      <MDBBadge className="big-badge light-blue lighten-1">
                        Custom date
                      </MDBBadge>
                    </h5>
                    <br />
                    <div className="mb-1">
                      <MDBRow>
                        <MDBCol size="6">
                          <small className="grey-text">from:</small>
                          <MDBDatePicker className="my-0 d-inline ml-3" />
                        </MDBCol>
                        <MDBCol size="6">
                          <small className="grey-text">to:</small>
                          <MDBDatePicker className="my-0 d-inline ml-3" />
                        </MDBCol>
                      </MDBRow>
                    </div>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCol>
            <MDBCol md="12" xl="7">
              <MDBView cascade className="gradient-card-header white">
                <Bar
                  data={barChartData}
                  options={barChartOptions}
                  height={150}
                />
              </MDBView>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </section>
      <TopSellingProducts products={topSellingProducts} />
      <section className="mt-2">
        <MDBRow>
          <MDBCol xl="3" md="6" className="mb-4">
            <MDBCard>
              <MDBCardHeader color="primary-color">Orders</MDBCardHeader>
              <h6 className="ml-4 mt-5 dark-grey-text font-weight-bold">
                <MDBIcon icon="long-arrow-alt-up" className="blue-text mr-3" />{" "}
                2000
              </h6>
              <MDBCardBody>
                <MDBProgress value={45} barClassName="grey darken-2" />
                <p className="font-small grey-text">
                  Better than last week (25%)
                </p>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol xl="3" md="6" className="mb-4">
            <MDBCard>
              <MDBCardHeader color="warning-color">Monthly Sales</MDBCardHeader>
              <h6 className="ml-4 mt-5 dark-grey-text font-weight-bold">
                <MDBIcon icon="long-arrow-alt-up" className="blue-text mr-3" />$
                2000
              </h6>
              <MDBCardBody>
                <MDBProgress value={45} barClassName="grey darken-2" />
                <p className="font-small grey-text">
                  Better than last week (25%)
                </p>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol xl="3" md="6" className="mb-4">
            <MDBCard>
              <MDBCardHeader color="info-color">Sales</MDBCardHeader>
              <h6 className="ml-4 mt-5 dark-grey-text font-weight-bold">
                <MDBIcon icon="long-arrow-alt-down" className="red-text mr-3" />
                $ 2000
              </h6>
              <MDBCardBody>
                <MDBProgress value={45} barClassName="grey darken-2" />
                <p className="font-small grey-text">
                  Better than last week (25%)
                </p>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol xl="3" md="6" className="mb-4">
            <MDBCard>
              <MDBCardHeader color="danger-color">Daily Sales</MDBCardHeader>
              <h6 className="ml-4 mt-5 dark-grey-text font-weight-bold">
                <MDBIcon icon="long-arrow-alt-down" className="red-text mr-3" />
                $ 2000
              </h6>
              <MDBCardBody>
                <MDBProgress value={45} barClassName="grey darken-2" />
                <p className="font-small grey-text">
                  Better than last week (25%)
                </p>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </section>
      <section>
        <MDBRow>
          <MDBCol xl="5" md="12">
            <MDBCard className="mb-4">
              <MDBRow>
                <MDBCol md="12" className="text-center">
                  <h5 className="mt-4 mb-4 font-weight-bold">Monthly Sales</h5>
                </MDBCol>
              </MDBRow>
              <MDBCardBody>
                <MDBProgress
                  className="mb-2 mt-1"
                  value={25}
                  barClassName="warning-color"
                />
                <p className="font-small grey-text mb-4">January</p>
                <MDBProgress
                  className="mb-2"
                  value={35}
                  barClassName="red accent-2"
                />
                <p className="font-small grey-text mb-4">Febuary</p>
                <MDBProgress
                  className="mb-2"
                  value={85}
                  barClassName="primary-color"
                />
                <p className="font-small grey-text mb-4">Febuary</p>
                <MDBProgress
                  className="mb-2"
                  value={70}
                  barClassName="light-blue lighten-1"
                />
                <p className="font-small grey-text mb-4">Febuary</p>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol xl="3" md="6" className="mb-2">
            <MDBCard>
              <MDBRow className="mt-4 mb-3">
                <MDBCol md="3" col="3" className="text-left pl-4">
                  <a className="p-2 m-2 fa-lg fb-ic" href="!#">
                    <MDBIcon
                      fab
                      icon="facebook"
                      size="2x"
                      className="blue-text"
                    />
                  </a>
                </MDBCol>
                <MDBCol md="9" col="9" className="text-right pr-5">
                  <p className="font-small grey-text mb-1">Facebook Users</p>
                  <h5 className="ml-4 mb-2 font-weight-bold">4,567 </h5>
                </MDBCol>
              </MDBRow>
            </MDBCard>

            <MDBCard className="mt-4">
              <MDBRow className="mt-4 mb-3">
                <MDBCol md="3" col="3" className="text-left pl-4">
                  <a className="p-2 m-2 fa-lg fb-ic" href="!#">
                    <MDBIcon
                      fab
                      icon="google-plus"
                      size="2x"
                      className="red-text"
                    />
                  </a>
                </MDBCol>
                <MDBCol md="9" col="9" className="text-right pr-5">
                  <p className="font-small grey-text mb-1">Google+ Users</p>
                  <h5 className="ml-4 mb-2 font-weight-bold">2,669 </h5>
                </MDBCol>
              </MDBRow>
            </MDBCard>

            <MDBCard className="mt-4 mb-4">
              <MDBRow className="mt-4 mb-3">
                <MDBCol md="3" col="3" className="text-left pl-4">
                  <a className="p-2 m-2 fa-lg fb-ic" href="!#">
                    <MDBIcon
                      fab
                      icon="facebook"
                      size="2x"
                      className="cyan-text"
                    />
                  </a>
                </MDBCol>
                <MDBCol md="9" col="9" className="text-right pr-5">
                  <p className="font-small grey-text mb-1">Twitter Users</p>
                  <h5 className="ml-4 mb-2 font-weight-bold">3,562 </h5>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>

          <MDBCol xl="4" md="6" className="mb-2">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBTable responsive>
                  <thead>
                    <tr>
                      <th className="font-weight-bold dark-grey-text">
                        <strong>Month</strong>
                      </th>
                      <th className="font-weight-bold dark-grey-text">
                        <strong>Visits</strong>
                      </th>
                      <th className="font-weight-bold dark-grey-text">
                        <strong>Sales</strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>January</td>
                      <td>15</td>
                      <td>307</td>
                    </tr>
                    <tr>
                      <td>Febuary</td>
                      <td>32</td>
                      <td>504</td>
                    </tr>
                    <tr>
                      <td>March</td>
                      <td>41</td>
                      <td>613</td>
                    </tr>
                  </tbody>
                </MDBTable>
                <MDBBtn
                  flat
                  rounded
                  className="grey lighten-3 float-right font-weight-bold dark-grey-text"
                >
                  View full report
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </section>
    </MDBContainer>
  );
};

export default Dashboard;
