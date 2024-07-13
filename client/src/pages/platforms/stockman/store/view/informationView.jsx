import React, { useEffect, useState } from "react";
import { MDBRow, MDBCol, MDBIcon } from "mdbreact";
import Kilo from "../orderType/kilo";
import { Quantity } from "../orderType/quantity";
import Variations from "../variations";
import CustomSelect from "../../../../../components/customSelect";

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
  quantity,
  setQuantity,
  kilo,
  setKilo,
  kiloGrams,
  isCashier,
  setKiloGrams,
  suppliers,
  supplier,
  setSupplier,
  handleSubmit,
}) => {
  const [price, setPrice] = useState(200);

  useEffect(() => {
    const getTheMinAndMaxSrp = (srps) => {
      const srpValues = srps.flat(1).map((item) => item.srp);
      const minSrp = Math.min(...srpValues);
      const maxSrp = Math.max(...srpValues);
      setPrice(`${minSrp} - ₱${maxSrp}`);
    };
    //this is for default price
    if (selected.hasVariant) {
      if (selected.has2Variant) {
        const srps = [
          ...selected.variations[0].options.map(({ prices }) => prices),
        ];
        getTheMinAndMaxSrp(srps);
      } else {
        const srps = [...selected.variations[0].options];
        getTheMinAndMaxSrp(srps);
      }
    } else {
      setPrice(selected.price);
    }
  }, [selected]);
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
              type="button"
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
              type="button"
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
        {isCashier && (
          <MDBRow className="mt-2">
            <MDBCol md="2">
              <h6 className="text-start">Price:</h6>
            </MDBCol>
            <MDBCol>
              <h5 style={{ fontWeight: "700" }} className="text-danger">
                ₱{price}
              </h5>
            </MDBCol>
          </MDBRow>
        )}
        <MDBRow className="d-flex align-items-center mt-3">
          <MDBCol md="2">
            <h6>Material:</h6>
          </MDBCol>
          <MDBCol>
            <h5 style={{ fontWeight: "400" }}>{selected.material?.name}</h5>
          </MDBCol>
        </MDBRow>

        <MDBRow className="d-flex align-items-center mt-3">
          <MDBCol md="2">
            <h6>Category:</h6>
          </MDBCol>
          <MDBCol>
            <h5 style={{ fontWeight: "400" }}>{selected.category?.name}</h5>
          </MDBCol>
        </MDBRow>

        {selected.hasVariant && (
          <Variations
            has2Variant={selected.has2Variant}
            variations={selected.variations}
            images={baseImages}
            setVariant1={setVariant1}
            setPrice={setPrice}
            variant1={variant1}
            selected={selected}
            variant2={variant2}
            setVariant2={setVariant2}
            setSelectedImage={setSelectedImage}
          />
        )}

        <MDBRow className="d-flex align-items-center mt-2 ">
          <MDBCol md="2">
            <h6>Supplier:</h6>
          </MDBCol>
          <MDBCol md="5">
            <CustomSelect
              className="m-0 p-0"
              preValue={supplier}
              choices={suppliers || []}
              texts="company"
              values="_id"
              onChange={(value) => setSupplier(value)}
            />
          </MDBCol>
        </MDBRow>
        {selected.isPerKilo ? (
          <Kilo
            toggleView={toggleView}
            kilo={kilo}
            setKilo={setKilo}
            kiloGrams={kiloGrams}
            handleSubmit={handleSubmit}
            setKiloGrams={setKiloGrams}
          />
        ) : (
          <Quantity
            toggleView={toggleView}
            quantity={quantity}
            handleSubmit={handleSubmit}
            setQuantity={setQuantity}
          />
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
