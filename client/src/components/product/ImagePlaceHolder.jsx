// ImagePlaceholder.js
import React from "react";
import { MDBIcon } from "mdbreact";

const ImagePlaceholder = ({ label, setLabels, index, img }) => {
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLabels((prev) => {
          const _labels = [...prev];
          const newImg = {
            ..._labels[index],
            img: reader.result,
          };
          _labels[index] = newImg;
          return _labels;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-placeholder">
      {img ? (
        <img src={img} alt={label} className="uploaded-image" />
      ) : (
        <>
          <MDBIcon icon="plus" className="blue-text" size="2x" />
          <span className="image-label">{label}</span>
        </>
      )}
      <input
        type="file"
        accept="image/*"
        className="file-input"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ImagePlaceholder;
