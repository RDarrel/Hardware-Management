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
  const [variations, setVariations] = useState([
    {
      title: "Variation 1",
      name: "Color",
      options: ["Red", "Blue", "Black"],
    },
    // {
    //   title: "Variation 2",
    //   name: "Size",
    //   options: ["SM", "MD", "LG", "XL"],
    // },
  ]);

  const dragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, transferIndex) => {
    e.preventDefault();

    const { img, index: originalIndex } = JSON.parse(
      e.dataTransfer.getData("text/plain")
    );

    const copyLabels = [...labels];
    const { img: image = "" } = copyLabels[transferIndex];

    const getLabel = (index) => copyLabels[index].label;

    copyLabels[transferIndex] = { label: getLabel(transferIndex), img };
    copyLabels[originalIndex] = {
      label: getLabel(originalIndex),
      img: image,
    };

    setLabels(copyLabels);
  };

  return (
    <>
      <Basic />
      <Informations variations={variations} setVariations={setVariations} />
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
