import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBContainer, MDBRow } from "mdbreact";
import { BROWSE } from "../../../../services/redux/slices/stockman/StockmanDashboard";
import NearlyExpiredProducts from "./nearlyExpiredProducts";
import OutOfStocksProducts from "./outOfStocksProducts";

export default function Dashboard() {
  const { token } = useSelector(({ auth }) => auth),
    { nearlyExpired, outOfStocks } = useSelector(
      ({ StockmanDashboard }) => StockmanDashboard
    ),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  console.log(nearlyExpired);

  return (
    <MDBContainer fluid id="v6" className="mb-5">
      <MDBRow>
        <NearlyExpiredProducts nearlyExpired={nearlyExpired} />
      </MDBRow>
      <MDBRow>
        <OutOfStocksProducts outOfStocks={outOfStocks} />
      </MDBRow>
    </MDBContainer>
  );
}
