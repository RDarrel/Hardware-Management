import React from "react";
import {
  MDBBtn,
  MDBPopover,
  MDBPopoverBody,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBTable,
} from "mdbreact";
import OrderType from "./orderType";
import { ENDPOINT, variation } from "../../../../../services/utilities";
import Variations from "../../../../widgets/variations";

const Body = ({
  handleUpdateVariant,
  handleChangeGrams,
  handleChange,
  handleClose,
  handleDelete,
  orderDetails,
  popoverKey,
  variant1,
  setVariant1,
  variant2,
  setVariant2,
}) => {
  return (
    <div className="order-details m-0 p-0 ">
      {orderDetails.length === 0 ? (
        <p className="text-center">No items in cart</p>
      ) : (
        <MDBTable>
          <thead>
            <tr>
              <th>Items</th>
              <th className="text-center">Quantity/Kilo</th>
              <th className="text-center">Price</th>
              <th className="text-center">Subtotal</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((item, index) => (
              <tr key={index}>
                <td className="p-1">
                  <div className="d-flex align-items-center">
                    <img
                      src={`${ENDPOINT}/assets/products/${item.product._id}/${item.product.media.product[0].label}.jpg`}
                      height={"60px"}
                      width={"55px"}
                      alt={`${item.product.name}`}
                    />

                    <div>
                      <h6
                        className={`ml-2 font-weight-bold ${
                          item.product.hasVariant ? "mt-2" : ""
                        }`}
                        style={{
                          maxWidth: "250px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginBottom: "-5px",
                        }}
                      >
                        {item.product.name}
                      </h6>
                      {item.product.hasVariant && (
                        <MDBPopover
                          placement="bottom"
                          popover
                          clickable
                          id={`popover-${index}`}
                          key={popoverKey}
                        >
                          <MDBBtn
                            className="pop-over-btn-order ml-2"
                            id={`btn-pop-over-${index}`}
                          >
                            <span>Variations:</span>
                            <br />
                            <span>
                              {variation.getTheVariant(
                                item.variant1,
                                item.variant2 || "",
                                item.product.variations
                              )}
                            </span>
                          </MDBBtn>
                          <MDBPopoverBody
                            className="popover-body-order"
                            id={`pop-body-${index}`}
                          >
                            <Variations
                              isCart={true}
                              has2Variant={item.product.hasVariant}
                              variations={item.product.variations}
                              variant1={variant1 || item.variant1}
                              setVariant1={setVariant1}
                              variant2={variant2 || item.variant2}
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
                                      index,
                                      variant1 || item.variant1,
                                      variant2 || item.variant2
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
                <td className="w-25">
                  <h6></h6>
                  <OrderType
                    item={item}
                    index={index}
                    handleChange={handleChange}
                    handleChangeGrams={handleChangeGrams}
                  />
                </td>
                <td className="text-center font-weight-bold text-danger">
                  ₱
                  {variation
                    .getTheCapitalOrSrp("srp", item, item.product)
                    .toLocaleString()}
                </td>
                <td className="text-center font-weight-bold text-danger">
                  ₱
                  {variation
                    .getTheSubTotal("srp", item, item.product)
                    .toLocaleString()}
                </td>
                <td className="text-center font-weight-bold ">
                  <MDBBtn
                    color="danger"
                    rounded
                    size="sm"
                    onClick={() => handleDelete(index)}
                  >
                    <MDBIcon icon="trash" />
                  </MDBBtn>
                </td>
              </tr>
            ))}
          </tbody>
        </MDBTable>
      )}

      {/* {orderDetails.map((item, index) => (
        <div
          key={index}
          className="d-flex align-items-center justify-content-between mb-2"
        >
          <div className="d-flex align-items-center">
            <img
              src={`${ENDPOINT}/assets/products/${item.product._id}/${item.product.media.product[0].label}.jpg`}
              height={"50px"}
              width={"55px"}
              alt={`${item.product.name}`}
            />
            <div
              style={{
                width: "220px",
              }}
            >
              <span
                className="text-truncate ml-1 font-weight-bold "
                style={{ width: "100%", display: "block" }}
              >
                {item.product.name}
              </span>
              {item.product.hasVariant && (
                <MDBPopover
                  placement="bottom"
                  popover
                  clickable
                  id={`popover-${index}`}
                  key={popoverKey}
                >
                  <MDBBtn
                    className="pop-over-btn-order ml-2"
                    id={`btn-pop-over-${index}`}
                  >
                    <span>Variations:</span>
                    <br />
                    <span className="text-start">
                      {variation.getTheVariant(
                        item.variant1,
                        item.variant2 || "",
                        item.product.variations
                      )}
                    </span>
                  </MDBBtn>
                  <MDBPopoverBody
                    className="popover-body-order"
                    id={`pop-body-${index}`}
                  >
                    <Variations
                      isCart={true}
                      has2Variant={item.product.hasVariant}
                      variations={item.product.variations}
                      variant1={variant1 || item.variant1}
                      setVariant1={setVariant1}
                      variant2={variant2 || item.variant2}
                      setVariant2={setVariant2}
                    />
                    <MDBRow className="mt-5">
                      <MDBCol md="6" className="d-flex justify-content-center">
                        <MDBBtn color="white" onClick={handleClose}>
                          Cancel
                        </MDBBtn>
                      </MDBCol>
                      <MDBCol md="6" className="d-flex justify-content-center">
                        <MDBBtn
                          color="danger"
                          onClick={() =>
                            handleUpdateVariant(
                              index,
                              variant1 || item.variant1,
                              variant2 || item.variant2
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
          <OrderType
            item={item}
            index={index}
            handleChange={handleChange}
            handleChangeGrams={handleChangeGrams}
          />
          <span>
            ₱{variation.getTheCapitalOrSrp("srp", item, item.product)}
          </span>
          <span>₱{variation.getTheSubTotal("srp", item, item.product)}</span>
          <MDBBtn
            color="danger"
            rounded
            size="sm"
            onClick={() => handleDelete(index)}
          >
            <MDBIcon icon="trash" />
          </MDBBtn>
        </div>
      ))} */}
    </div>
  );
};

export default Body;
