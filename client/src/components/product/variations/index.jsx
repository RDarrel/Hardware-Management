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

function Variations({
  variations = [],
  setVariations,
  media,
  setMedia,
  variationsWithPrice,
  setVariationsWithPrice,
}) {
  const [price, setPrice] = useState(0),
    [isApplyPrice, setIsApplyPrice] = useState(false);

  const handleChangeOptions = (option, index, optionIndex) => {
    console.log(option);
    console.log(index);
    const updatedVariations = [...variations];
    updatedVariations[index].options[optionIndex].name = option;
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

  const handleAddOptions = (index) => {
    const updatedVariations = [...variations];
    const newOption = { name: "", _id: uuidv4() };
    if (updatedVariations[index].options?.length < 20) {
      updatedVariations[index].options.push(newOption);
      setVariations(updatedVariations);
    }

    if (index === 0) {
      const optionImages = [...media.variant.options];
      optionImages.push({ _id: newOption._id, label: "" });
      setMedia({
        ...media,
        variant: { ...media.variant, options: optionImages },
      });
    }
  };

  const handleRemoveOption = (index, optionIndex) => {
    if (optionIndex !== 0) {
      const updatedVariations = [...variations];
      updatedVariations[index].options.splice(optionIndex, 1);
      setVariations(updatedVariations);
    }

    if (index === 0 && optionIndex !== 0) {
      const optionImages = [...media.variant.options];
      optionImages.splice(optionIndex, 1);

      setMedia({
        ...media,
        variant: { ...media.variant, options: optionImages },
      });
    }
  };

  const handleChangeVrName = (value, index) => {
    const updatedVariations = [...variations];
    updatedVariations[index].name = value;
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
      const variant = updatedVariations[0] || {};
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
  };
  console.log(variations);

  const handleAddVr = () => {
    const updatedVariations = [...variations];
    updatedVariations.push({
      _id: uuidv4(),
      name: "Color",
      options: [{ name: "Red", _id: uuidv4() }],
    });
    setVariations(updatedVariations);
  };

  return (
    <>
      {variations.map((variation, index) => (
        <React.Fragment key={`main-variation-${index}`}>
          <MDBRow className="mt-5" key={index}>
            <MDBCol md="2" className="d-flex justify-content-end ">
              <h5>Variation {index + 1}</h5>
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
                      <h5>Name</h5>
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
                <h5>Variation {variations.length + 1}</h5>
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
          <h5>Variation Information</h5>
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
          <MDBBtn
            color="danger"
            block
            onClick={() => {
              setIsApplyPrice(true);
            }}
          >
            Apply To All
          </MDBBtn>
        </MDBCol>
      </MDBRow>

      <Table
        variations={variations}
        setVariations={setVariations}
        priceApplyInAllVarations={isApplyPrice ? price : 0}
        variationsWithPrice={variationsWithPrice}
        setVariationsWithPrice={setVariationsWithPrice}
      />
    </>
  );
}

export default Variations;
