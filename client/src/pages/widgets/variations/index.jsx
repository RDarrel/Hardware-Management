import React, { useEffect, useState } from "react";
import { MDBRow, MDBCol, MDBBtn, MDBIcon } from "mdbreact";

const Variations = ({
  has2Variant,
  variations,
  setVariant1,
  images,
  variant1,
  isCart = false,
  variant2,
  setSelectedImage,
  setPrice = () => {},
  textColor = "",
  setVariant2,
  isChangeVariant = false, //para ito dun sa maliliit na modal
}) => {
  const [variation1, setVariation1] = useState(null),
    [variation2, setVariation2] = useState(null),
    [option1ID, setOption1ID] = useState(""), //i use this to find the price of variation2
    [option2ID, setOption2ID] = useState(""),
    [disableIDSVr2, setDisableIDSVr2] = useState([]),
    [disableIDSVr1, setDisableIDSVr1] = useState([]);

  useEffect(() => {
    setVariant1(null);
    setVariant2(null);
  }, [setVariant1, setVariant2]);

  useEffect(() => {
    if (variant1 !== option1ID) {
      setOption1ID("");
    }
    if (variant2 !== option2ID) {
      setOption2ID("");
    }
    if (!variant1) {
      setDisableIDSVr2([]);
    }
    if (!variant2) {
      setDisableIDSVr1([]);
    }
    if (!variant1 && !variant2) {
      setDisableIDSVr1([]);
      setDisableIDSVr2([]);
    }
  }, [variant1, variant2, option1ID, option2ID]);

  useEffect(() => {
    if (variations && variations.length > 0) {
      setVariation1(null);
      setVariation2(null);
      setVariation1(variations[0]);
      if (has2Variant && variations.length > 1) {
        setVariation2(variations[1]);
        //this is for default filtering of disable option
        if (isChangeVariant && !option1ID) {
          console.log("running");
          handleDisableVr2(variations[0].options, variant1);
        }
        if (variant2) {
          handleDisableVr1(variations[0].options, variant2);
        }
      }
    }

    //to reset the variant1 and variant2
  }, [has2Variant, variations, isChangeVariant, variant1, option1ID, variant2]);

  const handleDisableVr1 = (_options, _variant2) => {
    const disableOptionsID =
      _options
        ?.map((option) => {
          const prices = option?.prices;
          const isDisAble = prices?.find(
            ({ _id: priceID }) => priceID === _variant2
          )?.disable;

          if (isDisAble) {
            return option?._id;
          }
          return false;
        })
        .filter(Boolean) || [];

    if (disableOptionsID?.length > 0) {
      setDisableIDSVr1(disableOptionsID);
    } else {
      setDisableIDSVr1([]);
    }
  };

  const handleDisableVr2 = (options, variant) => {
    const vr1Prices = options.find(({ _id }) => variant === _id)?.prices || [];
    const disableVariant2 = vr1Prices
      .filter(({ disable }) => disable)
      .map(({ _id }) => _id)
      .filter(Boolean);

    setDisableIDSVr2(disableVariant2 || []);
  };

  const handleClickVr1 = (_id) => {
    if (variant1 === _id) {
      return setVariant1("");
    }
    const vr1Img = !isCart && images.find(({ label }) => label === _id);

    if (has2Variant) {
      //first is to check if have a disable in vr2
      handleDisableVr2(variation1.options, _id);
      if (option2ID) {
        const prices = variation1.options.find(
          (option) => option._id === _id
        )?.prices;
        const srp = prices.find((price) => price._id === option2ID)?.srp;
        setOption1ID(_id);
        setPrice(srp);
      } else {
        setOption1ID(_id);
      }
    } else {
      const srp = variation1.options.find((option) => option._id === _id)?.srp;
      setPrice(srp);
    }
    setVariant1(_id);

    if (vr1Img && !isCart) {
      setSelectedImage(vr1Img);
    }
  };

  const handleClickVr2 = (_id) => {
    if (variant2 === _id) return setVariant2("");
    handleDisableVr1(variation1?.options, _id);
    console.log(option1ID);

    if (option1ID) {
      const prices =
        variation1.options.find((option) => option._id === option1ID)?.prices ||
        [];
      const srp = prices?.find((price) => price._id === _id)?.srp;
      setPrice(srp);
    }
    setOption2ID(_id);
    setVariant2(_id);
  };

  return (
    <>
      {variation1 && (
        <MDBRow className="d-flex align-items-center mt-2">
          <MDBCol md="2">
            <h6 className={textColor}>{variation1.name}:</h6>
          </MDBCol>
          <MDBCol md="10">
            <div className="button-wrapper d-flex flex-wrap">
              {variation1.options.map((option, index) => {
                const image =
                  !isCart && images.find(({ label }) => option._id === label);
                const isDisable = disableIDSVr1.includes(option._id);

                if (!option.disable) {
                  return (
                    <div key={index} className="button-container">
                      <MDBBtn
                        outline
                        size="sm"
                        disabled={isDisable}
                        color={option._id === variant1 ? "danger" : "light"}
                        className={`button  ${
                          isDisable && "boxshadow-none"
                        }   ${option.name === variant1 ? "selected" : ""}`}
                        onClick={() => handleClickVr1(option._id)}
                      >
                        {image && (
                          <img
                            src={image.thumb}
                            style={{ height: "20px" }}
                            alt={`${index} shoe`}
                            className="button-image"
                          />
                        )}
                        <span
                          style={{ fontSize: "13px" }}
                          className="text-dark font-weight-bold"
                        >
                          {option.name}
                        </span>
                        {option._id === variant1 && (
                          <div className="check-icon-background">
                            <MDBIcon icon="check" className="check-icon" />
                          </div>
                        )}
                      </MDBBtn>
                    </div>
                  );
                }
                return "";
              })}
            </div>
          </MDBCol>
        </MDBRow>
      )}

      {variation2 && (
        <MDBRow className="d-flex align-items-center mt-2">
          <MDBCol md="2">
            <h6 className={textColor}>{variation2.name}:</h6>
          </MDBCol>
          <MDBCol md="10">
            <div className="button-wrapper d-flex flex-wrap">
              {variation2.options.map((option, index) => {
                const isDisable = disableIDSVr2.includes(option._id);

                return (
                  <div key={index} className="button-container">
                    <MDBBtn
                      outline
                      size="sm"
                      color={option._id === variant2 ? "danger" : "light"}
                      className={`button  
                         ${isDisable && "boxshadow-none"}
                        ${option._id === variant1 ? "selected" : ""}`}
                      onClick={() => handleClickVr2(option._id)}
                      disabled={isDisable}
                    >
                      <span
                        style={{ fontSize: "13px" }}
                        className="text-dark font-weight-bold"
                      >
                        {option.name}
                      </span>
                      {option._id === variant2 && (
                        <div className="check-icon-background">
                          <MDBIcon icon="check" className="check-icon" />
                        </div>
                      )}
                    </MDBBtn>
                  </div>
                );
              })}
            </div>
          </MDBCol>
        </MDBRow>
      )}
    </>
  );
};

export default Variations;
