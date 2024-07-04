import React from "react";
import {
  MDBModalBody,
  MDBTable,
  MDBRow,
  MDBCol,
  MDBDatePicker,
  MDBBadge,
} from "mdbreact";
import { ENDPOINT, variation } from "../../../../services/utilities";
import CustomInput from "../../CustomInput";
import CustomSelect from "../../../../components/customSelect";
import GET from "../GET";

const ModalBody = ({
  isAdmin,
  isApproved,
  products,
  setMerchandises,
  setSupplier,
  setExpectedDelivered,
  handleChangeExpiration,
  expectedDelivered,
  total,
  suppliers,
  supplier,
  isDefective,
}) => {
  const baseKeyAction = isDefective ? "replacement" : "approved";
  return (
    <MDBModalBody className="mb-0">
      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
        <MDBTable>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              {!isAdmin && (
                <>
                  <th className="text-center">
                    {!isApproved
                      ? "Requested "
                      : isDefective
                      ? "Replacement "
                      : "Approved "}
                    Quantity/Kilo
                  </th>
                </>
              )}

              {isAdmin && (
                <>
                  {isDefective ? (
                    <th className="text-center">Replacement Quantity/kilo</th>
                  ) : (
                    <>
                      <th className="text-center">Request Quantity/kilo</th>
                      <th className="text-center">Approved Quantity/kilo</th>
                    </>
                  )}
                  <th className="text-center">Capital</th>
                  <th className="text-center">Subtotal</th>
                </>
              )}

              {!isAdmin && isApproved && (
                <>
                  <th className="text-center">Received Quantity/kilo</th>
                  <th className="text-center">Defective Quantity/kilo</th>
                  <th className="text-center">Non-Defective Quantity/kilo</th>
                  <th className="text-center">Expiration Date</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {!!products &&
              products.map((merchandise, index) => {
                const {
                  product,
                  kilo,
                  capital,
                  quantity,
                  kiloGrams,
                  subtotal = 0,
                  expiration = "",
                } = merchandise;
                const { media = {}, hasExpiration = false } = product;
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
                    {!isApproved && (
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
                    )}

                    {/* for stockman */}
                    {isApproved && !isAdmin && (
                      <td className="text-center font-weight-bolder">
                        {variation.qtyOrKilo(
                          {
                            ...merchandise,
                            quantity: quantity[baseKeyAction],
                            kilo: kilo[baseKeyAction],
                            kiloGrams: kiloGrams[baseKeyAction],
                          },
                          product.isPerKilo
                        )}
                      </td>
                    )}

                    {!isAdmin && isApproved && (
                      <>
                        <td>
                          <div className="d-flex justify-content-center">
                            <CustomInput
                              kilo={kilo?.received || kilo[baseKeyAction]}
                              kiloGrams={kiloGrams?.received}
                              quantity={
                                quantity?.received || quantity[baseKeyAction]
                              }
                              baseKey={"received"}
                              isAdmin={false}
                              maxKilo={kilo[baseKeyAction]}
                              maxQuantity={quantity[baseKeyAction]}
                              maxKiloGrams={kiloGrams[baseKeyAction]}
                              isPerKilo={product.isPerKilo}
                              setMerchandises={setMerchandises}
                              index={index}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <CustomInput
                              kilo={kilo?.defective || 0}
                              kiloGrams={kiloGrams?.defective || 0}
                              quantity={quantity?.defective || 0}
                              maxKilo={kilo[baseKeyAction]}
                              maxQuantity={quantity[baseKeyAction]}
                              maxKiloGrams={kiloGrams[baseKeyAction]}
                              isAdmin={false}
                              isPerKilo={product.isPerKilo}
                              baseKey={"defective"}
                              setMerchandises={setMerchandises}
                              index={index}
                            />
                          </div>
                        </td>
                        <td className="text-center font-weight-bolder">
                          {variation.qtyOrKilo(
                            product.isPerKilo
                              ? {
                                  ...GET.newKiloAndGrams(
                                    kiloGrams?.received,
                                    kilo?.received,
                                    kiloGrams?.defective,
                                    kilo?.defective
                                  ),
                                }
                              : {
                                  quantity:
                                    quantity?.received - quantity?.defective,
                                },
                            product.isPerKilo
                          )}
                        </td>
                        <td
                          className={
                            !hasExpiration
                              ? "text-center font-weight-bolder"
                              : "d-flex justify-content-center"
                          }
                        >
                          {hasExpiration ? (
                            <input
                              type="date"
                              className="form-control w-75"
                              value={new Date(expiration)
                                .toISOString()
                                .substr(0, 10)}
                              onChange={(e) =>
                                handleChangeExpiration(e.target.value, index)
                              }
                            />
                          ) : (
                            "--"
                          )}
                        </td>
                      </>
                    )}

                    {/* for admin */}
                    {isAdmin && (
                      <>
                        {isApproved && !isDefective && (
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
                        )}
                        <td
                          className={
                            isApproved ? "text-center font-weight-bolder" : ""
                          }
                        >
                          {!isApproved ? (
                            <div className="d-flex justify-content-center">
                              <CustomInput
                                kilo={kilo?.approved || 0}
                                kiloGrams={kiloGrams?.approved || 0}
                                quantity={quantity?.approved || 0}
                                isPerKilo={product.isPerKilo}
                                setMerchandises={setMerchandises}
                                baseKey={"approved"}
                                index={index}
                              />
                            </div>
                          ) : (
                            <>
                              {variation.qtyOrKilo(
                                {
                                  ...merchandise,
                                  quantity: quantity[baseKeyAction],
                                  kilo: kilo[baseKeyAction],
                                  kiloGrams: kiloGrams[baseKeyAction],
                                },
                                product.isPerKilo
                              )}
                            </>
                          )}
                        </td>
                        <td className="text-center font-weight-bolder text-danger">
                          ₱ {capital.toLocaleString()}
                        </td>
                        <td className="text-center font-weight-bolder text-danger">
                          ₱ {subtotal.toLocaleString()}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </MDBTable>
      </div>
      <MDBRow className="d-flex align-items-center m-0">
        <MDBCol md="4">
          <MDBBadge color="light">
            <h6>Total of ({!!products ? products.length : 0}) Products</h6>
          </MDBBadge>
        </MDBCol>
        {isAdmin && (
          <MDBCol
            md="8"
            className="d-flex align-items-center justify-content-end"
          >
            <div className="w-25 mr-3">
              <CustomSelect
                choices={suppliers}
                texts="company"
                values="_id"
                disabledAllExceptSelected={isApproved}
                preValue={supplier}
                onChange={(value) => setSupplier(value)}
                label={"Supplier"}
              />
            </div>
            {!isApproved && (
              <div className="d-flex align-items-center">
                Expected Delivered:
                <MDBDatePicker
                  className="mr-2 ml-2"
                  value={expectedDelivered}
                  getValue={(value) =>
                    setExpectedDelivered(value.toLocaleString())
                  }
                  minDate={new Date().toLocaleString()}
                />
              </div>
            )}
            <MDBBadge color="light" className="float-right">
              <h6 className="font-weight-bolder text-danger">
                Total Amount: ₱{total.toLocaleString()}
              </h6>
            </MDBBadge>
          </MDBCol>
        )}
      </MDBRow>
    </MDBModalBody>
  );
};

export default ModalBody;
