import React, { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { SAVE, CHECKOUT } from "../../../../../services/redux/slices/cart";
import { ENDPOINT } from "../../../../../services/utilities";
import { useHistory } from "react-router";
import { Quantity } from "../../../../widgets/orderType/quantity";

import Kilo from "../../../../widgets/orderType/kilo";
import Variations from "../../../../widgets/variations";
import Description from "./description";
import GET from "./GET";
import Modal from "./modal";
import Swal from "sweetalert2";

const ViewSelected = ({ selected = {} }) => {
  const { auth, token } = useSelector(({ auth }) => auth),
    [images, setImages] = useState([]),
    [variant1, setVariant1] = useState(""),
    [variant2, setVariant2] = useState(""),
    [price, setPrice] = useState(0),
    [kilo, setKilo] = useState(1),
    [isChangeProduct, setIsChangeProduct] = useState(false),
    [kiloGrams, setKiloGrams] = useState(0),
    [quantity, setQuantity] = useState(1),
    [isFullView, setIsFullView] = useState(false),
    [imgForFullView, setImgForFullView] = useState({}),
    [baseImages, setBaseImages] = useState([]),
    [storageOfRemoveImages, setStorageOfRemoveImages] = useState([]),
    thumbnailsPerPage = 4,
    [selectedImage, setSelectedImage] = useState(),
    history = useHistory(),
    dispatch = useDispatch();

  useEffect(() => {
    if (selected._id) {
      setQuantity(1); // Reset quantity to 1 immediately when selected item changes
      setIsChangeProduct(true); // Set the flag to trigger the other effect
    }
  }, [selected]);

  useEffect(() => {
    if (isChangeProduct) {
      const { media } = selected;
      const productImages = media.product.map(({ label }) => ({
        large: ` ${ENDPOINT}/assets/products/${selected._id}/${label}.jpg`,
        thumb: `${ENDPOINT}/assets/products/${selected._id}/${label}.jpg`,
        label,
      }));

      const variantImages = media.variant?.options
        ?.filter(({ isUpload }) => isUpload)
        .map(({ _id }) => ({
          large: `${ENDPOINT}/assets/products/${selected._id}/variant/${_id}.jpg`,
          thumb: `${ENDPOINT}/assets/products/${selected._id}/variant/${_id}.jpg`,
          label: _id,
        }));
      setBaseImages([]);
      setSelectedImage({});
      setIsFullView(false);
      setImages([...productImages, ...variantImages]);
      setBaseImages([...productImages, ...variantImages]);
      setSelectedImage(productImages[0]);
      setStorageOfRemoveImages([]);
      setVariant1("");
      setVariant2("");
      setKilo(1);
      setQuantity(1);
      setKiloGrams(0);
      setPrice(GET.defaultPrice(selected));
      setIsChangeProduct(false);
    }
  }, [isChangeProduct, selected]);

  const handleClickThumbnail = (largeImage) => {
    setSelectedImage(largeImage);
  };

  const nextPage = () => {
    const _images = [...images];
    const _removeImages = [...storageOfRemoveImages];
    const removedImage = _images.shift();
    _removeImages.push(removedImage);
    setImages(_images);
    setStorageOfRemoveImages(_removeImages);
  };

  const prevPage = () => {
    const _images = [...images];
    const _removeImages = [...storageOfRemoveImages];
    const lastIndex = _removeImages.length - 1;
    _images.unshift(_removeImages[lastIndex]);
    _removeImages.splice(lastIndex, 1);
    setImages(_images);
    setStorageOfRemoveImages(_removeImages);
  };

  const totalPages = Math.ceil(images.length / thumbnailsPerPage);
  const currentThumbnails = images.slice(0, 0 + 4);

  const safeRender = (property) => {
    if (typeof property === "object") {
      console.error("Invalid property detected:", property);
      return JSON.stringify(property);
    }
    return property;
  };

  const handleSubmit = (isCart = true) => {
    var form = {
      product: selected._id,
      cartBy: auth._id,
      isPerKilo: selected.isPerKilo,
      hasVariant: selected.hasVariant,
      has2Variant: selected.has2Variant,
    };

    if (selected.hasVariant) {
      if (selected.has2Variant) {
        if (!variant1 || !variant2)
          return Swal.fire({
            title: "Please choose a variant",
            text: "You need to select a variant before proceeding.",
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
          });
        form.variant1 = variant1;
        form.variant2 = variant2;
      } else {
        if (!variant1)
          return Swal.fire({
            title: "Please choose a variant",
            text: "You need to select a variant before proceeding.",
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
          });
        form.variant1 = variant1;
      }
    }

    if (selected.isPerKilo) {
      form.kilo = kilo;
      form.kiloGrams = kiloGrams;
    } else {
      form.quantity = quantity;
    }

    if (isCart) {
      dispatch(SAVE({ token, data: { ...form } }));
      Swal.fire({
        title: "Successfully",
        text: "Added to your cart",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    } else {
      dispatch(CHECKOUT([{ ...form, product: selected }]));
      history.push("/pos/checkout");
    }
  };

  return (
    <div className="mb-2">
      <div className="d-flex justify-content-center">
        <div className="w-75">
          <MDBCard className="boxshadow-none">
            <MDBCardBody>
              <MDBRow>
                <MDBCol md="5">
                  <div className="gallery-container">
                    <div className="main-image">
                      <img
                        src={selectedImage?.large}
                        alt="Selected"
                        className="cursor-pointer"
                        onClick={() => {
                          setIsFullView(true);
                          setImgForFullView(selectedImage);
                        }}
                      />
                    </div>
                    <div className="thumbnails">
                      <button
                        className="arrow-button left"
                        disabled={storageOfRemoveImages.length === 0}
                        onClick={prevPage}
                        type="button"
                      ></button>
                      {currentThumbnails.map((image, index) => (
                        <img
                          key={index}
                          onMouseEnter={() => handleClickThumbnail(image)}
                          src={image?.thumb}
                          alt={`Thumbnail ${index + 1}`}
                          className="thumbnail"
                          onClick={() => {
                            handleClickThumbnail(image);
                            setImgForFullView(image);
                            setIsFullView(true);
                          }}
                        />
                      ))}
                      <button
                        type="button"
                        className="arrow-button right"
                        onClick={nextPage}
                        disabled={totalPages === 1}
                      ></button>
                    </div>
                  </div>
                </MDBCol>
                <MDBCol>
                  <MDBRow className="d-flex align-items-center mt-4">
                    <MDBCol>
                      <h4
                        style={{ fontWeight: "500" }}
                        className="font-weight-bold"
                      >
                        {safeRender(selected.name) || ""}
                      </h4>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mt-2 d-flex align-items-center">
                    <MDBCol md="2">
                      <h6 className="text-start grey-text">Price:</h6>
                    </MDBCol>
                    <MDBCol>
                      <h4 style={{ fontWeight: "700" }} className="text-danger">
                        ₱{price}
                      </h4>
                    </MDBCol>
                  </MDBRow>

                  {selected.hasVariant && (
                    <Variations
                      has2Variant={selected.has2Variant}
                      variations={selected.variations}
                      images={baseImages}
                      setVariant1={setVariant1}
                      textColor="grey-text"
                      setPrice={setPrice}
                      variant1={variant1}
                      selected={selected}
                      variant2={variant2}
                      setVariant2={setVariant2}
                      setSelectedImage={setSelectedImage}
                    />
                  )}
                  {selected.isPerKilo ? (
                    <Kilo
                      toggleView={() => {}}
                      kilo={kilo}
                      setKilo={setKilo}
                      kiloGrams={kiloGrams}
                      isCustomer={true}
                      handleSubmit={handleSubmit}
                      setKiloGrams={setKiloGrams}
                      availableStocks={GET.totalStocks(
                        selected,
                        variant1,
                        variant2
                      )}
                    />
                  ) : (
                    <Quantity
                      toggleView={() => {}}
                      quantity={quantity || 1}
                      handleSubmit={handleSubmit}
                      isCustomer={true}
                      availableStocks={GET.totalStocks(
                        selected,
                        variant1,
                        variant2
                      )}
                      setQuantity={setQuantity}
                    />
                  )}
                  <MDBRow className="mt-4 ">
                    <MDBCol className="text-start m-0 p-0 ml-2">
                      <MDBBtn
                        color="primary"
                        type="submit"
                        size="md"
                        className="text-nowrap"
                        onClick={() => handleSubmit(true)}
                        outline
                      >
                        <MDBIcon icon="shopping-cart" className="mr-1" /> ADD TO
                        CART
                      </MDBBtn>
                      <MDBBtn
                        color="danger"
                        type="submit"
                        size="md"
                        onClick={() => handleSubmit(false)}
                      >
                        Buy Now
                      </MDBBtn>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
          <Description selected={selected} safeRender={safeRender} />
          <div className="mt-4">
            <h6 className="grey-text">YOU MAY ALSO LIKE</h6>
          </div>
        </div>
      </div>
      <Modal
        show={isFullView}
        setShow={setIsFullView}
        imgForFullView={imgForFullView}
        images={baseImages}
        selected={selected}
      />
    </div>
  );
};

export default ViewSelected;
