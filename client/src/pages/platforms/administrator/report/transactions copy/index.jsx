import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBTable,
  MDBCollapse,
  MDBCollapseHeader,
} from "mdbreact";
import { BROWSE } from "../../../../../services/redux/slices/administrator/report/transactionsReport";
import { Header } from "../header";
import PaginationButtons from "../../../../widgets/pagination/buttons";
import handlePagination from "../../../../widgets/pagination";
import {
  ENDPOINT,
  formattedDate,
  fullName,
  variation,
} from "../../../../../services/utilities";

export const Transactions = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    { collections } = useSelector(
      ({ transactionsReport }) => transactionsReport
    ),
    [transactions, setTransactions] = useState([]),
    [activeId, setActiveId] = useState(-1),
    [didHoverId, setDidHoverId] = useState(-1),
    [page, setPage] = useState(1),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  return (
    <>
      <MDBCard>
        <div className="ml-4 mt-2">
          <Header
            setFilteredData={setTransactions}
            collections={collections}
            isTransaction={true}
            title="Transactions"
            mb="0"
          />
        </div>
        <MDBCardBody>
          <MDBRow>
            <MDBCol md="12">
              {handlePagination(transactions, page, maxPage).map(
                (transaction, index) => {
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
                          <label className={textColor}>{`Cashier: ${fullName(
                            transaction.cashier.fullName
                          )} , Invoice No: ${
                            transaction.invoice_no
                          } ,  ${formattedDate(transaction.createdAt)}`}</label>
                          <div className="d-flex align-items-center">
                            <label
                              className={`d-flex justify-content-end mt-2 text-danger mr-2`}
                            >
                              <strong>
                                Amount: ₱{transaction.total.toLocaleString()}
                              </strong>
                            </label>
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
                        <MDBTable responsive hover>
                          <thead>
                            <tr>
                              <th className="cursor-pointer">#&nbsp;</th>
                              <th className="th-lg">Product Name</th>
                              <th className="th-lg">Quantity/Kilo</th>
                              <th className="th-lg">SRP</th>
                            </tr>
                          </thead>
                          <tbody>
                            {!transaction.purchases?.length && (
                              <tr>
                                <td className="text-center" colSpan="5">
                                  No recent records.
                                </td>
                              </tr>
                            )}
                            {handlePagination(
                              transaction.purchases,
                              page,
                              maxPage
                            ).map((transaction, index) => {
                              const { product } = transaction;
                              const { media } = product;
                              const img = `${ENDPOINT}/assets/products/${product._id}/${media.product[0].label}.jpg`;

                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <img
                                        src={img}
                                        alt={product.name}
                                        className="product-image mr-2"
                                      />
                                      <div>
                                        <h6 className="product-name">
                                          {product.name}
                                        </h6>
                                        {product.hasVariant && (
                                          <div className="d-flex align-items-center">
                                            <span className="mr-1">
                                              Variations:
                                            </span>
                                            <span>
                                              {variation.name(
                                                transaction,
                                                product.variations
                                              )}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>

                                  <td>
                                    {variation.qtyOrKilo(
                                      transaction,
                                      product.isPerKilo
                                    )}
                                  </td>
                                  <td>
                                    ₱
                                    {variation.getTheSubTotal(
                                      "srp",
                                      transaction,
                                      product
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </MDBTable>
                        <div className="p-2">
                          <PaginationButtons
                            page={page}
                            setPage={setPage}
                            max={maxPage}
                            array={transaction.purchases}
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
            page={page}
            setPage={setPage}
            max={maxPage}
            array={transactions}
            title={"Transactions"}
          />
        </MDBCardBody>
      </MDBCard>
    </>
  );
};
