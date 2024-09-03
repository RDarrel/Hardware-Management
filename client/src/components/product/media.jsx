import React from "react";
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBTypography,
} from "mdbreact";
import ProductImg from "./mediaPlaceHolder/product";
import OptionImg from "./mediaPlaceHolder/variant";

function Media({
  handleDrop,
  media,
  dragOver,
  setMedia,
  variations,
  willCreate,
  handleClearForm,
  isDuplicateName = false,
  hasDuplicateVariant = false,
  hasDuplicateOption = false,
  hasDuplicateBarcode = false,
  isSubmit = true,
}) {
  const isDisAble =
    isDuplicateName ||
    hasDuplicateVariant ||
    hasDuplicateOption ||
    hasDuplicateBarcode;

  const handleWarningMessage = (msg) => {
    return (
      <MDBTypography
        variant="h2"
        bqColor="primary"
        className="mb-0 text-black-50"
        noteColor="danger"
        note
        noteTitle="Warning: "
      >
        {msg}
      </MDBTypography>
    );
  };
  return (
    <MDBRow className="mt-3">
      <MDBCol md="12">
        <MDBCard>
          <MDBCardBody>
            <h5 className="font-weight-bold">Media Management</h5>
            <MDBRow>
              <MDBCol md="2" className="d-flex justify-content-end ">
                <h6 className="mt-4">Product Images</h6>
              </MDBCol>
              <MDBCol md="10" className=" d-flex justify-content-between">
                <MDBRow>
                  {media?.product?.map(({ preview: img, label }, index) => (
                    <MDBCol
                      key={index}
                      md="2"
                      draggable="true"
                      onDragStart={(e) => {
                        e.dataTransfer.setData(
                          "text/plain",
                          JSON.stringify({ img, index, title: "product" })
                        );
                      }}
                      onDragOver={dragOver}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <ProductImg
                        index={index}
                        media={media}
                        label={label}
                        setMedia={setMedia}
                        img={img}
                      />
                    </MDBCol>
                  ))}
                </MDBRow>
              </MDBCol>
            </MDBRow>

            {variations.length > 0 && (
              <MDBRow className="mt-2">
                <MDBCol md="2" className="d-flex justify-content-end ">
                  <h6 className="mt-4">{variations[0].name || "Name"}</h6>
                </MDBCol>
                <MDBCol md="10">
                  <MDBRow>
                    {media.variant?.options?.map(
                      ({ preview: img, label }, index) => (
                        <MDBCol
                          key={index}
                          md="2"
                          className="text-center"
                          draggable="true"
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              "text/plain",
                              JSON.stringify({ img, index, title: "variant" })
                            );
                          }}
                          onDragOver={dragOver}
                          onDrop={(e) => handleDrop(e, index)}
                        >
                          <OptionImg
                            index={index}
                            label={label}
                            media={media}
                            setMedia={setMedia}
                            img={img}
                          />
                        </MDBCol>
                      )
                    )}
                  </MDBRow>
                </MDBCol>
              </MDBRow>
            )}

            <MDBRow>
              <MDBCol
                md="12"
                className={`d-flex justify-content-${
                  isDisAble ? "between" : "end"
                } align-items-center mt-3 mr-5`}
              >
                {isDuplicateName
                  ? handleWarningMessage(
                      "Sorry But this product is Already Exist"
                    )
                  : hasDuplicateBarcode
                  ? handleWarningMessage(
                      "Sorry, but this barcode is either a duplicate or already associated with another product. Please double-check your barcode."
                    )
                  : (hasDuplicateVariant || hasDuplicateOption) &&
                    handleWarningMessage(` Sorry but you have a duplicate
                        ${hasDuplicateVariant ? "variant" : "option"}`)}
                <div>
                  <MDBBtn color="white" onClick={handleClearForm}>
                    Cancel
                  </MDBBtn>
                  <MDBBtn
                    color="primary"
                    type={isSubmit ? "submit" : "button"}
                    disabled={isDisAble}
                  >
                    {willCreate ? "Publish" : "Update"}
                  </MDBBtn>
                </div>
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
}

export default Media;
