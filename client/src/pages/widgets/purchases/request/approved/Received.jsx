import React from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTable,
  MDBBadge,
  MDBCol,
  MDBRow,
} from "mdbreact";
import {
  ENDPOINT,
  formattedDate,
  fullName,
  variation,
} from "../../../../../services/utilities";
// import CustomSelect from "../../../../../components/customSelect";
import GET from "../../GET";

export default function Received({
  show,
  toggle,
  purchase = {},
  merchandises,
  isDefective = false,
  isAdmin,
  theader = "Approved",
}) {
  const handleClose = () => {
    toggle();
  };

  const getTheSubtotal = (capital, merchandise, isPerKilo) => {
    const { kilo, quantity, kiloGrams } = merchandise || {};
    if (isPerKilo) {
      const totalKgInDefective = kilo.defective + kiloGrams.defective;
      const totalKgReceived = kilo.received + kiloGrams.received;
      const resultForDeductionKg = totalKgReceived - totalKgInDefective;
      return resultForDeductionKg * capital;
    } else {
      const totalForDeductionQty = quantity.received - quantity.defective;
      return totalForDeductionQty * capital;
    }
  };

  const label = !isDefective
    ? isAdmin
      ? `Received By: ${fullName(purchase?.requestBy?.fullName)}`
      : "Products Received"
    : `Received By: ${fullName(purchase?.requestBy?.fullName)}`;

  const baseKeyInMerchandise = "approved";
  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      disableFocusTrap={false}
      size="fluid"
    >
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text d-flex  align-items-center"
        tag="h5"
      >
        <MDBIcon icon="shipping-fast" className="mr-2" />
        {label}
      </MDBModalHeader>
      <MDBModalBody className="mb-0 m-0 p-0">
        <div style={{ maxHeight: "500px", overflowY: "auto" }}>
          <MDBTable bordered>
            <thead>
              <tr>
                <th rowSpan={2}>#</th>
                <th rowSpan={2}>Product</th>
                <th colSpan={5} className="text-center">
                  Quantity Kilo
                </th>
                <th rowSpan={2} className="text-center">
                  Expiration Date
                </th>
                {isAdmin && (
                  <>
                    <th rowSpan={2} className="text-center">
                      Capital
                    </th>
                    <th rowSpan={2} className="text-center">
                      Subtotal
                    </th>
                  </>
                )}
              </tr>
              <tr>
                <th className="text-center">{theader}</th>
                <th className="text-center">Received</th>
                <th className="text-center">Defective</th>
                <th className="text-center">Non-Defective</th>
                <th className="text-center">Discrepancy</th>
              </tr>
            </thead>

            <tbody>
              {!!merchandises &&
                merchandises.map((merchandise, index) => {
                  const {
                    product,
                    kilo,
                    capital,
                    quantity,
                    kiloGrams,
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
                      <td className="text-center font-weight-bolder">
                        {variation.qtyOrKilo(
                          {
                            ...merchandise,
                            quantity: quantity[baseKeyInMerchandise],

                            kilo: kilo[baseKeyInMerchandise],
                            kiloGrams: kiloGrams[baseKeyInMerchandise],
                          },
                          product?.isPerKilo
                        )}
                      </td>
                      <td className="text-center font-weight-bolder">
                        {variation.qtyOrKilo(
                          {
                            ...merchandise,
                            quantity: quantity?.received,
                            kilo: kilo?.received,
                            kiloGrams: kiloGrams?.received,
                          },
                          product?.isPerKilo
                        )}
                      </td>
                      <td className="text-center font-weight-bolder">
                        {variation.qtyOrKilo(
                          {
                            ...merchandise,
                            quantity: quantity?.defective,
                            kilo: kilo?.defective,
                            kiloGrams: kiloGrams?.defective,
                          },
                          product?.isPerKilo
                        )}
                      </td>
                      <td className="text-center font-weight-bold">
                        {variation.qtyOrKilo(
                          product.isPerKilo
                            ? {
                                ...GET.newKiloAndGrams(
                                  kiloGrams.received,
                                  kilo.received,
                                  kiloGrams.defective,
                                  kilo.defective
                                ),
                              }
                            : {
                                quantity:
                                  quantity.received - quantity?.defective || 0,
                              },
                          product.isPerKilo
                        )}
                      </td>
                      <td className="text-center font-weight-bold">
                        {variation.qtyOrKilo(
                          product.isPerKilo
                            ? {
                                ...GET.newKiloAndGrams(
                                  kiloGrams.approved,
                                  kilo.approved,
                                  kiloGrams.received,
                                  kilo.received
                                ),
                              }
                            : {
                                quantity:
                                  quantity.approved - quantity?.received || 0,
                              },
                          product.isPerKilo
                        )}
                      </td>
                      <td className="text-center font-weight-bolder">
                        {hasExpiration ? formattedDate(expiration) : "--"}
                      </td>
                      {isAdmin && (
                        <>
                          <td className="text-center font-weight-bolder text-danger">
                            ₱ {capital.toLocaleString()}
                          </td>
                          <td className="text-center font-weight-bolder text-danger">
                            ₱
                            {getTheSubtotal(
                              capital,
                              merchandise,
                              product.isPerKilo
                            ).toLocaleString()}
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
          <MDBCol md="2">
            <MDBBadge color="light">
              <h6>
                Total of ({!!merchandises ? merchandises.length : 0}) Products
              </h6>
            </MDBBadge>
          </MDBCol>
          <MDBCol
            md="10"
            className="d-flex align-items-center justify-content-end"
          >
            {/* <div className="w-25 mr-3">
              <CustomSelect
                choices={[purchase?.supplier]}
                texts="company"
                className="m-0 p-0"
                values="_id"
                preValue={purchase?.supplier?._id}
                label={"Supplier"}
              />
            </div>
            <div className="d-flex align-items-center mr-3 mt-2">
              <h6 className="font-weight-bolder">
                Received On: {formattedDate(purchase?.received)}
              </h6>
            </div> */}
            {isAdmin && (
              <>
                <MDBBadge color="success" className="float-right mr-3 p-1">
                  <h6 className="font-weight-bolder text-white">
                    Total Payment : ₱{purchase?.total?.toLocaleString() || 0}
                  </h6>
                </MDBBadge>
                <MDBBadge color="danger" className="float-right mr-3 p-1">
                  <h6 className="font-weight-bolder text-white">
                    Total Defective Amount: ₱
                    {GET.totalAmount(
                      purchase?.merchandises,
                      "defective"
                    )?.toLocaleString()}
                  </h6>
                </MDBBadge>

                <MDBBadge color="warning" className="float-right mr-3 p-1">
                  <h6 className="font-weight-bolder text-white">
                    Total Discrepancy Amount: ₱
                    {GET.totalAmount(
                      purchase?.merchandises,
                      "discrepancy"
                    )?.toLocaleString()}
                  </h6>
                </MDBBadge>
                <MDBBadge color="light" className="float-right p-1">
                  <h6 className="font-weight-bolder text-danger">
                    Total Products Amount: ₱{" "}
                    {purchase.totalReceived?.toLocaleString()}
                  </h6>
                </MDBBadge>
              </>
            )}
          </MDBCol>
        </MDBRow>
      </MDBModalBody>
    </MDBModal>
  );
}
