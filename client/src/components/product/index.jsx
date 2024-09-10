import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./product.css";
import Basic from "./basic";
import Informations from "./informations";
import Media from "./media";
import {
  SAVE,
  UPDATE,
} from "../../services/redux/slices/administrator/productManagement/products";
import { useDispatch, useSelector } from "react-redux";
import { ENDPOINT, isValid } from "../../services/utilities";
import validate from "./validate";

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
  collections = [],
  willCreate = true,
  setWillCreate,
  setSelected,
}) => {
  const { token } = useSelector(({ auth }) => auth);
  const [media, setMedia] = useState(_media);
  const [form, setForm] = useState({ isPerKilo: false, hasExpiration: false });
  const [isSubmit, setIsSubmit] = useState(true);
  const [variations, setVariations] = useState([]);
  const disptach = useDispatch(),
    [isDuplicateName, setIsDuplicateName] = useState(false),
    [hasDuplicateBarcode, setHasDuplicateBarcode] = useState(false),
    [hasDuplicateOption, setHasDuplicateOption] = useState(false),
    [hasDuplicateVariant, setHasDuplicateVariant] = useState(false);

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
        reader.onload = () => {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error(`Error converting image to base64: ${error}`);
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!willCreate && isMounted) {
        const {
          hasVariant,
          variations = [],
          media: mediaSelected = {},
        } = selected || {};

        const { variant = {}, product: productImages } = mediaSelected || {};

        if (hasVariant) {
          const getTheImageOfOptions = async () => {
            const promises = variant?.options?.map(async ({ label, _id }) => {
              const img = `${ENDPOINT}/assets/products/${selected._id}/variant/${_id}.jpg`;
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

          setMedia((prev) => ({
            ...prev,
            variant: { options: optionsWithImages },
          }));
        }

        const getTheImageOfProduct = async () => {
          for (const { label } of productImages) {
            const img =
              `${ENDPOINT}/assets/products/${selected._id}/${label}.jpg` || "";
            const base64 = (await imgToBase64(img)) || "";

            if (base64 && img) {
              setMedia((prev) => {
                if (prev?.product) {
                  console.log("meron");
                  const newProductImgs = [...prev?.product];
                  const indexProduct = newProductImgs.findIndex(
                    ({ label: pLabel }) => pLabel === label
                  );

                  newProductImgs[indexProduct] = {
                    ...newProductImgs[indexProduct],
                    preview: img,
                    img: base64,
                  };

                  return { ...prev, product: newProductImgs };
                } else {
                  return _media;
                }
              });
            }
          }
        };
        await getTheImageOfProduct();

        setVariations(variations);
        setForm(selected);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [willCreate, selected]);

  const dragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    setHasDuplicateBarcode(
      validate.hasDuplicateBarcode({
        ...form,
        hasVariant: variations.length > 0,
        has2Variant: variations.length > 1,
        variations,
      })
    );
  }, [variations, form]);
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

  useEffect(() => {
    if (form?.name) {
      setIsDuplicateName(
        isValid(collections, form.name, "name", selected.name)
      );
    }
  }, [form, selected, collections]);

  const handleSweetAlert = (message, hasCustom = false) => {
    Swal.fire({
      title: "Oops...",
      text: `${message} ${hasCustom ? "" : "is Required!"} `,
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const productsImages = media?.product
      .map((product) => (product.img ? product : ""))
      .filter(Boolean);

    const variantImages = media?.variant.options
      .map((variant) =>
        variant.img
          ? { ...variant, isUpload: true }
          : { ...variant, isUpload: false }
      )
      .filter(Boolean);

    const newForm = {
      ...form,
      hasVariant: variations.length > 0 ? true : false,
      has2Variant: variations.length === 2 ? true : false,
      variations: variations,
      media: {
        ...media,
        product: productsImages,
        variant: { ...media.variant, options: variantImages },
      },
    };
    const coverPhoto = media.product.find(
      ({ label }) => label === "Cover Photo"
    );

    if (!newForm.category) {
      return handleSweetAlert("Category");
    }

    if (!newForm.material) {
      return handleSweetAlert("Material");
    }

    if (
      (!newForm.hasVariant && !newForm.capital) ||
      (!newForm.hasVariant && !newForm.srp)
    ) {
      return handleSweetAlert("Capital and SRP ");
    }
    if (newForm.hasVariant) {
      const { variations = [], has2Variant = false } = newForm;
      const options = variations[0].options;

      const hasNoSrpAndCapital = options.some(
        ({ capital = 0, srp = 0 }) => capital <= 0 || srp <= 0
      );
      if (hasNoSrpAndCapital && !has2Variant) {
        return handleSweetAlert(
          "Capital and SRP are required for each variant.",
          true
        );
      }

      if (has2Variant) {
        const hasNoSrpAndCapitalIn2Variant = options.some(({ prices }) =>
          prices.some(({ srp = 0, capital = 0 }) => srp <= 0 || capital <= 0)
        );

        if (hasNoSrpAndCapitalIn2Variant) {
          return handleSweetAlert(
            "Capital and SRP are required for each variant.",
            true
          );
        }
      }
    }

    if (!coverPhoto.img) {
      return handleSweetAlert("Cover Photo");
    }

    const title = willCreate ? "publish" : "Update";

    Swal.fire({
      title: "Are you sure?",
      text: `You want to ${title} this product!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${title} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        if (willCreate) {
          disptach(SAVE({ token, data: newForm }));
        } else {
          disptach(UPDATE({ token, data: newForm }));
        }
        handleClearForm();
        Swal.fire({
          title: "Success!",
          text: `Your product has been ${title}.`,
          icon: "success",
        });
      }
    });
  };

  const handleClearForm = () => {
    setIsViewProductInformation(false);
    setMedia(_media);
    setVariations([]);
    setForm({ isPerKilo: false });
    setWillCreate(true);
    setSelected({});
  };

  const preventSubmitForm = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Basic
          form={form}
          setForm={setForm}
          selected={selected}
          toggle={() => setIsViewProductInformation(false)}
        />
        <Informations
          variations={variations}
          setVariations={setVariations}
          form={form}
          setForm={setForm}
          setHasDuplicateVariant={setHasDuplicateVariant}
          media={media}
          setHasDuplicateOption={setHasDuplicateOption}
          setMedia={setMedia}
          collections={collections}
          setIsSubmit={setIsSubmit}
          preventSubmitForm={preventSubmitForm}
        />
        <Media
          dragOver={dragOver}
          handleDrop={handleDrop}
          media={media}
          setMedia={setMedia}
          hasDuplicateVariant={hasDuplicateVariant}
          variations={variations}
          handleClearForm={handleClearForm}
          isDuplicateName={isDuplicateName}
          willCreate={willCreate}
          hasDuplicateOption={hasDuplicateOption}
          hasDuplicateBarcode={hasDuplicateBarcode}
          isSubmit={isSubmit}
        />
      </form>
    </>
  );
};

export default ProductInformation;
