import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../services/redux/slices/stockman/purchases";
import {
  MDBCard,
  MDBCardBody,
  MDBCollapseHeader,
  MDBCollapse,
  MDBTable,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdbreact";
import {
  ENDPOINT,
  formattedDate,
  fullName,
  variation,
} from "../../../services/utilities";
import "./style.css";
import handlePagination from "../pagination";
import PaginationButtons from "../pagination/buttons";

const GlobalPurchases = ({ isAdmin = false }) => {
  const { token, maxPage, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ purchases }) => purchases),
    [purchases, setPurchases] = useState([]),
    [stockmans, setStockMans] = useState([]),
    [suppliers, setSuppliers] = useState([]),
    [params, setParams] = useState({}),
    [mainPage, setMainPage] = useState(1),
    [page, setPage] = useState(1),
    [activeId, setActiveId] = useState(0),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token, key: { isAdmin, purchaseBy: auth?._id } }));
  }, [token, dispatch, auth, isAdmin]);

  const handleFilter = useCallback((array, key) => {
    return array
      .filter((collec, index, copy) => {
        return (
          index === copy.findIndex((orig) => orig[key]._id === collec[key]._id)
        );
      })
      .map((obj) => obj[key]);
  }, []);

  const handleFilterBy = useCallback(
    (filterCriteria, comparisonValue) => {
      return collections.filter(
        (col) => col[filterCriteria]._id === comparisonValue
      );
    },
    [collections]
  );

  useEffect(() => {
    const _stockmans = handleFilter(collections, "purchaseBy");
    const _suppliers = handleFilter(collections, "supplier");
    setStockMans(_stockmans);
    setSuppliers(_suppliers);
    setPurchases(collections);
  }, [collections, handleFilter]);

  useEffect(() => {
    let filteredPurchases = collections;
    let stockmanFiltered = [];
    let supplierFiltered = [];

    if (params.supplier) {
      filteredPurchases = handleFilterBy("supplier", params.supplier);
      stockmanFiltered = handleFilter(filteredPurchases, "purchaseBy");
    }

    if (params.stockman) {
      filteredPurchases = handleFilterBy("purchaseBy", params.stockman);
      supplierFiltered = handleFilter(filteredPurchases, "supplier");
    }

    if (params.supplier && params.stockman) {
      filteredPurchases = collections.filter(
        ({ supplier, purchaseBy }) =>
          supplier._id === params.supplier && purchaseBy._id === params.stockman
      );

      if (filteredPurchases.length === 0) {
        filteredPurchases = handleFilterBy("supplier", params.supplier);
        stockmanFiltered = handleFilter(filteredPurchases, "purchaseBy");
        setParams((prevParams) => ({ ...prevParams, stockman: "" }));
      } else {
        stockmanFiltered = handleFilter(
          collections.filter(
            ({ supplier }) => supplier._id === params.supplier
          ),
          "purchaseBy"
        );
      }
    }

    setStockMans(
      stockmanFiltered.length
        ? stockmanFiltered
        : handleFilter(collections, "purchaseBy")
    );
    setSuppliers(
      supplierFiltered.length
        ? supplierFiltered
        : handleFilter(collections, "supplier")
    );
    setPurchases(filteredPurchases);
  }, [params, handleFilter, collections, handleFilterBy]);

  const [didHoverId, setDidHoverId] = useState(-1);

  return (
    <MDBCard>
      <MDBCardBody>
        <MDBRow className="d-flex align-items-center">
          <MDBCol md="7" className="d-flex align-items-center">
            <MDBIcon
              icon="shopping-basket"
              size="2x"
              style={{ color: "blue" }}
              className="ml-2"
            />
            <h4 className="ml-2  mr-4 text-nowrap mt-2">Purchase List</h4>
            <select
              className="form-control mr-3"
              value={params.supplier}
              onChange={({ target }) =>
                setParams({ ...params, supplier: target.value })
              }
            >
              <option value={""}>Supplier</option>
              {suppliers.map((supplier, index) => (
                <option key={index} value={supplier._id}>
                  {supplier.company}
                </option>
              ))}
            </select>
            {isAdmin && (
              <select
                className="form-control"
                value={params.stockman}
                onChange={({ target }) =>
                  setParams({ ...params, stockman: target.value })
                }
              >
                <option value={""}>Stockman</option>
                {stockmans.map((stockman, index) => (
                  <option key={index} value={stockman._id}>
                    {fullName(stockman.fullName)}
                  </option>
                ))}
              </select>
            )}
          </MDBCol>
        </MDBRow>

        <MDBRow className="mt-3">
          <MDBCol md="12">
            {handlePagination(purchases, mainPage, maxPage).map(
              (purchase, index) => {
                const textColor =
                  activeId !== index
                    ? didHoverId === index
                      ? "text-primary"
                      : "text-black"
                    : "text-white";

                const bgBorder = //bg and border
                  activeId === index
                    ? " bg-info transition"
                    : didHoverId === index
                    ? "rounded border border-info bg-light ease-out"
                    : "bg-light ease-out";
                return (
                  <div
                    key={index}
                    className="mt-2"
                    onMouseLeave={() => setDidHoverId(-1)}
                    onMouseEnter={() => setDidHoverId(index)}
                  >
                    <MDBCollapseHeader
                      className={bgBorder}
                      onClick={() => {
                        setActiveId((prev) => (prev === index ? -1 : index));
                        setPage(1);
                      }}
                    >
                      <div className="d-flex justify-content-between">
                        <label className={textColor}>{`Supplier: ${
                          purchase?.supplier?.company
                        }, ${formattedDate(purchase.createdAt)}`}</label>
                        <div className="d-flex align-items-center">
                          {isAdmin && (
                            <label
                              className={`d-flex justify-content-end mt-2 text-danger mr-2`}
                            >
                              <strong>
                                Total Amount: ₱{purchase.total.toLocaleString()}
                              </strong>
                            </label>
                          )}
                          <i
                            style={{
                              rotate: `${activeId === index ? 0 : 90}deg`,
                            }}
                            className={`fa fa-angle-down transition-all ${textColor}`}
                          />
                        </div>
                      </div>
                    </MDBCollapseHeader>
                    <MDBCollapse
                      id={`collapse-${index}`}
                      isOpen={index === activeId}
                      className="border border-black"
                    >
                      {isAdmin && (
                        <h6 className="text-start mt-2 ml-3">
                          Purchase By:&nbsp;
                          <strong>
                            {fullName(purchase?.purchaseBy?.fullName)}
                          </strong>
                        </h6>
                      )}
                      <MDBTable responsive hover>
                        <thead>
                          <tr>
                            <th className="cursor-pointer">#&nbsp;</th>
                            <th className="th-lg">Product Name</th>
                            {isAdmin && <th className="th-lg">Capital </th>}
                            <th className="th-lg">Quantity/Kilo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {!purchase.stocks?.length && (
                            <tr>
                              <td className="text-center" colSpan="5">
                                No recent records.
                              </td>
                            </tr>
                          )}
                          {handlePagination(purchase.stocks, page, maxPage).map(
                            (stock, index) => {
                              const { product, _id, capital } = stock;
                              const { media = {} } = product || {};
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
                                        style={{ width: "60px" }}
                                      />
                                      <div>
                                        <h6
                                          className="text-truncate"
                                          style={{
                                            maxWidth: "400px",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            marginBottom: "5px",
                                          }}
                                        >
                                          {product.name}
                                        </h6>
                                        {product.hasVariant && (
                                          <div className="d-flex align-items-center">
                                            <h6 className="mr-1">
                                              Variations:
                                            </h6>
                                            <h6>
                                              {variation.name(
                                                stock,
                                                product.variations
                                              )}
                                            </h6>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  {isAdmin && <td>₱{capital}</td>}
                                  <td>
                                    {variation.qtyOrKilo(
                                      stock,
                                      product.isPerKilo
                                    )}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </MDBTable>
                      <div className="p-2">
                        <PaginationButtons
                          page={page}
                          setPage={setPage}
                          max={maxPage}
                          array={purchase.stocks}
                          title={"Product"}
                        />
                      </div>
                    </MDBCollapse>
                  </div>
                );
              }
            )}
          </MDBCol>
        </MDBRow>
        <PaginationButtons
          page={mainPage}
          setPage={setMainPage}
          max={maxPage}
          array={purchases}
          title="Purchase"
        />
      </MDBCardBody>
    </MDBCard>
  );
};

export default GlobalPurchases;
