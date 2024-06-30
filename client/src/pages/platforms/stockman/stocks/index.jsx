import React, { useEffect, useState } from "react";
import { BROWSE } from "../../../../services/redux/slices/stockman/stocks";
import { MDBBadge, MDBCard, MDBCardBody, MDBTable } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  ENDPOINT,
  handlePagination,
  variation,
} from "../../../../services/utilities";
import PaginationButtons from "../../../widgets/pagination/buttons";
import { Search } from "../../../widgets/search";

export const Stocks = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ stocks }) => stocks),
    [stocks, setStocks] = useState([]),
    [page, setPage] = useState(1),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [dispatch, token]);

  useEffect(() => {
    if (collections.length > 0) {
      const sortedCollections = [...collections].sort(
        (a, b) => a.available - b.available
      );
      setStocks(sortedCollections);
    }
  }, [collections]);

  // const formattedStock = (obj, isPerKilo) => {
  //   const stock = Number(obj.sold);
  //   const stockColor = stock < 5 ? "red" : "green";

  //   if (isPerKilo) {
  //     return (
  //       <MDBBadge color={stockColor} className="p-2" pill>
  //         <h6 className="font-weight-bold">{stock}</h6>
  //       </MDBBadge>
  //     );
  //   } else {
  //     return (
  //       <MDBBadge color={stockColor} className="p-2" pill>
  //         <h6 className="font-weight-bold">{stock} </h6>
  //       </MDBBadge>
  //     );
  //   }
  // };

  return (
    <MDBCard>
      <MDBCardBody>
        <Search
          title={"Stock List"}
          disable={{ create: true }}
          icon="warehouse"
        />

        <MDBTable responsive hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Beginning</th>
              <th>Available</th>
              <th>Sold</th>
              <th>Unit</th>
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
            {handlePagination(stocks, page, maxPage).map((obj, index) => {
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
                        style={{
                          width: "60px",
                          borderRadius: "4px",
                          height: "60px",
                        }}
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
                  <td>
                    <MDBBadge pill className="p-2" color="blue">
                      <h6>{obj.beginning}</h6>
                    </MDBBadge>
                  </td>
                  <td>
                    <MDBBadge pill className="p-2" color="green">
                      <h6> {obj.available}</h6>
                    </MDBBadge>
                  </td>
                  <td>
                    <MDBBadge pill className="p-2" color="red">
                      <h6> {obj.sold}</h6>
                    </MDBBadge>
                  </td>
                  <td>{obj.product.isPerKilo ? "kg" : "Pcs"}</td>
                </tr>
              );
            })}
          </tbody>
        </MDBTable>
        <PaginationButtons
          page={page}
          setPage={setPage}
          max={maxPage}
          array={stocks}
          title={"Stock"}
        />
      </MDBCardBody>
    </MDBCard>
  );
};
