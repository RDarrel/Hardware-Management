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
import { isValid } from "../../../services/utilities";

function Variations({
  variations = [],
  setVariations,
  media,
  setMedia,
  setHasDuplicateVariant,
  setHasDuplicateOption,
  preventSubmitForm,
  collections,
}) {
  const [capital, setCapital] = useState(0),
    [srp, setSrp] = useState(0);

  const handleChangeOptions = (option, index, optionIndex) => {
    var updatedVariations = [...variations];
    setHasDuplicateOption(
      isValid(
        updatedVariations.length === 2
          ? [...updatedVariations[0].options, ...updatedVariations[1].options]
          : updatedVariations[0].options,
        option,
        "name"
      )
    );
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
        updatedVariations[index] = {
          ...updatedVariations[index],
          options: [
            ...updatedVariations[index].options,
            {
              ...newOption,
              prices: updatedVariations[1].options.map((option) => ({
                ...option,
                capital: 0,
                srp: 0,
                disable: false,
                barcode: "",
              })),
            },
          ],
        };
      } else {
        const priceID = uuidv4();
        const vr1Options = [...updatedVariations[0].options];
        const newVr1Options = vr1Options.map((option) => {
          const prices = option.prices ? [...option.prices] : [];

          prices.push({
            name: "",
            _id: priceID,
            disable: false,
            srp: 0,
            capital: 0,
            barcode: "",
          });

          return {
            ...option,
            prices,
          };
        });
        updatedVariations[0] = {
          ...updatedVariations[0],
          options: newVr1Options,
        };

        // Add a new option to the specific index
        updatedVariations[index] = {
          ...updatedVariations[index],
          options: [
            ...updatedVariations[index].options,
            { name: "", _id: priceID }, // Generate a new ID for the new option
          ],
        };
      }
    } else {
      const newVr = { ...updatedVariations[index] };
      const newOptions = [...newVr.options];
      newOptions.push({
        ...newOption,
        capital: 0,
        srp: 0,
        disable: false,
        barcode: "",
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
    if (variations[index].options.length === 1) return false;
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

    setHasDuplicateVariant(isValid(variations, value, "name"));
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
              capital: 0,
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
    // para sa pag add ng pangalawang variation
    const priceID = uuidv4();
    const updatedVariations = [...variations];
    updatedVariations[0] = {
      ...updatedVariations[0],
      options: updatedVariations[0].options.map((option) => ({
        ...option,
        prices: [
          { _id: priceID, name: "", srp: 0, capital: 0, disable: false },
        ],
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

    if (capital <= 0 && srp <= 0) return false;

    if (updatedVariations.length === 2) {
      //para ma update yung bawat prices ng bawat options
      const newOptions = options.map((option) => {
        const newPrices = option.prices.map((objPrice) => {
          return { ...objPrice, srp, capital };
        });
        return { ...option, prices: newPrices };
      });
      updatedVariations[0] = { ...vr1, options: newOptions };
      setVariations(updatedVariations);
    } else {
      //para iupdate yung srp at capital ng option
      const newOPtions = options.map((option) => ({ ...option, srp, capital }));
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
                        required
                        value={variation.name || ""}
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

      <MDBRow className="d-flex align-items-center mt-5">
        <MDBCol
          md="2"
          className="d-flex justify-content-end align-content-center "
        >
          <h6>Variation Information</h6>
        </MDBCol>
        <MDBCol md="4" className="d-flex align-items-center">
          <h6 className="mt-2 mr-2">Capital:</h6>
          <MDBInputGroup
            prepend="₱"
            type="number"
            value={String(capital)}
            onChange={({ target }) => setCapital(Number(target.value))}
          />
        </MDBCol>
        <MDBCol md="4" className="d-flex align-items-center">
          <h6 className="mt-2 mr-2">SRP:</h6>
          <MDBInputGroup
            prepend="₱"
            type="number"
            value={String(srp)}
            onChange={({ target }) => setSrp(Number(target.value))}
          />
        </MDBCol>
        <MDBCol md="2">
          <MDBBtn color="danger" block onClick={handleApplyPriceInAllVariant}>
            Apply To All
          </MDBBtn>
        </MDBCol>
      </MDBRow>

      <Table
        variations={variations}
        setVariations={setVariations}
        collections={collections}
        preventSubmitForm={preventSubmitForm}
      />
    </>
  );
}

export default Variations;
