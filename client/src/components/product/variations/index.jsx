import React, { useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBIcon,
  MDBInputGroup,
  MDBRow,
} from "mdbreact";
import { v4 as uuidv4 } from "uuid";
import Table from "./table";

function Variations({ variations = [], setVariations, media, setMedia }) {
  const [price, setPrice] = useState(0);

  const handleChangeOptions = (option, index, optionIndex) => {
    var updatedVariations = [...variations];

    if (updatedVariations.length === 2) {
      if (index === 0) {
        handleDefaultChangeOption(
          updatedVariations,
          index,
          option,
          optionIndex
        );
      } else {
        //para ma update yung vr1 yung mga prices nila
        const vr1Options = [...updatedVariations[0].options];
        const newVr1Options = vr1Options.map((obj) => {
          const newPrices = obj.prices.map((price, priceIndex) => {
            if (priceIndex === optionIndex) {
              return { ...price, name: option };
            }
            return price;
          });

          return { ...obj, prices: newPrices };
        });
        const newVr = { ...updatedVariations[0], options: newVr1Options };
        updatedVariations[0] = newVr;
        handleDefaultChangeOption(
          updatedVariations,
          index,
          option,
          optionIndex
        );
      }
    } else {
      handleDefaultChangeOption(updatedVariations, index, option, optionIndex);
    }

    setVariations(updatedVariations);

    if (index === 0) {
      const optionImages = [...media.variant?.options];
      optionImages[optionIndex].label = option;
      setMedia({
        ...media,
        variant: { ...media.variant, options: optionImages },
      });
    }
  };

  const handleDefaultChangeOption = (
    updatedVariations,
    index,
    option,
    optionIndex
  ) => {
    const options = [...updatedVariations[index].options];
    const newOPtion = { ...options[optionIndex] };
    options[optionIndex] = { ...newOPtion, name: option };
    const newVariant = { ...updatedVariations[index] };
    updatedVariations[index] = { ...newVariant, options };
  };

  const handleDefaultValueInMediaVariants = (newOptionsImages) => {
    setMedia({
      ...media,
      variant: { ...media.variant, options: newOptionsImages },
    });
  };

  const handleAddOptions = (index) => {
    const updatedVariations = [...variations];
    const newOption = { name: "", _id: uuidv4() };
    if (updatedVariations[index].options?.length === 20) return false;

    if (updatedVariations.length === 2) {
      if (index === 0) {
        updatedVariations[index].options.push({
          ...newOption,
          prices: updatedVariations[1].options.map((option) => ({
            ...option,
            srp: 0,
            disable: false,
          })),
        });
      } else {
        const priceID = uuidv4();
        const vr1Options = [...updatedVariations[0].options];
        const newVr1Options = vr1Options.map((option) => {
          const prices = option.prices;
          prices.push({ name: "", _id: priceID, disable: false });
          return {
            ...option,
            prices,
          };
        });
        updatedVariations[0].options = newVr1Options;
        updatedVariations[index].options.push({ name: "", _id: priceID });
      }
    } else {
      const newVr = { ...updatedVariations[index] };
      const newOptions = [...newVr.options];
      newOptions.push({
        ...newOption,
        srp: 0,
        disable: false,
      });

      updatedVariations[index] = { ...newVr, options: newOptions };
    }
    setVariations(updatedVariations);

    if (index === 0) {
      const optionImages = [...media.variant.options];
      optionImages.push({ _id: newOption._id, label: "" });
      handleDefaultValueInMediaVariants(optionImages);
    }
  };

  const handleRemoveOption = (index, optionIndex) => {
    if (optionIndex === 0) return false;
    const updatedVariations = [...variations];
    if (updatedVariations.length === 2) {
      if (index === 0) {
        handleRemoveOptionDefault(updatedVariations, index, optionIndex);
      } else {
        const newVr1Options = updatedVariations[0].options.map((option) => {
          const prices = option?.prices
            ?.map((price, priceIndex) => {
              if (priceIndex !== optionIndex) return price;
              return "";
            })
            .filter(Boolean);

          return { ...option, prices };
        });
        console.log(newVr1Options);
        const newVr = { ...updatedVariations[0], options: newVr1Options };

        updatedVariations[0] = newVr;
        handleRemoveOptionDefault(updatedVariations, index, optionIndex);
      }
    } else {
      handleRemoveOptionDefault(updatedVariations, index, optionIndex);
    }

    setVariations(updatedVariations);

    if (index === 0 && optionIndex !== 0) {
      const optionImages = [...media.variant.options];
      optionImages.splice(optionIndex, 1);

      handleDefaultValueInMediaVariants(optionImages);
    }
  };

  const handleRemoveOptionDefault = (updatedVariations, index, optionIndex) => {
    const newOptions = updatedVariations[index].options
      .map((option, delIndex) => {
        if (delIndex !== optionIndex) {
          return option;
        }
        return "";
      })
      .filter(Boolean);
    const newVr = { ...updatedVariations[index], options: newOptions };

    updatedVariations[index] = newVr;
  };

  const handleChangeVrName = (value, index) => {
    const updatedVariations = [...variations];
    const newVr = { ...updatedVariations[index], name: value };

    updatedVariations[index] = newVr;
    setVariations(updatedVariations);

    if (index === 0) {
      setMedia({
        ...media,
        variant: { ...media.variant, name: value },
      });
    }
  };

  const handleRemoveVr = (index) => {
    const updatedVariations = [...variations];
    updatedVariations.splice(index, 1);
    setVariations(updatedVariations);
    if (index === 0 && variations.length === 0) {
      setMedia({ ...media, variant: {} });
    } else {
      const variant = updatedVariations[0] || undefined;
      if (variant) {
        setVariations([
          {
            ...variant,
            options: variant.options.map(({ name, _id }) => ({
              name,
              _id,
              srp: 0,
              disable: false,
            })),
          },
        ]);

        setMedia({
          ...media,
          variant: {
            ...variant,
            options: variant?.options.map((obj) => ({
              label: obj.name,
              _id: obj._id,
            })),
          },
        });
      }
    }
  };

  const handleAddVr = () => {
    const priceID = uuidv4();
    const updatedVariations = [...variations];
    updatedVariations[0] = {
      ...updatedVariations[0],
      options: updatedVariations[0].options.map((option) => ({
        ...option,
        prices: [{ _id: priceID, name: "", srp: 0, disable: false }],
      })),
    };
    updatedVariations.push({
      _id: uuidv4(),
      name: "",
      options: [
        {
          name: "",
          _id: priceID,
        },
      ],
    });
    setVariations(updatedVariations);
  };

  const handleApplyPriceInAllVariant = () => {
    const updatedVariations = [...variations];
    const vr1 = { ...updatedVariations[0] };
    const options = [...vr1.options];

    if (price <= 0) return false;

    if (updatedVariations.length === 2) {
      const newOptions = options.map((option) => {
        const newPrices = option.prices.map((objPrice) => {
          return { ...objPrice, srp: price };
        });
        return { ...option, prices: newPrices };
      });
      updatedVariations[0] = { ...vr1, options: newOptions };
      setVariations(updatedVariations);
    } else {
      const newOPtions = options.map((option) => ({ ...option, srp: price }));
      updatedVariations[0] = { ...vr1, options: newOPtions };
    }

    setVariations(updatedVariations);
  };
  return (
    <>
      {variations.map((variation, index) => (
        <React.Fragment key={`main-variation-${index}`}>
          <MDBRow className="mt-5" key={index}>
            <MDBCol md="2" className="d-flex justify-content-end ">
              <h6>Variation {index + 1}</h6>
            </MDBCol>
            <MDBCol md="8">
              <MDBCard
                className="bg-light"
                style={{ boxShadow: "0px 0px 0px 0px" }}
              >
                <MDBRow>
                  <MDBCol md="12" className="d-flex justify-content-end">
                    <MDBIcon
                      icon="times"
                      className="mr-3 mt-2 cursor-pointer"
                      onClick={() => handleRemoveVr(index)}
                    />
                  </MDBCol>
                </MDBRow>
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol
                      md="2"
                      className="d-flex justify-content-end align-items-center"
                    >
                      <h6>Name</h6>
                    </MDBCol>
                    <MDBCol md="8">
                      <input
                        className="form-control"
                        value={variation.name}
                        onChange={({ target }) =>
                          handleChangeVrName(target.value, index)
                        }
                        placeholder="Enter Variation Name eg: colour, etc"
                      />
                    </MDBCol>
                  </MDBRow>
                  {variation.options.map((option, indexOption) => (
                    <MDBRow
                      key={`variation-option-${indexOption}`}
                      className=" d-flex align-items-center"
                    >
                      <MDBCol
                        md="2"
                        className="d-flex justify-content-end align-items-center"
                      >
                        {indexOption === 0 && <h5>Options</h5>}
                      </MDBCol>
                      <MDBCol md="8" className="mt-2 mb-3">
                        <input
                          className="form-control"
                          placeholder="Enter Variation Options eg: Red, etc"
                          value={option?.name || ""}
                          required
                          onChange={(e) =>
                            handleChangeOptions(
                              e.target.value,
                              index,
                              indexOption
                            )
                          }
                        />
                      </MDBCol>
                      <MDBCol>
                        <MDBIcon
                          icon="trash-alt"
                          className="cursor-pointer"
                          onClick={() => handleRemoveOption(index, indexOption)}
                        />
                      </MDBCol>
                    </MDBRow>
                  ))}
                  <MDBRow
                    className="d-flex justify-content-center"
                    key={`variation-option-add-${index}`}
                  >
                    <MDBCol md="8">
                      <MDBBtn
                        color="white"
                        className="add-price-tier-button  d-flex align-items-center justify-content-center"
                        onClick={() => handleAddOptions(index)}
                        block
                      >
                        <MDBIcon icon="plus" className="blue-text" />
                        <span className="blue-text ">
                          Add Options ({variation.options.length}/20)
                        </span>
                      </MDBBtn>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
          {variations.length < 2 && (
            <MDBRow className="mt-5" key={`addVaration-${index}`}>
              <MDBCol md="2" className="d-flex justify-content-end ">
                <h6>Variation {variations.length + 1}</h6>
              </MDBCol>
              <MDBCol md="8">
                <MDBBtn
                  color="white"
                  className="add-price-tier-button  d-flex align-items-center justify-content-center"
                  onClick={handleAddVr}
                  block
                >
                  <MDBIcon icon="plus" className="blue-text" />
                  <span className="blue-text ">Add</span>
                </MDBBtn>
              </MDBCol>
            </MDBRow>
          )}
        </React.Fragment>
      ))}

      <MDBRow className="d-flex align-items-center mt-4">
        <MDBCol
          md="2"
          className="d-flex justify-content-end align-content-center "
        >
          <h6>Variation Information</h6>
        </MDBCol>
        <MDBCol md="8">
          <MDBInputGroup
            prepend="₱"
            type="number"
            value={String(price)}
            onChange={({ target }) => setPrice(Number(target.value))}
          />
        </MDBCol>
        <MDBCol md="2">
          <MDBBtn color="danger" block onClick={handleApplyPriceInAllVariant}>
            Apply To All
          </MDBBtn>
        </MDBCol>
      </MDBRow>

      <Table variations={variations} setVariations={setVariations} />
    </>
  );
}

export default Variations;
