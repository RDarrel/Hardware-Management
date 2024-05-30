import { MDBBtn, MDBCol, MDBRow } from "mdbreact";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./product.css";
import Basic from "./basic";
import Informations from "./informations";
import Media from "./media";
import { SAVE } from "../../services/redux/slices/administrator/products";
import { useDispatch, useSelector } from "react-redux";
import { ENDPOINT } from "../../services/utilities";

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

const ProductInformation = ({
  setIsViewProductInformation,
  selected,
  willCreate = true,
}) => {
  const { token } = useSelector(({ auth }) => auth);
  const [media, setMedia] = useState(_media);
  const [form, setForm] = useState({ isPerKilo: false });
  const [variations, setVariations] = useState([]);
  const [variationsWithPrice, setVariationsWithPrice] = useState([]);
  const [oldPricesForVr2, setOldPricesForVr2] = useState([]);
  const disptach = useDispatch();

  const imgToBase64 = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(
          `Failed to fetch image: ${url}, status: ${response.status}`
        );
        return false;
      }

      const blob = await response.blob();
      if (!blob.type.startsWith("image/")) {
        return false;
      }
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => {
          console.error(`Failed to read blob as data URL: ${url}`);
          reject(null);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!willCreate) {
        const {
          hasVariant,
          variations = [],
          media: mediaSelected = {},
        } = selected || {};
        const { variant = {}, product: productImages } = mediaSelected || {};

        if (hasVariant) {
          // Fetch images and convert to Base64
          const getTheImageOfOptions = async () => {
            const promises = variant.options.map(async ({ label, _id }) => {
              const img = `${ENDPOINT}/assets/products/${selected.name}-${selected._id}/variant/${_id}.jpg`;
              const base64 = await imgToBase64(img);
              return {
                label,
                _id,
                img: base64 || "",
                preview: base64 ? img : "",
              };
            });

            const result = await Promise.all(promises);
            return result;
          };

          const optionsWithImages = await getTheImageOfOptions();

          // Set the resolved data in state
          setMedia((prev) => ({
            ...prev,
            variant: { options: optionsWithImages },
          }));
        }

        const getTheImageOfProduct = async () => {
          productImages.map(async ({ label }) => {
            const index = media.product.findIndex(({ label }) => label);

            const img = `${ENDPOINT}/assets/products/${selected.name}-${selected._id}/${label}.jpg`;
            const base64 = await imgToBase64(img);
            if (base64) {
              const _productImages = [...media.product];
              _productImages[index] = { img: base64, preview: img, label };
              setMedia((prev) => ({ ...prev, product: _productImages }));
            }
          });
        };
        getTheImageOfProduct();
        setVariations(variations);
        setForm(selected);
      }
    };

    fetchData();
  }, [willCreate, selected, ENDPOINT]);

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

    if (transferIndex <= copyLabels.length - 1) {
      const { preview: image = "", img: transferImg } =
        copyLabels[transferIndex];

      const getLabel = (index) => copyLabels[index]?.label;

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

    Swal.fire({
      title: "Are you sure?",
      text: "You want to publish this product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, publish it!",
    }).then((result) => {
      if (result.isConfirmed) {
        disptach(SAVE({ token, data: newForm }));
        Swal.fire({
          title: "Success!",
          text: "Your product has been publish.",
          icon: "success",
        });
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Basic form={form} setForm={setForm} selected={selected} />
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
              Publish
            </MDBBtn>
          </MDBCol>
        </MDBRow>
      </form>
    </>
  );
};

export default ProductInformation;
