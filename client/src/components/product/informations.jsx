import React from "react";
import { v4 as uuidv4 } from "uuid";

import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBInputGroup,
} from "mdbreact";
import Variations from "./variations";

function Informations({
  variations,
  setVariations,
  form,
  setForm,
  media,
  setMedia,
  variationsWithPrice,
  setVariationsWithPrice,
}) {
  const handleEnableVariation = () => {
    const optionID = uuidv4();
    const variantID = uuidv4();

    setMedia({
      ...media,
      variant: {
        _id: variantID,
        title: "Variation 1",
        name: "",
        options: [{ label: "", _id: optionID }],
      },
    });

    setVariations([
      {
        _id: variantID,
        title: "Variation 1",
        name: "",
        options: [{ name: "", _id: optionID }],
      },
    ]);
  };

  return (
    <MDBRow className="mt-3">
      <MDBCol md="12">
        <MDBCard>
          <MDBCardBody>
            <h5 className="font-weight-bold">Sales Information</h5>
            {variations.length === 0 ? (
              <>
                <MDBRow className="mt-5">
                  <MDBCol
                    md="2"
                    className="d-flex justify-content-end align-items-center"
                  >
                    <h6>Price</h6>
                  </MDBCol>
                  <MDBCol md="10">
                    <MDBInputGroup
                      prepend="₱"
                      type="number"
                      value={form.price}
                      onChange={({ target }) =>
                        setForm({ ...form, price: target.value })
                      }
                    />
                  </MDBCol>
                </MDBRow>

                <MDBRow className="mt-5">
                  <MDBCol
                    md="2"
                    className="d-flex justify-content-end align-items-center"
                  >
                    <h6>Variations</h6>
                  </MDBCol>
                  <MDBCol md="10">
                    <MDBBtn
                      color="white"
                      className="add-price-tier-button  d-flex align-items-center justify-content-center"
                      block
                      onClick={handleEnableVariation}
                    >
                      <MDBIcon icon="plus" className="blue-text" />
                      <span className="blue-text ">Enable Variations</span>
                    </MDBBtn>
                  </MDBCol>
                </MDBRow>
              </>
            ) : (
              <Variations
                variations={variations}
                setVariations={setVariations}
                media={media}
                variationsWithPrice={variationsWithPrice}
                setVariationsWithPrice={setVariationsWithPrice}
                setMedia={setMedia}
              />
            )}
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
}

export default Informations;
