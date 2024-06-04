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
import { UPDATE } from "../../../../../services/redux/slices/cart";
import { ENDPOINT } from "../../../../../services/utilities";
import Variations from "../variations";
import { useDispatch, useSelector } from "react-redux";

const Table = ({ cart }) => {
  const { token } = useSelector(({ auth }) => auth),
    [popoverKey, setPopoverKey] = useState(0),
    [variant1, setVariant1] = useState(""),
    [variant2, setVariant2] = useState(""),
    [quantity, setQuantity] = useState(""),
    [kilo, setKilo] = useState(""),
    [kiloGrams, setKiloGrams] = useState(""),
    dispatch = useDispatch();

  const handleClose = () => {
    setPopoverKey((prevKey) => prevKey + 1);
  };

  const getTheVariant = (_variant1, _variant2, variations) => {
    const foundVariant1 = variations[0].options.find(
      ({ _id }) => _id === _variant1
    )?.name;

    if (variations.length > 1) {
      const foundVariant2 = variations[1].options.find(
        ({ _id }) => _id === _variant2
      )?.name;

      return `${foundVariant1}/${foundVariant2}`;
    } else {
      return `${foundVariant1}`;
    }
  };

  const handleUpdateVariant = () => {};

  const handleChangeQty = (action, value, _id) => {
    if (action === "add") {
      dispatch({ token, data: { _id, value } });
    } else {
      dispatch({ token, data: { _id, value } });
    }
  };

  const hanleChangeKilo = () => {};

  const handleChangeKiloGrams = () => {};

  return (
    <>
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
                      id={`checkbox-${index}`}
                    />
                    <label
                      htmlFor={`checkbox-${index}`}
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
                                <h6>
                                  {getTheVariant(
                                    obj.variant1,
                                    obj.variant2 || "",
                                    product.variations
                                  )}
                                </h6>
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
                        value={String(kilo) || String(obj.kilo)}
                        onChange={({ target }) => setKilo(Number(target.value))}
                        className="text-center border border-light"
                        append={
                          <select
                            className="form-control"
                            value={String(kiloGrams) || String(obj.kiloGrams)}
                            onChange={({ target }) =>
                              setKiloGrams(Number(target.value))
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
                        value={String(quantity) || String(obj.quantity)}
                        min="1"
                        onChange={({ target }) => {
                          var quantity = Number(target.value);
                          if (quantity < 1) quantity = 1;
                          setQuantity(quantity);
                        }}
                        size="sm"
                        prepend={
                          <MDBBtn
                            className="m-0 px-2 py-0"
                            size="sm"
                            color="light"
                            onClick={() =>
                              setQuantity((prev) =>
                                prev > 1 ? prev - 1 : prev
                              )
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
                            onClick={() => setQuantity((prev) => prev + 1)}
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
    </>
  );
};

export default Table;
