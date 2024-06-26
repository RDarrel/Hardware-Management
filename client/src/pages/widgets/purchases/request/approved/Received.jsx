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
import CustomSelect from "../../../../../components/customSelect";

export default function Received({
  show,
  toggle,
  purchase = {},
  merchandises,
  isAdmin,
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
        className="light-blue darken-3 white-text "
        tag="h5"
      >
        <MDBIcon icon="shipping-fast" className="mr-2" />
        {isAdmin
          ? `Received By: ${fullName(purchase?.requestBy?.fullName)}`
          : "Products Received"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <div style={{ maxHeight: "500px", overflowY: "auto" }}>
          <MDBTable>
            <thead>
              <tr>
                <th>#</th>
                <th className="th-lg">Product</th>
                <th className="text-center">Approved Quantity/kilo</th>
                <th className="text-center">Received Quantity/kilo</th>
                <th className="text-center">Defective Quantity/kilo</th>
                <th className="text-center">Expiration Date</th>
                {isAdmin && (
                  <>
                    <th className="text-center">Capital</th>
                    <th className="text-center">Subtotal</th>
                  </>
                )}
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
                  console.log(expiration);
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
                            quantity: quantity.approved,
                            kilo: kilo?.approved,
                            kiloGrams: kiloGrams?.approved,
                          },
                          product?.isPerKilo
                        )}
                      </td>
                      <td className="text-center font-weight-bolder">
                        {variation.qtyOrKilo(
                          {
                            ...merchandise,
                            quantity: quantity?.received,
                            kilo: kilo?.approved,
                            kiloGrams: kiloGrams?.approved,
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
          <MDBCol md="4">
            <MDBBadge color="light">
              <h6>
                Total of ({!!merchandises ? merchandises.length : 0}) Products
              </h6>
            </MDBBadge>
          </MDBCol>
          <MDBCol
            md="8"
            className="d-flex align-items-center justify-content-end"
          >
            <div className="w-25 mr-3">
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
            </div>
            {isAdmin && (
              <MDBBadge color="light" className="float-right">
                <h6 className="font-weight-bolder text-danger">
                  Total Amount: ₱ {purchase?.total?.toLocaleString() || 0}
                </h6>
              </MDBBadge>
            )}
          </MDBCol>
        </MDBRow>
      </MDBModalBody>
    </MDBModal>
  );
}
