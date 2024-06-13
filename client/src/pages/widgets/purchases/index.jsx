import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../services/redux/slices/stockman/purchases";
import { Search } from "../search";
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
    [page, setPage] = useState(1),
    [activeId, setActiveId] = useState(0),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token, key: { isAdmin, purchaseBy: auth?._id } }));
  }, [token, dispatch, auth]);

  const handleFilter = useCallback((array, key) => {
    return array
      .filter((collec, index, copy) => {
        return (
          index === copy.findIndex((orig) => orig[key]._id === collec[key]._id)
        );
      })
      .map((obj) => obj[key]);
  }, []);
  useEffect(() => {
    const stockman = handleFilter(collections, "purchaseBy");
    const suppliers = handleFilter(collections, "supplier");
    console.log(suppliers);
    setPurchases(collections);
  }, [collections, handleFilter]);

  const [didHoverId, setDidHoverId] = useState(-1);

  return (
    <MDBCard>
      <MDBCardBody>
        <MDBRow className="d-flex align-items-center">
          <MDBCol md="7" className="d-flex align-items-center">
            <MDBIcon
              icon="shopping-basket"
              size="2x"
              style={{ color: "red" }}
              className="ml-2"
            />
            <h4 className="ml-2  mr-4 text-nowrap mt-2">Purchase List</h4>
            <select className="form-control mr-3">
              <option>supplier</option>
              <option>All</option>
            </select>
            <select className="form-control">
              <option>stockman</option>
            </select>
          </MDBCol>
        </MDBRow>

        <MDBRow className="mt-3">
          <MDBCol md="12">
            {purchases.map((purchase, index) => {
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
                            className={`d-flex justify-content-end mt-2 ${textColor} mr-2`}
                          >
                            <strong>Amount: ₱{purchase.total}</strong>
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
                                      style={{ width: "80px" }}
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
            })}
          </MDBCol>
        </MDBRow>
      </MDBCardBody>
    </MDBCard>
  );
};

export default GlobalPurchases;
