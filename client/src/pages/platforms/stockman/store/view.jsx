import {
  MDBModalBody,
  MDBModal,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
} from "mdbreact";
import React, { useEffect, useState } from "react";
import { ENDPOINT } from "../../../../services/utilities";

const View = ({ isView, toggleView, selected }) => {
  const [images, setImages] = useState([]),
    [variant1, setVariant1] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const thumbnailsPerPage = 4;
  const [selectedImage, setSelectedImage] = useState();

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

  const totalPages = Math.ceil(images.length / thumbnailsPerPage);

  const handleClickThumbnail = (largeImage) => {
    setSelectedImage(largeImage);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * thumbnailsPerPage;
  const currentThumbnails = images.slice(
    startIndex,
    startIndex + thumbnailsPerPage
  );
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
                <img src={selectedImage} alt="Selected" />
              </div>
              <div className="thumbnails">
                <button
                  className="arrow-button left"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                ></button>
                {currentThumbnails.map((image, index) => (
                  <img
                    key={index}
                    src={image.thumb}
                    alt={`Thumbnail ${index + 1}`}
                    className="thumbnail"
                    onClick={() => handleClickThumbnail(image.large)}
                  />
                ))}
                <button
                  className="arrow-button right"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                ></button>
              </div>
            </div>
          </MDBCol>
          <MDBCol>
            <MDBRow className="d-flex align-items-center mt-4">
              <MDBCol md="1" className="mr-3">
                Name:
              </MDBCol>
              <MDBCol>
                <h5 style={{ fontWeight: "500" }}>{selected.name}</h5>
              </MDBCol>
            </MDBRow>

            <MDBRow className="d-flex align-items-center mt-3 ">
              <MDBCol md="1" className="mr-2">
                Price:
              </MDBCol>
              <MDBCol>
                <h3 className=" text-danger font-weight-bold p-2">200</h3>
              </MDBCol>
            </MDBRow>

            {selected.hasVariant && (
              <div className="d-flex align-items-center mt-2">
                {selected.variations[0].name}:
                {selected.variations[0].options.map((option, index) => (
                  <div key={index} className="button-container">
                    <MDBBtn
                      outline
                      color={option.name === variant1 ? "danger" : "primary "}
                      className={`button ${
                        option.name === variant1 ? "selected" : ""
                      }`}
                      onClick={() => setVariant1(option.name)}
                    >
                      {/* <img
                         src="path/to/shoe/image.png"
                         alt={`${color} shoe`}
                         className="button-image"
                       /> */}
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
            )}

            <MDBRow className="mt-4 d-flex align-items-center">
              <MDBCol md="1">Kilo</MDBCol>
              <MDBCol md="6" className="m-0 d-flex align-items-center">
                <input label="kilo" type="number" className="form-control" />
                <select className="form-control">
                  <option>kl</option>
                  <option>1/2 kl</option>
                  <option>1/4 kl</option>
                  <option>1/3 kl</option>
                </select>
              </MDBCol>
              <MDBCol>
                <MDBBtn color="danger" onClick={() => toggleView()}>
                  ADD TO CART
                </MDBBtn>
              </MDBCol>
            </MDBRow>

            <MDBRow className="d-flex align-items-center mt-5">
              <MDBCol md="1">Description:</MDBCol>
              <MDBCol className="ml-5">
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
