import { MDBModalBody, MDBModal } from "mdbreact";
import React, { useEffect, useState } from "react";
import { ENDPOINT } from "../../../../../services/utilities";
import { FullView } from "./fullView";
import { InformationView } from "./informationView";

const View = ({ isView, toggleView, selected, setIsView }) => {
  const [images, setImages] = useState([]),
    [variant1, setVariant1] = useState(""),
    [variant2, setVariant2] = useState(""),
    [isFullView, setIsFullView] = useState(false),
    [imgForFullView, setImgForFullView] = useState({}),
    [baseImages, setBaseImages] = useState([]),
    [storageOfRemoveImages, setStorageOfRemoveImages] = useState([]),
    thumbnailsPerPage = 4,
    [selectedImage, setSelectedImage] = useState();

  useEffect(() => {
    if (isView) {
      const { media } = selected;
      const productImages = media.product.map(({ label }) => ({
        large: `${ENDPOINT}/assets/products/${selected._id}/${label}.jpg`,
        thumb: `${ENDPOINT}/assets/products/${selected._id}/${label}.jpg`,
        label,
      }));

      const variantImages = media.variant?.options?.map(({ _id }) => ({
        large: `${ENDPOINT}/assets/products/${selected._id}/variant/${_id}.jpg`,
        thumb: `${ENDPOINT}/assets/products/${selected._id}/variant/${_id}.jpg`,
        label: _id,
      }));

      setImages([...productImages, ...variantImages]);
      setBaseImages([...productImages, ...variantImages]);
      setSelectedImage(productImages[0]);
      setStorageOfRemoveImages([]);
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
        {isFullView ? (
          <FullView
            images={baseImages}
            setIsFullView={setIsFullView}
            imgForFullView={imgForFullView}
            selected={selected}
          />
        ) : (
          <InformationView
            selected={selected}
            baseImages={baseImages}
            selectedImage={selectedImage}
            setIsFullView={setIsFullView}
            toggleView={toggleView}
            variant1={variant1}
            setVariant1={setVariant1}
            storageOfRemoveImages={storageOfRemoveImages}
            currentThumbnails={currentThumbnails}
            prevPage={prevPage}
            handleClickThumbnail={handleClickThumbnail}
            nextPage={nextPage}
            totalPages={totalPages}
            setIsView={setIsView}
            setSelectedImage={setSelectedImage}
            setImgForFullView={setImgForFullView}
            variant2={variant2}
            setVariant2={setVariant2}
          />
        )}
      </MDBModalBody>
    </MDBModal>
  );
};

export default View;
