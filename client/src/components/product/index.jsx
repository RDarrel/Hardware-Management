import { MDBBtn, MDBCol, MDBRow } from "mdbreact";
import React, { useState } from "react";
import "./product.css";
import Basic from "./basic";
import Informations from "./informations";
import Media from "./media";

const _labels = [
  { img: "", label: "Cover Photo" },
  { img: "", label: "Image 1" },
  { img: "", label: "Image 2" },
  { img: "", label: "Image 3" },
  { img: "", label: "Image 4" },
  { img: "", label: "Image 5" },
  { img: "", label: "Image 6" },
  { img: "", label: "Image 7" },
  { img: "", label: "Image 8" },
];
const ProductInformation = ({ setIsViewProductInformation }) => {
  const [labels, setLabels] = useState(_labels);

  const dragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, transferIndex) => {
    e.preventDefault();

    const { img, index: originalIndex } = JSON.parse(
      e.dataTransfer.getData("text/plain")
    );

    const copyLabels = [...labels];
    const newImg = { ...copyLabels[transferIndex], img };

    const swapInOriginalIndex = {
      ...copyLabels[transferIndex],
      img: copyLabels[transferIndex].img,
    };

    copyLabels[transferIndex] = newImg;
    copyLabels[originalIndex] = swapInOriginalIndex;

    console.log(copyLabels[originalIndex]);
    setLabels(copyLabels);
  };

  return (
    <>
      <Basic />
      <Informations />
      <Media
        dragOver={dragOver}
        handleDrop={handleDrop}
        labels={labels}
        setLabels={setLabels}
      />
      <MDBRow>
        <MDBCol md="12" className="d-flex justify-content-end mt-3 mr-5">
          <MDBBtn
            color="white"
            onClick={() => setIsViewProductInformation(false)}
          >
            Cancel
          </MDBBtn>
          <MDBBtn color="danger">Create</MDBBtn>
        </MDBCol>
      </MDBRow>
    </>
  );
};

export default ProductInformation;
