import React from "react";
import {
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBTable,
  MDBRow,
  MDBBadge,
} from "mdbreact";
import { ENDPOINT, variation } from "../../../../../services/utilities";
import CustomSelect from "../../../../../components/customSelect";

const Products = ({
  merchandises,
  suppliers,
  grandTotal,
  setSupplier,
  supplier,
}) => {
  return (
    <MDBCol md="7">
      <MDBRow className="mb-2">
        <MDBCol>
          <MDBCard>
            <div className="striped-border"></div>
            <MDBRow>
              <MDBCol>
                <CustomSelect
                  className="m-3 p-0"
                  label={"Supplier"}
                  preValue={supplier}
                  choices={[{ company: "All", _id: "all" }, ...suppliers]}
                  onChange={(value) => setSupplier(value)}
                  texts="company"
                  values="_id"
                />
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>
      </MDBRow>
      <MDBCard>
        <MDBCardBody>
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            <MDBTable bordered>
              <thead>
                <tr>
                  <th rowSpan={2}>#</th>
                  <th rowSpan={2}>Product</th>
                  <th colSpan={2} className="text-center">
                    Quantity/Kilo
                  </th>
                  <th className="text-center" rowSpan={2}>
                    Capital
                  </th>
                  <th className="text-center" rowSpan={2}>
                    Subtotal
                  </th>
                </tr>
                <tr>
                  <th className="text-center">Request</th>
                  <th className="text-center">Approved</th>
                </tr>
              </thead>
              <tbody>
                {merchandises.map((merchandise, index) => {
                  const {
                    product,
                    kilo,
                    capital,
                    quantity,
                    kiloGrams,
                    subtotal = 0,
                  } = merchandise;
                  const { media = {} } = product;
                  const img = `${ENDPOINT}/assets/products/${product._id}/${media.product[0].label}.jpg`;

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="font-weight-bold">
                        <div className="d-flex align-items-center">
                          <img
                            src={img}
                            alt={product.name}
                            className="mr-2"
                            style={{ width: "40px" }}
                          />
                          <div>
                            <h6
                              className="text-truncate font-weight-bold"
                              style={{
                                maxWidth: "350px",
                                whiteSpace: "nowrap",
                                marginBottom: "2px",
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
                                    merchandise,
                                    product.variations
                                  )}
                                </h6>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-center font-weight-bolder">
                        {variation.qtyOrKilo(
                          {
                            ...merchandise,
                            quantity: quantity?.request,
                            kilo: kilo?.request,
                            kiloGrams: kiloGrams?.request,
                          },
                          product.isPerKilo
                        )}
                      </td>

                      <td className="text-center font-weight-bolder">
                        {variation.qtyOrKilo(
                          {
                            ...merchandise,
                            quantity: quantity?.approved,
                            kilo: kilo?.approved,
                            kiloGrams: kiloGrams?.approved,
                          },
                          product.isPerKilo
                        )}
                      </td>
                      <td className="text-center font-weight-bolder text-danger">
                        ₱ {capital.toLocaleString()}
                      </td>
                      <td className="text-center font-weight-bolder text-danger">
                        ₱ {subtotal.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </MDBTable>
          </div>
          <MDBBadge color="light">
            <h6>
              Total of ({!!merchandises ? merchandises.length : 0}) Products
            </h6>
          </MDBBadge>
          <MDBBadge color="light" className="float-right">
            <h6 className="font-weight-bolder text-danger">
              {supplier === "all" ? "Grand" : ""} Total Amount: ₱
              {grandTotal.toLocaleString()}
            </h6>
          </MDBBadge>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default Products;
