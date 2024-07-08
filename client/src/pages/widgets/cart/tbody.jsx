import React from "react";
import { ENDPOINT, variation } from "../../../services/utilities";
import {
  MDBPopover,
  MDBBtn,
  MDBIcon,
  MDBPopoverBody,
  MDBRow,
  MDBCol,
  MDBInputGroup,
} from "mdbreact";
import Variations from "../variations";

export const Tbody = ({
  isCashier,
  cart,
  handleChangeKilo,
  handleChangeKiloGrams,
  handleChangeQty,
  handleClose,
  handleRemoveCart,
  handleUpdateVariant,
  variant1,
  setVariant1,
  variant2,
  setVariant2,
  getTheVariant,
  popoverKey,
  checkOutProducts,
  handleActionInCheckOut,
  isCheckAll = true,
}) => {
  return (
    <tbody>
      {cart.length > 0 &&
        cart.map((obj, index) => {
          const { product } = obj;
          const hasVariant = product?.hasVariant;
          const { media } = product;
          const checkOutProduct = checkOutProducts.find(
            ({ _id }) => _id === obj._id
          );
          const isExistInCheckOut = checkOutProduct !== undefined;

          return (
            <tr key={index}>
              <td>
                <div className="d-flex align-items-center">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={isCheckAll || isExistInCheckOut}
                    onChange={() => handleActionInCheckOut(obj)}
                    id={`checkbox-${index}`}
                  />
                  <label
                    htmlFor={`checkbox-${index}`}
                    className="form-check-label mr-2 label-table"
                  />
                  <img
                    src={`${ENDPOINT}/assets/products/${product._id}/${media.product[0].label}.jpg`}
                    height={"50px"}
                    width={"50px"}
                    alt={`${product.name}`}
                  />
                  <div className="ml-3">
                    <h6
                      style={{
                        maxWidth: "300px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginBottom: "-5px",
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
                          <span>Variations:</span>
                          <div className="d-flex">
                            <span style={{ marginTop: "-1px" }}>
                              {getTheVariant(
                                obj.variant1,
                                obj.variant2 || "",
                                product.variations
                              )}
                            </span>
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
                                onClick={() =>
                                  handleUpdateVariant(
                                    {
                                      _id: obj._id,
                                      variant1: variant1 || obj?.variant1,
                                      variant2: variant2 || obj?.variant2,
                                      has2Variant: product.has2Variant,
                                    },
                                    {
                                      variant1: obj.variant1,
                                      variant2: obj.variant2,
                                    }
                                  )
                                }
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

              <td className="d-flex justify-content-center ">
                <div className="mt-2 w-100 d-flex justify-content-center">
                  {product.isPerKilo ? (
                    <MDBInputGroup
                      style={{ width: "50%" }}
                      type="number"
                      value={String(obj.kilo)}
                      onChange={({ target }) =>
                        handleChangeKilo(obj._id, Number(target.value))
                      }
                      className="text-center border border-light m-0 p-0"
                      append={
                        <select
                          className="form-control"
                          value={String(obj.kiloGrams)}
                          onChange={({ target }) =>
                            handleChangeKiloGrams(obj._id, Number(target.value))
                          }
                        >
                          <option value={"0"}>kl</option>
                          <option value={"0.25"}>1/4</option>
                          <option value={"0.5"}>1/2</option>
                          <option value={"0.75"}>3/4</option>
                        </select>
                      }
                    />
                  ) : (
                    <MDBInputGroup
                      type="number"
                      className="text-center border border-light"
                      style={{ width: "50%" }}
                      value={String(obj.quantity)}
                      min="1"
                      onChange={({ target }) => {
                        var quantity = Number(target.value);
                        if (quantity < 1) quantity = 1;
                        handleChangeQty("", quantity, obj._id);
                      }}
                      size="sm"
                      prepend={
                        <MDBBtn
                          className="m-0 px-2 py-0"
                          size="sm"
                          color="light"
                          onClick={() =>
                            handleChangeQty("MINUS", obj.quantity, obj._id)
                          }
                          style={{ boxShadow: "0px 0px 0px 0px" }}
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
                          style={{ boxShadow: "0px 0px 0px 0px" }}
                          onClick={() =>
                            handleChangeQty("ADD", obj.quantity, obj._id)
                          }
                          outline
                        >
                          <MDBIcon icon="plus" style={{ color: "black" }} />
                        </MDBBtn>
                      }
                    />
                  )}
                </div>
              </td>
              {isCashier && (
                <td className="text-danger font-weight-bold">
                  ₱{variation.getTheSubTotal("srp", obj, product)}
                </td>
              )}
              <td>
                <MDBBtn
                  color="danger"
                  size="sm"
                  rounded
                  onClick={() => handleRemoveCart(obj._id)}
                >
                  <MDBIcon icon="trash" />
                </MDBBtn>
              </td>
            </tr>
          );
        })}
    </tbody>
  );
};
