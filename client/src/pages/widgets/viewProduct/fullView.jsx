import { MDBCardImage, MDBCol, MDBIcon, MDBRow } from "mdbreact";
import React, { useEffect, useState } from "react";

export const FullView = ({
  setIsFullView,
  imgForFullView,
  selected,
  images,
}) => {
  const [activeIndex, setActiveIndex] = useState(-1),
    [activeImg, setActiveImg] = useState({});

  useEffect(() => {
    if (selected._id) {
      const index = images.findIndex(
        ({ label }) => label === imgForFullView.label
      );
      setActiveIndex(index);
      setActiveImg(imgForFullView);
    }
  }, [selected, imgForFullView, images]);

  const handleNextPage = () => {
    setActiveIndex((prev) => prev + 1);
    setActiveImg(images[activeIndex + 1]);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => prev - 1);
    setActiveImg(images[activeIndex - 1]);
  };

  return (
    <MDBRow>
      <MDBCol md="7">
        <div className="thumbnails">
          <button
            type="button"
            className="arrow-button left ml-3"
            onClick={handlePrev}
            disabled={activeIndex === 0}
          ></button>
          <MDBCardImage
            cascade
            src={activeImg.large}
            style={{ height: "500px", width: "100%" }}
          />
          <button
            type="button"
            className="arrow-button right mr-3"
            onClick={handleNextPage}
            disabled={activeIndex === images.length - 1}
          ></button>
        </div>
      </MDBCol>

      <MDBCol md="5">
        <div className="d-flex justify-content-end">
          <MDBIcon
            icon="times"
            style={{ color: "gray" }}
            className="cursor-pointer"
            onClick={() => setIsFullView(false)}
          />
        </div>
        <MDBRow className="mt-4">
          <MDBCol>
            <h5 className="text-truncate" style={{ fontWeight: "500" }}>
              {selected.name}
            </h5>
          </MDBCol>
        </MDBRow>
        <div className="d-flex flex-wrap mb-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="mt-2"
              style={{
                flex: "0 0 27%",
                margin: "0px",
                padding: "0px",
              }}
            >
              <img
                className={`cursor-pointer border border-${
                  index === activeIndex ? "danger" : ""
                }`}
                alt="img"
                onClick={() => {
                  setActiveImg(image);
                  setActiveIndex(index);
                }}
                src={image.thumb}
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          ))}
        </div>
        <MDBRow className="mt-2"></MDBRow>
      </MDBCol>
    </MDBRow>
  );
};
