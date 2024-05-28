import { MDBBtn, MDBCol, MDBRow } from "mdbreact";
import React, { useState } from "react";
import Swal from "sweetalert2";
import "./product.css";
import Basic from "./basic";
import Informations from "./informations";
import Media from "./media";
import { SAVE } from "../../services/redux/slices/administrator/products";
import { useDispatch, useSelector } from "react-redux";

const _media = {
  product: [
    { img: "", label: "Cover Photo" },
    { img: "", label: "Image 1" },
    { img: "", label: "Image 2" },
    { img: "", label: "Image 3" },
    { img: "", label: "Image 4" },
    { img: "", label: "Image 5" },
    { img: "", label: "Image 6" },
    { img: "", label: "Image 7" },
    { img: "", label: "Image 8" },
  ],

  variant: {
    name: "",
    options: [],
  },
};

const ProductInformation = ({ setIsViewProductInformation }) => {
  const { token } = useSelector(({ auth }) => auth);
  const [media, setMedia] = useState(_media);
  const [form, setForm] = useState({ isPerKilo: false });
  const [variations, setVariations] = useState([]);
  const [variationsWithPrice, setVariationsWithPrice] = useState([]);
  const disptach = useDispatch();

  const dragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, transferIndex) => {
    e.preventDefault();

    const {
      img,
      index: originalIndex,
      title,
    } = JSON.parse(e.dataTransfer.getData("text/plain"));

    const copyLabels =
      title === "product" ? media.product : media.variant?.options;

    const { preview: image = "", img: transferImg } = copyLabels[transferIndex];

    const getLabel = (index) => copyLabels[index].label;

    copyLabels[transferIndex] = {
      label: getLabel(transferIndex),
      img: copyLabels[originalIndex]?.img,
      preview: img,
    };

    copyLabels[originalIndex] = {
      label: getLabel(originalIndex),
      preview: image,
      img: transferImg,
    };

    if (title === "variant") {
      setMedia({
        ...media,
        variant: { ...media.variant, options: copyLabels },
      });
    } else {
      setMedia({
        ...media,
        product: copyLabels,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const coverPhoto = media.product.find(
      ({ label }) => label === "Cover Photo"
    );

    if (!coverPhoto.img)
      return Swal.fire({
        title: "Cover Photo is Required",
        text: "Please Upload a Cover Photo!",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          // Add any actions you want to take when the user confirms
        }
      });
    const productsImages = media?.product
      .map((product) => (product.img ? product : ""))
      .filter(Boolean);

    const newForm = {
      ...form,
      hasVariant: variationsWithPrice.length > 0 ? true : false,
      has2Variant: variationsWithPrice.length === 2 ? true : false,
      variations: variationsWithPrice,
      media: { ...media, product: productsImages },
    };

    disptach(SAVE({ token, data: newForm }));
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Basic form={form} setForm={setForm} />
        <Informations
          variations={variations}
          setVariations={setVariations}
          form={form}
          setForm={setForm}
          variationsWithPrice={variationsWithPrice}
          setVariationsWithPrice={setVariationsWithPrice}
          media={media}
          setMedia={setMedia}
        />
        <Media
          dragOver={dragOver}
          handleDrop={handleDrop}
          media={media}
          setMedia={setMedia}
          variations={variations}
        />
        <MDBRow>
          <MDBCol md="12" className="d-flex justify-content-end mt-3 mr-5">
            <MDBBtn
              color="white"
              onClick={() => setIsViewProductInformation(false)}
            >
              Cancel
            </MDBBtn>
            <MDBBtn color="primary" type="submit">
              Create
            </MDBBtn>
          </MDBCol>
        </MDBRow>
      </form>
    </>
  );
};

export default ProductInformation;
