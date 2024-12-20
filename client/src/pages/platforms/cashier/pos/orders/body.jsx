import React, { useEffect } from "react";
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
  setOrderDetails,
}) => {
  useEffect(() => {
    setVariant1(null);
    setVariant2(null);
  }, [setVariant1, setVariant2]);

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
                      src={`${ENDPOINT}/assets/products/${item?.product?._id}/${item?.product?.media?.product[0]?.label}.jpg`}
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
                          maxWidth: "200px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginBottom: "-5px",
                        }}
                      >
                        {item.product?.name?.toUpperCase()}
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
                            className="pop-over-btn-order ml-2 text-start"
                            id={`btn-pop-over-${index}`}
                          >
                            <div className="variant">
                              <span className="  ">Variations:</span>
                              <br />
                              <span>
                                {variation.getTheVariant(
                                  item.variant1,
                                  item.variant2 || "",
                                  item.product.variations
                                )}
                              </span>
                            </div>
                          </MDBBtn>
                          <MDBPopoverBody
                            className="popover-body-order"
                            id={`pop-body-${index}`}
                          >
                            <Variations
                              isCart={true}
                              isChangeVariant={true}
                              has2Variant={item?.product?.hasVariant}
                              variations={item?.product?.variations}
                              variant1={
                                variant1 === null ? item?.variant1 : variant1
                              }
                              setVariant1={setVariant1}
                              variant2={
                                variant2 === null ? item?.variant2 : variant2
                              }
                              setVariant2={setVariant2}
                            />
                            <MDBRow className="mt-3">
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
                                      variant1 || item?.variant1,
                                      variant2 || item?.variant2
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
                  <h6>{null}</h6>
                  <OrderType
                    item={item}
                    orders={orderDetails}
                    index={index}
                    handleChange={handleChange}
                    setOrders={setOrderDetails}
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
    </div>
  );
};

export default Body;
