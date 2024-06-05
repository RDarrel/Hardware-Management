import React, { useEffect, useState } from "react";
import { BROWSE } from "../../../../services/redux/slices/stockman/stocks";
import { MDBBadge, MDBCard, MDBCardBody, MDBTable } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { ENDPOINT, variation } from "../../../../services/utilities";
import { Search } from "../../../widgets/search";

export const Stocks = () => {
  const { token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ stocks }) => stocks),
    [stocks, setStocks] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [dispatch, token]);

  useEffect(() => {
    if (collections.length > 0) {
      const sortedCollections = [...collections].sort(
        (a, b) => a.stock - b.stock
      );
      setStocks(sortedCollections);
    }
  }, [collections]);

  const getTheGrams = (grams) => {
    switch (grams) {
      case "25":
        return "1/4";
      case "50":
        return "1/2";
      case "75":
        return "3/4";
      default:
        return grams;
    }
  };

  const formattedStock = (obj, isPerKilo) => {
    const stock = Number(obj.stock);
    const stockColor = stock < 5 ? "red" : "green";

    if (isPerKilo) {
      const kilos = stock.toString().split(".");
      const kilo = Number(kilos[0]);
      const grams = kilos[1] ? getTheGrams(kilos[1]) : null;

      return (
        <MDBBadge color={stockColor} className="p-2">
          <h6 className="font-weight-bold">
            {kilo} kilo{kilo > 1 ? "s" : ""}
            {grams && ` and ${grams}`}
          </h6>
        </MDBBadge>
      );
    } else {
      return (
        <MDBBadge color={stockColor} className="p-2">
          <h6 className="font-weight-bold">{stock} qty</h6>
        </MDBBadge>
      );
    }
  };

  return (
    <MDBCard>
      <MDBCardBody>
        <Search title={"Stock List"} />

        <MDBTable responsive hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {!stocks.length && (
              <tr>
                <td className="text-center" colSpan="5">
                  No recent records.
                </td>
              </tr>
            )}
            {stocks.map((obj, index) => {
              const { product, _id } = obj;
              const { media } = product;
              const img = `${ENDPOINT}/assets/products/${product._id}/${media.product[0].label}.jpg`;
              return (
                <tr key={_id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={img}
                        alt={product.name}
                        className="mr-2"
                        style={{ width: "80px", borderRadius: "4px" }}
                      />
                      <div>
                        <h6
                          className="text-truncate"
                          style={{
                            maxWidth: "400px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {product.name}
                        </h6>
                        {product.hasVariant && (
                          <div className="d-flex align-items-center">
                            <h6 className="mr-1">Variations:</h6>
                            <h6>{variation.name(obj, product.variations)}</h6>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{formattedStock(obj, product.isPerKilo)}</td>
                </tr>
              );
            })}
          </tbody>
        </MDBTable>
      </MDBCardBody>
    </MDBCard>
  );
};
