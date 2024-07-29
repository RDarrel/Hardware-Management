import React, { useCallback, useEffect, useState } from "react";
import { BROWSE } from "../../../../services/redux/slices/stockman/stocks";
import { MDBBadge, MDBCard, MDBCardBody, MDBTable } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  ENDPOINT,
  globalSearch,
  handlePagination,
  variation,
} from "../../../../services/utilities";
import PaginationButtons from "../../../widgets/pagination/buttons";
import { Search } from "../../../widgets/search";
import Spinner from "../../../widgets/spinner";

export const Stocks = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(({ stocks }) => stocks),
    [stocks, setStocks] = useState([]),
    [page, setPage] = useState(1),
    [didSearch, setDidSearch] = useState(false),
    [search, setSearch] = useState(""),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [dispatch, token]);

  const handleSortStocks = useCallback((array) => {
    const sortedCollections = [...array].sort(
      (a, b) => a.available - b.available
    );
    setStocks(sortedCollections);
  }, []);

  // useEffect(() => {
  //   if (collections.length > 0) {
  //     handleSortStocks(collections);
  //   }
  // }, [collections]);

  useEffect(() => {
    if (!didSearch) {
      handleSortStocks(collections);
    }
  }, [didSearch, collections, handleSortStocks]);

  const handleSearch = (e) => {
    e.preventDefault();

    setStocks(globalSearch(collections, search));

    setDidSearch(true);
  };

  return (
    <MDBCard>
      <MDBCardBody>
        <Search
          title={"Stock List"}
          disable={{ create: true }}
          icon="warehouse"
          search={search}
          didSearch={didSearch}
          setDidSearch={setDidSearch}
          setSearch={setSearch}
          setContainer={setStocks}
          handleSearch={handleSearch}
          collections={collections}
        />

        {!isLoading ? (
          <>
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
                              width: "50px",
                              borderRadius: "4px",
                              height: "50px",
                            }}
                          />
                          <div>
                            <h6
                              className="text-truncate"
                              style={{
                                maxWidth: "400px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                marginBottom: "-15px",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {product.name}
                            </h6>
                            {product.hasVariant && (
                              <div className="d-flex align-items-center">
                                <span className="mr-1">Variant:</span>
                                <span>
                                  {variation.name(obj, product.variations)}
                                </span>
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
          </>
        ) : (
          <Spinner />
        )}
      </MDBCardBody>
    </MDBCard>
  );
};
