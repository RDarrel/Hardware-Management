import { MDBCol, MDBRow, MDBTable } from "mdbreact";
import React from "react";
import PaginationButtons from "../../../../widgets/pagination/buttons";
import handlePagination from "../../../../widgets/pagination";
import {
  ENDPOINT,
  formattedDate,
  variation,
} from "../../../../../services/utilities";

const Table = ({
  sales = [],
  page,
  maxPage,
  setPage = () => {},
  isDetailedType = true,
}) => {
  return (
    <>
      <MDBTable responsive bordered striped>
        <thead>
          <tr>
            <th>Date (MM,DD,YY)</th>
            {isDetailedType && <th>Product</th>}
            <th className=" text-center">Sold</th>
            {isDetailedType && <th className=" text-center">Refund</th>}
            <th className="text-center">Unit</th>
            <th className="text-center">Gross Sales</th>
            <th className="text-center">Discount</th>
            <th className="text-center">Refund Amount</th>
            <th className="text-center">Net Sales</th>
            <th className="text-center">VAT(12%)</th>
            {!isDetailedType && <th className=" text-center">Income</th>}
          </tr>
        </thead>
        <tbody>
          {sales.length > 0 ? (
            handlePagination(sales, page, maxPage).map((sale, index) => {
              const {
                refundQuantity = 0,
                totalDiscount = 0,
                netSales: totalNetSales = 0,
              } = sale;
              const { product } = sale;
              const { media } = product;
              const img = `${ENDPOINT}/assets/products/${product._id}/${media.product[0].label}.jpg`;

              const totalRefund = sale.srp * (refundQuantity || 0);
              const grossSales = sale.srp * sale.sold;
              const totalDeducInGross =
                (totalRefund || 0) + (totalDiscount || 0);

              const netSales = isDetailedType
                ? grossSales - totalDeducInGross
                : totalNetSales;

              const totalVatSales = Number(netSales / 1.12).toFixed(2);
              const totalVat = Number(totalVatSales * 0.12).toFixed(2);

              return (
                <tr key={index}>
                  <td className="font-weight-bold">{sale.date}</td>
                  {isDetailedType && (
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={img}
                          alt={product.name}
                          className="product-image mr-2"
                        />
                        <div>
                          <h6
                            className="mt-1"
                            style={{
                              marginBottom: "-5px",
                              fontWeight: "500",
                              maxWidth: "200px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {product.name}
                          </h6>
                          {product.hasVariant && (
                            <div
                              className="d-flex align-items-center"
                              style={{ marginTop: "-20px" }}
                            >
                              <span className="mr-1">Variant:</span>
                              <span>
                                {variation.name(sale, product.variations)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  )}

                  <td className="text-center">
                    {sale?.sold - (sale.refundQuantity || 0)}
                  </td>
                  {isDetailedType && (
                    <td className="text-center">{refundQuantity || 0}</td>
                  )}

                  <td className="text-center">
                    {product.isPerKilo ? "Kg" : "Pcs"}
                  </td>

                  <td className="text-center">
                    <span className="font-weight-bold ">
                      ₱
                      {Number(
                        isDetailedType ? sale.srp * sale.sold : sale.grossSales
                      ).toLocaleString()}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="font-weight-bold ">
                      ₱
                      {Number(
                        isDetailedType ? sale.totalDiscount : sale.discount
                      ).toLocaleString()}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="font-weight-bold ">
                      ₱{totalRefund.toLocaleString()}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="font-weight-bold ">
                      ₱{netSales.toLocaleString()}
                    </span>
                  </td>

                  <td className="text-center">
                    <span className="font-weight-bold ">
                      ₱{totalVat.toLocaleString()}
                    </span>
                  </td>
                  {!isDetailedType && (
                    <td className="text-center">
                      <span className="font-weight-bold ">
                        ₱{sale.income.toLocaleString()}
                      </span>
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={11} className="text-center">
                No Record.
              </td>
            </tr>
          )}
        </tbody>
      </MDBTable>
      <MDBRow className="m-0 p-0">
        <MDBCol md="12 m-2">
          <PaginationButtons
            page={page}
            max={maxPage}
            mt={1}
            setPage={setPage}
            array={sales}
            title={"Product"}
          />
        </MDBCol>
      </MDBRow>
    </>
  );
};

export default Table;
