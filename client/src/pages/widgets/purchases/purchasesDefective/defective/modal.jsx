import React, { useEffect, useState } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
  MDBCol,
  MDBBadge,
  MDBTable,
  MDBDatePicker,
  MDBModalFooter,
  MDBBtn,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import {
  ENDPOINT,
  fullName,
  variation,
} from "../../../../../services/utilities";
import CustomSelect from "../../../../../components/customSelect";

const _form = {
  name: "",
  description: "",
  capacity: 50,
};

export default function Modal({
  show,
  toggle,
  isAdmin,
  merchandises,
  stockman,
  expectedDelivered,
  setExpectedDelivered,
  supplier,
  total,
}) {
  const { token } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    dispatch = useDispatch();

  const handleClose = () => {
    setForm(_form);
    toggle();
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size={"xl"}>
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text "
        tag="h5"
      >
        <MDBIcon icon="shipping-fast" className="mr-2" />
        Received By: {fullName(stockman?.fullName)}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBTable>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th className="text-center">Defective Quantity/Kilo</th>
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
                        product.isPerKilo
                          ? {
                              kilo: kilo.defective,
                              kiloGrams: kiloGrams.defective,
                            }
                          : { quantity: quantity.defective },
                        product.isPerKilo
                      )}
                    </td>
                    {isAdmin && (
                      <>
                        <td className="text-danger text-center font-weight-bold">
                          ₱ {capital.toLocaleString()}
                        </td>
                        <td className="text-danger text-center font-weight-bold">
                          ₱{" "}
                          {product.isPerKilo
                            ? kilo.defective ||
                              0 + kiloGrams.defective ||
                              0 * capital
                            : quantity.defective * capital}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </MDBTable>

        <MDBRow className="d-flex align-items-center m-0">
          <MDBCol md="4">
            <MDBBadge color="light">
              <h6>
                Total of ({!!merchandises ? merchandises.length : 0}) Products
              </h6>
            </MDBBadge>
          </MDBCol>
          {isAdmin && (
            <MDBCol
              md="8"
              className="d-flex align-items-center justify-content-end"
            >
              <div className="w-25 mr-3">
                <span>
                  Supplier: <strong>{supplier?.company}</strong>
                </span>
              </div>

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
              <MDBBadge color="light" className="float-right">
                <h6 className="font-weight-bolder text-danger">
                  Total Amount: ₱{total.toLocaleString()}
                </h6>
              </MDBBadge>
            </MDBCol>
          )}
        </MDBRow>
      </MDBModalBody>
      {isAdmin && (
        <MDBModalFooter className="m-0 p-0">
          <MDBBtn color="danger">Refund</MDBBtn>
          <MDBBtn color="primary">Replace</MDBBtn>
        </MDBModalFooter>
      )}
    </MDBModal>
  );
}
