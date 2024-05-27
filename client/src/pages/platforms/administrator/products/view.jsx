import {
  MDBModalBody,
  MDBModal,
  MDBRow,
  MDBCol,
  MDBCardImage,
  MDBBtn,
  MDBModalFooter,
} from "mdbreact";
import React, { useEffect, useState } from "react";
import { ENDPOINT } from "../../../../services/utilities";

const View = ({ isView, toggleView, selected }) => {
  const [activeSize, setActiveSize] = useState(""),
    [price, setPrice] = useState(0);

  useEffect(() => {
    if (selected?.isPerSize && isView) {
      const prices = selected?.sizes.map(({ price: p }) => p);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      setPrice(
        minPrice === maxPrice ? `₱${minPrice}` : `₱${minPrice} - ₱${maxPrice}`
      );
    }
  }, [isView, selected]);

  useEffect(() => {
    if (selected.isPerSize && activeSize) {
      const _price = selected.sizes.find(
        ({ size }) => size === activeSize
      ).price;
      setPrice(`₱${_price}`);
    }
  }, [activeSize, selected]);

  return (
    <MDBModal
      isOpen={isView}
      toggle={toggleView}
      backdrop
      disableFocusTrap={false}
      size="lg"
    >
      <MDBModalBody className="mb-0">
        <MDBRow>
          <MDBCol md="4" className="border border-black">
            <MDBCardImage
              className="img-fluid d-flex justify-content-center"
              src={`${ENDPOINT}/assets/products/${selected.name}-${selected._id}.jpg`}
              style={{ height: "250px" }}
            />
          </MDBCol>
          <MDBCol>
            <MDBRow className="d-flex align-items-center mt-4">
              <MDBCol md="1" className="mr-3">
                <h5>Name:</h5>
              </MDBCol>
              <MDBCol>
                <h3 style={{ fontWeight: "400" }}>{selected.name}</h3>
              </MDBCol>
            </MDBRow>

            <MDBRow className="d-flex align-items-center mt-3">
              <MDBCol md="1" className="mr-5">
                <h5>Description:</h5>
              </MDBCol>
              <MDBCol className="ml-3">
                <h5 style={{ fontWeight: "400" }}>{selected.description}</h5>
              </MDBCol>
            </MDBRow>

            <MDBRow className="d-flex align-items-center mt-3 ">
              <MDBCol md="1" className="mr-2">
                <h5 className="mr-2">Price:</h5>
              </MDBCol>
              <MDBCol>
                <h3 className=" text-danger font-weight-bold p-2">
                  {selected.isPerSize ? price : selected.price}
                </h3>
              </MDBCol>
            </MDBRow>

            {selected.isPerSize && (
              <div className="d-flex align-items-center mt-2">
                <h5 className="mr-2 mb-0">Size:</h5>
                <div>
                  {selected.sizes.map(({ size }, index) => (
                    <MDBBtn
                      key={index}
                      rounded
                      size="sm"
                      color="primary"
                      outline={size !== activeSize}
                      onClick={() => setActiveSize(size)}
                      className="mr-2 font-weight-bold"
                    >
                      {size}
                    </MDBBtn>
                  ))}
                </div>
              </div>
            )}
            {/* <MDBRow className="d-flex align-items-center mt-2">
              <MDBCol>
                <input
                  placeholder="Kilo"
                  className="form-control"
                  value={kilo}
                  type="number"
                  onChange={({ target }) => setKilo(target.value)}
                />
              </MDBCol>
              <MDBCol>
                <CustomSelect
                  choices={[
                    { text: "KL", value: 1 },
                    { text: "1/4", value: 0.25 },
                    { text: "1/2", value: 0.5 },
                    { text: "3/4", value: 0.75 },
                  ]}
                  preValue={1}
                  texts="text"
                  values="value"
                  label={"kilograms "}
                  onChange={(value) => setKiloGrams(value)}
                />
              </MDBCol>
            </MDBRow> */}
          </MDBCol>
        </MDBRow>
      </MDBModalBody>
      <MDBModalFooter className="text-end">
        <MDBBtn color="primary" onClick={() => toggleView()}>
          Close
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  );
};

export default View;
