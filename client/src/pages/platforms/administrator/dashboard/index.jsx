import React, { useEffect } from "react";
import { MDBContainer } from "mdbreact";
import Total from "./total";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../services/redux/slices/administrator/adminDashboard";
import TopSellingProducts from "./topSellingProducts";
import Graph from "./Graph";
import CurrentSales from "./currentSales";
import StockmanDashboard from "../../stockman/dashboard";

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
      <Graph products={sales} />
      <CurrentSales sales={sales} />
      <TopSellingProducts products={topSellingProducts} />
      <StockmanDashboard isAdmin={true} />
    </MDBContainer>
  );
};

export default Dashboard;
