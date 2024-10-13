import React from "react";
import {
  MDBModalBody,
  MDBTable,
  MDBRow,
  MDBCol,
  // MDBDatePicker,
  MDBBadge,
} from "mdbreact";
import { ENDPOINT, variation } from "../../../../services/utilities";
import CustomInput from "../../CustomInput";
import CustomSelect from "../../../../components/customSelect";
import GET from "../GET";
import Swal from "sweetalert2";

const ModalBody = ({
  isAdmin,
  isApproved,
  products,
  setMerchandises,
  setSupplier,
  // setExpectedDelivered,
  handleChangeExpiration,
  // expectedDelivered,
  total,
  suppliers,
  supplier,
  isDefective,
  hasBorder,
  theader,
}) => {
  const baseKeyAction = "approved";
  const handleChangeGlobalSupplier = (newSupplier = "") => {
    if (newSupplier === supplier) return false;
    Swal.fire({
      title: "Are you sure?",
      text: "Changing the global supplier will update the supplier for all products.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        // If user confirms, change the global supplier and update all products
        const _merchandises = [...products];
        const newMerchandises = _merchandises.map((merchandise) => {
          if (merchandise.supplier === supplier) {
            return { ...merchandise, supplier: newSupplier };
          } else {
            return merchandise;
          }
        });

        setSupplier(newSupplier);
        setMerchandises(newMerchandises);
        Swal.fire(
          "Changed!",
          "All product suppliers have been updated.",
          "success"
        );
      }
    });
  };

  const handleChangeSupplier = (newSupplier, index) => {
    const _merchandises = [...products];
    _merchandises[index].supplier = newSupplier;
    setMerchandises(_merchandises);
  };
  return (
    <MDBModalBody className={hasBorder ? `mb-0 m-0 p-0` : ""}>
      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
        <MDBTable bordered={hasBorder}>
          <thead>
            <tr>
              <th rowSpan={2}>#</th>
              <th rowSpan={2}>Product</th>

              <th
                className="text-center"
                colSpan={!isAdmin ? 5 : isDefective ? 1 : 2}
              >
                Quantity/Kilo
              </th>

              {isAdmin && (
                <>
                  <th className="text-center" rowSpan={2}>
                    Capital
                  </th>
                  <th className="text-center" rowSpan={2}>
                    Subtotal
                  </th>
                  {!isApproved && (
                    <th className="text-center" rowSpan={2}>
                      Supplier
                    </th>
                  )}
                </>
              )}
            </tr>
            {hasBorder && (
              <tr>
                {!isAdmin && (
                  <>
                    <th className="text-center">{theader}</th>
                  </>
                )}
                {isAdmin && (
                  <>
                    {isDefective ? (
                      <th className="text-center">Replacement</th>
                    ) : (
                      <>
                        <th className="text-center">Request </th>
                        <th className="text-center">Approved</th>
                      </>
                    )}
                  </>
                )}

                {!isAdmin && isApproved && (
                  <>
                    <th className="text-center">Received </th>
                    <th className="text-center">Defective </th>
                    <th className="text-center">Non-Defective </th>
                    <th className="text-center">Discrepancy </th>
                    <th className="text-center">Expiration Date</th>
                  </>
                )}
              </tr>
            )}
          </thead>
          <tbody>
            {!!products &&
              products.map((merchandise, index) => {
                const {
                  product,
                  capital,
                  quantity = {
                    approved: 0,
                    received: 0,
                    defective: 0,
                  },
                  kilo = { approved: 0, received: 0, defective: 0 },
                  kiloGrams = {
                    approved: 0,
                    received: 0,
                    defective: 0,
                  },
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
                              <h6 className="mr-1">Variant:</h6>
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
                            quantity: quantity?.approved,
                            kilo: kilo?.approved,
                            kiloGrams: kiloGrams?.approved,
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
                              kilo={kilo?.received || kilo?.approved}
                              kiloGrams={kiloGrams?.received}
                              quantity={
                                quantity?.received || quantity?.approved
                              }
                              baseKey={"received"}
                              isAdmin={false}
                              maxKilo={kilo?.approved}
                              maxQuantity={quantity?.approved}
                              maxKiloGrams={kiloGrams?.approved}
                              isPerKilo={product.isPerKilo}
                              setMerchandises={setMerchandises}
                              index={index}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center ">
                            <CustomInput
                              kilo={kilo?.defective || 0}
                              kiloGrams={kiloGrams?.defective || 0}
                              quantity={quantity?.defective || 0}
                              maxKilo={kilo?.approved}
                              maxQuantity={quantity?.approved}
                              maxKiloGrams={kiloGrams?.approved}
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
                                    kiloGrams?.defective || 0,
                                    kilo?.defective || 0
                                  ),
                                }
                              : {
                                  quantity:
                                    quantity?.received -
                                    (quantity?.defective || 0),
                                },
                            product.isPerKilo
                          )}
                        </td>
                        <td className="text-center font-weight-bolder">
                          {variation.qtyOrKilo(
                            product.isPerKilo
                              ? {
                                  ...GET.newKiloAndGrams(
                                    kiloGrams?.approved,
                                    kilo?.approved,
                                    kiloGrams?.received,
                                    kilo?.received
                                  ),
                                }
                              : {
                                  quantity:
                                    quantity?.approved - quantity?.received,
                                },
                            product.isPerKilo
                          )}
                        </td>
                        <td
                          className={
                            !hasExpiration
                              ? "text-center font-weight-bolder"
                              : "d-flex justify-content-center "
                          }
                          style={{
                            borderBottom: "transparent",
                            borderLeft: "transparent",
                          }}
                        >
                          {hasExpiration ? (
                            <input
                              type="date"
                              className="form-control w-75 m-0 p-0 "
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
                        {!isApproved && (
                          <td>
                            <select
                              value={merchandise.supplier}
                              className="form-control text-center"
                              onChange={({ target }) =>
                                handleChangeSupplier(target.value, index)
                              }
                            >
                              {suppliers.map((supp, index) => (
                                <option key={index} value={supp._id}>
                                  {supp.company}
                                </option>
                              ))}
                            </select>
                          </td>
                        )}
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
                onChange={(value) => handleChangeGlobalSupplier(value)}
                label={"Supplier"}
              />
            </div>
            {/* {!isApproved && (
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
            )} */}
            <MDBBadge color="light" className="float-right">
              <h6 className="font-weight-bolder text-danger">
                {!isApproved ? "Grand" : ""} Total Amount: ₱
                {total.toLocaleString()}
              </h6>
            </MDBBadge>
          </MDBCol>
        )}
      </MDBRow>
    </MDBModalBody>
  );
};

export default ModalBody;
