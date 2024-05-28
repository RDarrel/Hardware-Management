// ImagePlaceholder.js
import React from "react";
import { MDBCol, MDBIcon, MDBRow } from "mdbreact";

const ProductImg = ({ label, setMedia, index, img, media }) => {
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.onload = ({ target }) => {
      const { result } = target;

      const img = new Image();
      img.src = result;

      img.onload = () => {
        const base64String = result.split(",")[1];
        const product = [...media.product];
        const newImg = {
          ...product[index],
          img: base64String,
          preview: URL.createObjectURL(file),
        };
        product[index] = newImg;
        setMedia({ ...media, product });
      };
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="image-placeholder">
        {img ? (
          <img src={img} alt={label} className="uploaded-image" />
        ) : (
          <>
            <MDBIcon icon="plus" className="blue-text" size="2x" />
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="file-input"
          onChange={handleImageChange}
        />
      </div>
      <MDBRow className={`${index === 0 ? "ml-2" : "ml-4"} `}>
        <MDBCol md="12">
          <h6 className="text-center text-nowrap">
            {index === 0 ? `*${label}` : label}
          </h6>
        </MDBCol>
      </MDBRow>
    </>
  );
};

export default ProductImg;
