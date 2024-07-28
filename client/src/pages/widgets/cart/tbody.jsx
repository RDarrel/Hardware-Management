import React, { useEffect } from "react";
import { ENDPOINT, variation } from "../../../services/utilities";
import {
  MDBPopover,
  MDBBtn,
  MDBIcon,
  MDBPopoverBody,
  MDBRow,
  MDBCol,
} from "mdbreact";
import Variations from "../variations";
import CustomSelect from "../../../components/customSelect";
import Kilo from "../orderType/kilo";
import { Quantity } from "../orderType/quantity";

export const Tbody = ({
  isCustomer,
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
  suppliers,
  handleChangeSupplier,
  disabledButtons,
}) => {
  useEffect(() => {
    setVariant1(null);
    setVariant2(null);
  }, [setVariant1, setVariant2]);
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
                        maxWidth: "210px",
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
                          <div className="variant">
                            <span>Variations:</span>
                            <br />
                            <span style={{ marginTop: "-1px" }}>
                              {variation.getTheVariant(
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
                            isChangeVariant={true}
                            has2Variant={product.hasVariant}
                            variations={product.variations}
                            variant1={
                              variant1 === null ? obj?.variant1 : variant1
                            }
                            setVariant1={setVariant1}
                            variant2={
                              variant2 === null ? obj?.variant2 : variant2
                            }
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

              {isCustomer && (
                <td className=" font-weight-bold">
                  ₱
                  {variation
                    .getTheCapitalOrSrp("srp", obj, product)
                    .toLocaleString()}
                </td>
              )}

              <td className="d-flex justify-content-center  align-items-center">
                <div className="mt-3 w-100 ">
                  {product.isPerKilo ? (
                    <Kilo
                      kilo={obj.kilo}
                      kiloGrams={obj.kiloGrams}
                      setKilo={(value) => handleChangeKilo(obj._id, value)}
                      setKiloGrams={(value) =>
                        handleChangeKiloGrams(obj._id, value)
                      }
                      availableStocks={obj?.max || 0}
                      isCustomer={isCustomer}
                      isCart={true}
                      disabledButtons={disabledButtons}
                    />
                  ) : (
                    <Quantity
                      isCart={true}
                      isCustomer={isCustomer}
                      setQuantity={(value, action) =>
                        handleChangeQty(action, value, obj._id)
                      }
                      availableStocks={obj.max || 0}
                      quantity={obj.quantity}
                      disabledButtons={disabledButtons}
                    />
                  )}
                </div>
              </td>
              {!isCustomer && (
                <td>
                  <CustomSelect
                    className="m-0 p-0 mt-2"
                    choices={suppliers}
                    preValue={obj.supplier}
                    inputClassName="text-center"
                    onChange={(value) => handleChangeSupplier(obj, value)}
                    texts="company"
                    values="_id"
                  />
                </td>
              )}
              {isCustomer && (
                <td className="text-danger font-weight-bold">
                  ₱
                  {variation
                    .getTheSubTotal("srp", obj, product)
                    .toLocaleString()}
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
