import {
  MDBModalBody,
  MDBModal,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBCardImage,
} from "mdbreact";
import React, { useEffect, useState } from "react";
import { ENDPOINT } from "../../../../../services/utilities";
import Kilo from "../orderType/kilo";
import { Quantity } from "../orderType/quantity";

const View = ({ isView, toggleView, selected, setIsView }) => {
  const [images, setImages] = useState([]),
    [variant1, setVariant1] = useState(""),
    [storageOfRemoveImages, setStorageOfRemoveImages] = useState([]),
    thumbnailsPerPage = 4,
    [selectedImage, setSelectedImage] = useState();

  useEffect(() => {
    if (isView) {
      const { media } = selected;
      const productImages = media.product.map(({ label }) => ({
        large: `${ENDPOINT}/assets/products/${selected._id}/${label}.jpg`,
        thumb: `${ENDPOINT}/assets/products/${selected._id}/${label}.jpg`,
      }));

      const variantImages = media.variant?.options?.map(({ _id }) => ({
        large: `${ENDPOINT}/assets/products/${selected._id}/variant/${_id}.jpg`,
        thumb: `${ENDPOINT}/assets/products/${selected._id}/variant/${_id}.jpg`,
      }));

      setImages([...productImages, ...variantImages]);
      setSelectedImage(productImages[0].large);
    }
  }, [selected, isView]);

  const handleClickThumbnail = (largeImage) => {
    setSelectedImage(largeImage);
  };

  const nextPage = () => {
    const _images = [...images];
    const _removeImages = [...storageOfRemoveImages];
    const removedImage = _images.shift();
    _removeImages.push(removedImage);
    setImages(_images);
    setStorageOfRemoveImages(_removeImages);
  };

  const prevPage = () => {
    const _images = [...images];
    const _removeImages = [...storageOfRemoveImages];
    const lastIndex = _removeImages.length - 1;
    _images.unshift(_removeImages[lastIndex]);
    _removeImages.splice(lastIndex, 1);
    setImages(_images);
    setStorageOfRemoveImages(_removeImages);
  };

  const totalPages = Math.ceil(images.length / thumbnailsPerPage);
  const currentThumbnails = images.slice(0, 0 + 4);
  return (
    <MDBModal
      isOpen={isView}
      toggle={toggleView}
      backdrop
      disableFocusTrap={false}
      size="xl"
    >
      <MDBModalBody className="mb-0">
        <MDBRow>
          <MDBCol md="5">
            <div className="gallery-container">
              <div className="main-image">
                <MDBCardImage src={selectedImage} alt="Selected" />
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
                    onMouseEnter={() => handleClickThumbnail(image?.large)}
                    src={image?.thumb}
                    alt={`Thumbnail ${index + 1}`}
                    className="thumbnail"
                    onClick={() => handleClickThumbnail(image.large)}
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
              <MDBRow className="d-flex align-items-center mt-2">
                <MDBCol md="2">
                  <h6>{selected.variations[0].name}:</h6>
                </MDBCol>

                <MDBCol>
                  <div className="d-flex">
                    {selected.variations[0].options.map((option, index) => (
                      <div key={index} className="button-container mr-2">
                        <MDBBtn
                          outline
                          size="sm"
                          color={option.name === variant1 ? "danger" : "dark"}
                          className={`button  ${
                            option.name === variant1 ? "selected" : ""
                          }`}
                          onClick={() => setVariant1(option.name)}
                        >
                          <small className="text-dark">{option.name}</small>
                          {option.name === variant1 && (
                            <div className="check-icon-background">
                              <MDBIcon icon="check" className="check-icon" />
                            </div>
                          )}
                        </MDBBtn>
                      </div>
                    ))}
                  </div>
                </MDBCol>
              </MDBRow>
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
      </MDBModalBody>
    </MDBModal>
  );
};

export default View;
