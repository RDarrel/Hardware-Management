// ImagePlaceholder.js
import React from "react";
import { MDBCol, MDBIcon, MDBRow } from "mdbreact";

const ProductImg = ({ label, setMedia, index, img, media }) => {
  const handleRemoveImg = () => {
    const productsImages = [...media.product];
    productsImages[index] = { ...productsImages[index], img: "", preview: "" };
    console.log(productsImages[index]);
    setMedia({ ...media, product: productsImages });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return false;
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
    <div>
      <div className={`image-placeholder ${img ? "" : "hasImage"}`}>
        {img ? (
          <>
            <img src={img} alt={label} className="uploaded-image" />
            <MDBIcon
              icon="times"
              className="remove-icon bg-danger"
              onClick={handleRemoveImg}
            />
          </>
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

      <h6 className="text-center w-75 ">{index === 0 ? `*${label}` : label}</h6>
    </div>
  );
};

export default ProductImg;
