import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
  MDBCol,
  MDBTable,
  MDBBadge,
  MDBModalFooter,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  ENDPOINT,
  fullName,
  variation,
} from "../../../../../services/utilities";
import { BROWSE } from "../../../../../services/redux/slices/administrator/suppliers";
import { UPDATE } from "../../../../../services/redux/slices/stockman/purchases";
import CustomInput from "../../../CustomInput";
import CustomSelect from "../../../../../components/customSelect";
import Swal from "sweetalert2";

export default function Modal({
  show,
  toggle,
  merchandises,
  setMerchandises,
  purchase,
  isApproved = false,
}) {
  const { token } = useSelector(({ auth }) => auth),
    { collections: _suppliers = [] } = useSelector(
      ({ suppliers }) => suppliers
    ),
    [suppliers, setSuppliers] = useState([]),
    [supplier, setSupplier] = useState(""),
    [products, setProducts] = useState([]),
    [total, setTotal] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    if (!!merchandises) {
      const productsWithSubtotal = merchandises.map((merchandise) => {
        const { quantity, kilo, kiloGrams } = merchandise;
        return {
          ...merchandise,
          subtotal: variation.getTheSubTotal(
            "capital",
            {
              ...merchandise,
              quantity: quantity?.approved,
              kilo: kilo?.approved,
              kiloGrams: kiloGrams?.approved,
            },
            merchandise.product
          ),
        };
      });
      const _total = productsWithSubtotal.reduce((acc, curr) => {
        return (acc += curr.subtotal);
      }, 0);
      setTotal(_total);
      setProducts(productsWithSubtotal);
    }
  }, [merchandises]);

  useEffect(() => {
    dispatch(BROWSE({ token, key: { status: "true" } }));
  }, [token, dispatch]);

  useEffect(() => {
    if (!!_suppliers) {
      setSuppliers(_suppliers);
      setSupplier(_suppliers[0]?._id);
    }
  }, [_suppliers]);

  const handleSubmit = () => {
    const supplierName = suppliers.find(({ _id }) => _id === supplier).company;
    Swal.fire({
      title: "Are you sure?",
      text: `Before proceeding with your approval, please double-check that the supplier ${supplierName} is correct.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          UPDATE({
            token,
            data: {
              purchase: {
                ...purchase,
                supplier,
                total,
                status: "approved",
                approved: new Date().toDateString(),
              },
              merchandises: products,
            },
          })
        );
        toggle();

        Swal.fire({
          title: "Approval Confirmed",
          text: `Your Approval has been confirmed with supplier: ${supplierName}.`,
          icon: "success",
        });
      }
    });
  };

  const handleClose = () => {
    toggle();
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="fluid">
      <MDBModalHeader
        toggle={handleClose}
        className=" light-blue darken-3 white-text  d-flex align-items-center"
        tag="h4"
      >
        <MDBIcon icon="user" className="mr-2" />
        Requested by {fullName(purchase?.requestBy?.fullName)}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <div style={{ maxHeight: "500px", overflowY: "auto" }}>
          <MDBTable>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th className="text-center">Requested Quantity/Kilo</th>
                <th className="text-center">Approved Quantity/kilo</th>
                <th className="text-center">Capital</th>
                <th className="text-center">Subtotal</th>
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
                  } = merchandise;
                  const { media = {} } = product;
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
                            quantity: quantity?.request,
                            kilo: kilo?.request,
                            kiloGrams: kiloGrams?.request,
                          },
                          product.isPerKilo
                        )}
                      </td>
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
                              index={index}
                            />
                          </div>
                        ) : (
                          <>
                            {variation.qtyOrKilo(
                              {
                                ...merchandise,
                                quantity: quantity?.approved,
                                kilo: kilo?.approved,
                                kiloGrams: kiloGrams?.approved,
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
                choices={suppliers}
                texts="company"
                values="_id"
                disabledAllExceptSelected={isApproved}
                preValue={supplier}
                onChange={(value) => setSupplier(value)}
                label={"Supplier"}
              />
            </div>
            <MDBBadge color="light" className="float-right">
              <h6 className="font-weight-bolder text-danger">
                Total Amount: ₱{total.toLocaleString()}
              </h6>
            </MDBBadge>
          </MDBCol>
        </MDBRow>
      </MDBModalBody>
      {!isApproved && (
        <MDBModalFooter>
          <div className="text-end">
            <MDBBtn
              color="success"
              className="float-right"
              onClick={handleSubmit}
            >
              Approved
            </MDBBtn>
          </div>
        </MDBModalFooter>
      )}
    </MDBModal>
  );
}
