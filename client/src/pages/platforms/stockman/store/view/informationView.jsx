import React from "react";
import { MDBRow, MDBCol, MDBIcon, MDBBtn } from "mdbreact";
import Kilo from "../orderType/kilo";
import { Quantity } from "../orderType/quantity";
import Variations from "../variations";

export const InformationView = ({
  selected,
  selectedImage,
  toggleView,
  variant1,
  setVariant1,
  storageOfRemoveImages,
  currentThumbnails,
  prevPage,
  setIsFullView,
  handleClickThumbnail,
  nextPage,
  totalPages,
  baseImages,
  setIsView,
  setImgForFullView,
  variant2,
  setVariant2,
  setSelectedImage,
}) => {
  return (
    <MDBRow>
      <MDBCol md="5">
        <div className="gallery-container">
          <div className="main-image">
            <img
              src={selectedImage.large}
              alt="Selected"
              className="cursor-pointer"
              onClick={() => {
                setIsFullView(true);
                setImgForFullView(selectedImage);
              }}
            />
          </div>
          <div className="thumbnails">
            <button
              className="arrow-button left"
              disabled={storageOfRemoveImages.length === 0}
              onClick={prevPage}
            ></button>
            {currentThumbnails.map((image, index) => (
              <img
                key={index}
                onMouseEnter={() => handleClickThumbnail(image)}
                src={image?.thumb}
                alt={`Thumbnail ${index + 1}`}
                className="thumbnail"
                onClick={() => {
                  handleClickThumbnail(image);
                  setImgForFullView(image);
                  setIsFullView(true);
                }}
              />
            ))}
            <button
              className="arrow-button right"
              onClick={nextPage}
              disabled={totalPages === 1}
            ></button>
          </div>
        </div>
      </MDBCol>
      <MDBCol>
        <div className="d-flex justify-content-end">
          <MDBIcon
            icon="times"
            style={{ color: "gray" }}
            className="cursor-pointer"
            onClick={() => setIsView(false)}
          />
        </div>
        <MDBRow className="d-flex align-items-center mt-4">
          <MDBCol md="2">
            <h6 className="text-start">Name:</h6>
          </MDBCol>
          <MDBCol>
            <h5 style={{ fontWeight: "500" }}>{selected.name}</h5>
          </MDBCol>
        </MDBRow>

        <MDBRow className="d-flex align-items-center mt-3">
          <MDBCol md="2">
            <h6>Material:</h6>
          </MDBCol>
          <MDBCol>
            <h5 style={{ fontWeight: "400" }}>{selected.material}</h5>
          </MDBCol>
        </MDBRow>

        <MDBRow className="d-flex align-items-center mt-3">
          <MDBCol md="2">
            <h6>Category:</h6>
          </MDBCol>
          <MDBCol>
            <h5 style={{ fontWeight: "400" }}>{selected.category}</h5>
          </MDBCol>
        </MDBRow>

        {selected.hasVariant && (
          <Variations
            has2Variant={selected.has2Variant}
            variations={selected.variations}
            images={baseImages}
            setVariant1={setVariant1}
            variant1={variant1}
            selected={selected}
            variant2={variant2}
            setVariant2={setVariant2}
            setSelectedImage={setSelectedImage}
          />
        )}
        {selected.isPerKilo ? (
          <Kilo toggleView={toggleView} />
        ) : (
          <Quantity toggleView={toggleView} />
        )}
        <MDBRow className="d-flex align-items-center mt-5">
          <MDBCol md="2">
            <h6>Description:</h6>
          </MDBCol>
          <MDBCol>
            <h6 style={{ fontWeight: "400" }}>{selected.description}</h6>
          </MDBCol>
        </MDBRow>
      </MDBCol>
    </MDBRow>
  );
};
