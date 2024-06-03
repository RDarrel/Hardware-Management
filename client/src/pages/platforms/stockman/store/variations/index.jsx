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
  setVariant2,
}) => {
  const [variation1, setVariation1] = useState(null),
    [variation2, setVariation2] = useState(null),
    [disableIDSVr2, setDisableIDSVr2] = useState([]),
    [disableIDSVr1, setDisableIDSVr1] = useState([]);

  useEffect(() => {
    if (variations && variations.length > 0) {
      setVariation1(variations[0]);
      if (has2Variant && variations.length > 1) {
        setVariation2(variations[1]);
      }
    }
    setVariant1("");
    setVariant2("");
  }, [has2Variant, variations, setVariant1, setVariant2]);

  const handleClickVr1 = (_id) => {
    const vr1Img = !isCart && images.find(({ label }) => label === _id);

    if (has2Variant) {
      const pricesOfVarian1Choose =
        variation1.options.find(({ _id: optionID }) => _id === optionID)
          .prices || [];
      const vr2DisableIDS =
        pricesOfVarian1Choose
          .filter(({ disable }) => disable)
          .map(({ _id }) => _id) || [];

      if (vr2DisableIDS.length > 0) {
        setDisableIDSVr2(vr2DisableIDS);
      } else {
        setDisableIDSVr2([]);
      }
    }

    setVariant1(_id);
    if (vr1Img && !isCart) {
      setSelectedImage(vr1Img);
    }
  };

  const handleClickVr2 = (_id) => {
    const disableOptionsID = variation1?.options
      .map((option) => {
        const prices = option.prices;
        const isDisAble = prices.find(
          ({ _id: priceID }) => priceID === _id
        ).disable;

        if (isDisAble) {
          return option._id;
        }
        return false;
      })
      .filter(Boolean);

    if (disableOptionsID.length > 0) {
      setDisableIDSVr1(disableOptionsID);
    } else {
      setDisableIDSVr1([]);
    }
    setVariant2(_id);
  };

  return (
    <>
      {variation1 && (
        <MDBRow className="d-flex align-items-center mt-2">
          <MDBCol md="2">
            <h6>{variation1.name}:</h6>
          </MDBCol>
          <MDBCol md="10">
            <div className="button-wrapper d-flex flex-wrap">
              {variation1.options.map((option, index) => {
                const image =
                  !isCart && images.find(({ label }) => option._id === label);

                if (!option.disable) {
                  return (
                    <div key={index} className="button-container">
                      <MDBBtn
                        outline
                        size="sm"
                        disabled={disableIDSVr1.includes(option._id)}
                        color={option._id === variant1 ? "danger" : "light"}
                        className={`button ${
                          option.name === variant1 ? "selected" : ""
                        }`}
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
            <h6>{variation2.name}:</h6>
          </MDBCol>
          <MDBCol md="10">
            <div className="button-wrapper d-flex flex-wrap">
              {variation2.options.map((option, index) => {
                return (
                  <div key={index} className="button-container">
                    <MDBBtn
                      outline
                      size="sm"
                      color={option._id === variant2 ? "danger" : "light"}
                      className={`button ${
                        option._id === variant1 ? "selected" : ""
                      }`}
                      onClick={() => handleClickVr2(option._id)}
                      disabled={disableIDSVr2.includes(option._id)}
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
