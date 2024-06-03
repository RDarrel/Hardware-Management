import React, { useState } from "react";
import "./table.css";
import {
  MDBBtn,
  MDBCol,
  MDBIcon,
  MDBInputGroup,
  MDBPopover,
  MDBPopoverBody,
  MDBRow,
  MDBTable,
} from "mdbreact";
import { ENDPOINT } from "../../../../../services/utilities";
import Variations from "../variations";

const Table = ({ cart }) => {
  const [popoverKey, setPopoverKey] = useState(0),
    [variant1, setVariant1] = useState(""),
    [variant2, setVariant2] = useState("");

  const handleClose = () => {
    setPopoverKey((prevKey) => prevKey + 1);
  };

  const handleUpdateVariant = () => {};

  return (
    <div className="table-responsive">
      <MDBTable>
        <thead>
          <tr>
            <th>
              <input
                className="form-check-input"
                type="checkbox"
                id="checkbox"
              />
              <label
                htmlFor="checkbox"
                className="form-check-label mr-2 label-table"
              />
            </th>
            <th>Product</th>
            <th className="text-center">Quantity/Kilo</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.length > 0 &&
            cart.map((obj, index) => {
              const { product } = obj;
              const hasVariant = product.hasVariant;
              const { media } = product;

              return (
                <tr key={index}>
                  <td>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`checkbox-${index}`} // Unique id for each checkbox
                    />
                    <label
                      htmlFor={`checkbox-${index}`} // Match htmlFor with the corresponding checkbox id
                      className="form-check-label mr-2 label-table"
                    />
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={`${ENDPOINT}/assets/products/${product._id}/${media.product[0].label}.jpg`}
                        height={"80px"}
                        alt={`${product.name}`}
                      />
                      <div className="ml-3">
                        <h6
                          style={{
                            maxWidth: "300px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          className="font-weight-bold"
                        >
                          {product.name}
                        </h6>

                        {hasVariant && (
                          <MDBPopover
                            placement="bottom"
                            popover
                            clickable
                            id={`popover-${index}`}
                            key={popoverKey}
                          >
                            <MDBBtn
                              className="pop-over-btn"
                              id={`btn-pop-over-${index}`}
                            >
                              <h6>Variations:</h6>
                              <div className="d-flex">
                                <h6>50cm/25cm</h6>
                              </div>
                            </MDBBtn>
                            <MDBPopoverBody
                              className="popover-body"
                              id={`pop-body-${index}`}
                            >
                              <Variations
                                isCart={true}
                                has2Variant={product.hasVariant}
                                variations={product.variations}
                                variant1={variant1 || obj.variant1}
                                setVariant1={setVariant1}
                                variant2={variant2 || obj.variant2}
                                setVariant2={setVariant2}
                              />

                              <MDBRow className="mt-5">
                                <MDBCol
                                  md="6"
                                  className="d-flex justify-content-center"
                                >
                                  <MDBBtn color="white" onClick={handleClose}>
                                    Cancel
                                  </MDBBtn>
                                </MDBCol>
                                <MDBCol
                                  md="6"
                                  className="d-flex justify-content-center"
                                >
                                  <MDBBtn
                                    color="danger"
                                    onClick={() => handleUpdateVariant()}
                                  >
                                    Confirm
                                  </MDBBtn>
                                </MDBCol>
                              </MDBRow>
                            </MDBPopoverBody>
                          </MDBPopover>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="d-flex justify-content-center">
                    {product.isPerKilo ? (
                      <MDBInputGroup
                        style={{ width: "50%" }}
                        type="number"
                        className="text-center border border-light"
                        append={
                          <select className="form-control">
                            <option>kl</option>
                            <option>1/4</option>
                            <option>1/2</option>
                            <option>3/4</option>
                          </select>
                        }
                      />
                    ) : (
                      <MDBInputGroup
                        type="number"
                        className="text-center border border-light"
                        style={{ width: "50%" }}
                        size="sm"
                        prepend={
                          <MDBBtn
                            className="m-0 px-2 py-0"
                            size="sm"
                            color="light"
                            outline
                          >
                            <MDBIcon icon="minus" style={{ color: "black" }} />
                          </MDBBtn>
                        }
                        append={
                          <MDBBtn
                            className="m-0 px-2  py-0"
                            size="sm"
                            color="light"
                            outline
                          >
                            <MDBIcon icon="plus" style={{ color: "black" }} />
                          </MDBBtn>
                        }
                      />
                    )}
                  </td>
                  <td>
                    <MDBBtn color="danger" size="sm" rounded>
                      <MDBIcon icon="trash" />
                    </MDBBtn>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </MDBTable>
    </div>
  );
};

export default Table;
