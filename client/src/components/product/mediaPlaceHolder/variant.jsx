// ImagePlaceholder.js
import React from "react";
import "./media.css";
import { MDBIcon } from "mdbreact";

const OptionImg = ({ label, setMedia, index, img, media }) => {
  const handleRemoveImg = () => {
    const optionsImages = [...media.variant.options];
    optionsImages[index] = { ...optionsImages[index], img: "", preview: "" };
    setMedia({
      ...media,
      variant: { ...media.variant, options: optionsImages },
    });
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
        const options = [...media?.variant?.options];
        const newImg = {
          ...options[index],
          img: base64String,
          preview: URL.createObjectURL(file),
        };
        options[index] = newImg;
        setMedia({ ...media, variant: { ...media.variant, options } });
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
              className="remove-icon "
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

      <h6 className="text-center w-75">{label || "Option"}</h6>
    </div>
  );
};

export default OptionImg;
