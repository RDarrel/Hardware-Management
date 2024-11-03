import { MDBCol, MDBRow, MDBTable } from "mdbreact";
import React from "react";
import PaginationButtons from "../../../../widgets/pagination/buttons";
import handlePagination from "../../../../widgets/pagination";
import { ENDPOINT, variation } from "../../../../../services/utilities";

const Table = ({ sales = [], page, maxPage, setPage = () => {} }) => {
  return (
    <>
      <MDBTable responsive bordered striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th className=" text-center">Sold</th>
            <th className="text-center">Unit</th>
            <th className="text-center">Capital</th>
            <th className="text-center">SRP</th>
            <th className="text-center">Gross Sales</th>
            <th className="text-center">Discount</th>
            <th className="text-center">Net Sales</th>
            <th className="text-center">VAT(12%)</th>
            <th className="text-center">INCOME</th>
          </tr>
        </thead>
        <tbody>
          {sales.length > 0 ? (
            handlePagination(sales, page, maxPage).map((sale, index) => {
              const { product } = sale;
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
                  <td className="text-center">{sale?.sold}</td>
                  <td className="text-center">
                    {product.isPerKilo ? "Kg" : "Pcs"}
                  </td>
                  <td className="text-center">
                    <span className="font-weight-bold text-danger ">
                      ₱{sale.capital}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="font-weight-bold text-danger">
                      ₱{sale.srp.toLocaleString()}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="font-weight-bold text-danger">
                      ₱{(sale.srp * sale.sold).toLocaleString()}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="font-weight-bold text-danger">
                      ₱{sale.totalDiscount.toLocaleString()}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="font-weight-bold text-danger">
                      ₱{sale.netSales.toLocaleString()}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="font-weight-bold text-danger">
                      ₱{sale.vat.toLocaleString()}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="font-weight-bold text-danger">
                      ₱{sale.income.toLocaleString()}
                    </span>
                  </td>
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
