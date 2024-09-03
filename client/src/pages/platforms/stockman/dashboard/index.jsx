import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBContainer, MDBRow } from "mdbreact";
import { BROWSE } from "../../../../services/redux/slices/stockman/StockmanDashboard";
import NearlyExpiredProducts from "./nearlyExpiredProducts";
import NearlyOutOfStocksProducts from "./nearlyOutOfStocksProducts";
import OutOfStocksProducts from "./outOfStocksProducts";

export default function StockmanDashboard({ isAdmin = false }) {
  const { token } = useSelector(({ auth }) => auth),
    {
      nearlyExpired,
      outOfStocks: stocksCollections,
      isLoading,
    } = useSelector(({ StockmanDashboard }) => StockmanDashboard),
    [outOfStocks, setOutOfStocks] = useState([]),
    [nearlyOutOfStocks, setNearlyOutOfStocks] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  const handleFilter = useCallback((_collections, isOutOfStock) => {
    return _collections.filter(({ stock }) => {
      return isOutOfStock ? stock <= 0 : stock > 0;
    });
  }, []);

  useEffect(() => {
    if (stocksCollections.length > 0) {
      const collections = [...stocksCollections];

      const _nearlyOutOfStocks = handleFilter(collections, false);
      const _outOfStocks = handleFilter(collections, true);
      setOutOfStocks(_outOfStocks);
      setNearlyOutOfStocks(_nearlyOutOfStocks);
    }
  }, [stocksCollections, handleFilter]);

  return (
    <>
      {!isAdmin ? (
        <MDBContainer fluid id="v6" className="mb-5">
          <MDBRow>
            <OutOfStocksProducts
              outOfStocks={outOfStocks}
              isLoading={isLoading}
            />
          </MDBRow>
          <MDBRow>
            <NearlyOutOfStocksProducts
              outOfStocks={nearlyOutOfStocks}
              isLoading={isLoading}
            />
          </MDBRow>
          <MDBRow>
            <NearlyExpiredProducts
              nearlyExpired={nearlyExpired}
              isLoading={isLoading}
            />
          </MDBRow>
        </MDBContainer>
      ) : (
        <>
          <MDBRow>
            <OutOfStocksProducts
              outOfStocks={outOfStocks}
              isLoading={isLoading}
            />
          </MDBRow>
          <MDBRow>
            <NearlyOutOfStocksProducts
              outOfStocks={nearlyOutOfStocks}
              isLoading={isLoading}
            />
          </MDBRow>
          <MDBRow>
            <NearlyExpiredProducts
              nearlyExpired={nearlyExpired}
              isLoading={isLoading}
            />
          </MDBRow>
        </>
      )}
    </>
  );
}
