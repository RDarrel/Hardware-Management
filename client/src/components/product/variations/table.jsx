import { MDBCol, MDBInputGroup, MDBRow, MDBTable } from "mdbreact";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function Table({
  variations,
  priceApplyInAllVarations,
  variationsWithPrice,
  setVariationsWithPrice,
}) {
  const [_variations, _setVariations] = useState([]);
  const [haveVariation2, setHaveVariation2] = useState(false);
  const [variation2, setVariation2] = useState([]);

  useEffect(() => {
    const copyOfVariations = variations.map((variation) => ({
      ...variation,
      options: variation.options,
    }));

    if (variations.length === 2) {
      const newOptions = [];
      let baseIndex = -1;
      copyOfVariations[0].options.forEach(() => {
        copyOfVariations[1].options.forEach(({ name, _id }, index) => {
          if (index === 0) {
            baseIndex++;
            newOptions.push({ index: baseIndex });
          }
          newOptions.push({ name, price: priceApplyInAllVarations, _id });
        });
      });

      const updatedVariations = [...copyOfVariations];
      updatedVariations[1].options = newOptions;

      setVariation2({
        ...variations[1],
        options: variations[1].options,
      });
      _setVariations(updatedVariations);
      setHaveVariation2(true);
    } else {
      const _vr1OptionsCopy = [];
      copyOfVariations[0].options.forEach(({ name, _id }, index) => {
        _vr1OptionsCopy.push({
          name,
          price: priceApplyInAllVarations,
          index,
          _id,
        });
      });

      copyOfVariations[0].options = _vr1OptionsCopy;
      setHaveVariation2(false);

      _setVariations(copyOfVariations);
    }
  }, [variations, priceApplyInAllVarations]);

  const handleChangePrice = (price, { option = "", index: baseIndex }) => {
    const optionsCopy = !haveVariation2
      ? _variations[0].options
      : _variations[1].options;

    const reversedArray = optionsCopy.slice(0, baseIndex).reverse();
    const variantIndex = reversedArray.find((obj) =>
      Object.keys(obj).includes("index")
    )?.index;

    const variantStorage =
      _variations[0].options[haveVariation2 ? variantIndex : baseIndex];

    var variant = ""; //  red blue green
    if (typeof variantStorage === "object") {
      variant = variantStorage.name;
    } else {
      variant = variantStorage;
    }
    if (haveVariation2) {
      handleChangeHaveVariation2(variant, option, price);
    } else {
      handleChangeVaration1(variant, price);
    }
    handleChangeCurrentVariations(baseIndex, price);
  };

  const handleChangeVaration1 = (variant, prices) => {
    const updatedVariationsWithPrice = [...variationsWithPrice];

    // Ensure the first element exists and has options
    if (updatedVariationsWithPrice[0]?.options) {
      const vr1Options = [...updatedVariationsWithPrice[0].options];
      const optionIndex = vr1Options.findIndex(({ name }) => name === variant);

      if (optionIndex > -1) {
        vr1Options[optionIndex].prices = prices;
      } else {
        vr1Options.push({ _id: uuidv4(), name: variant, prices });
      }

      updatedVariationsWithPrice[0].options = vr1Options;
    } else {
      // Ensure initial setup of options if not present
      updatedVariationsWithPrice[0] = {
        ...variations[0],
        _id: uuidv4(),
        options: [{ _id: uuidv4(), name: variant, prices }],
      };
    }

    setVariationsWithPrice(updatedVariationsWithPrice);
  };

  const handleChangeHaveVariation2 = (variant, option, price) => {
    const updatedVariationsWithPrice = [...variationsWithPrice];

    const variationIndex = updatedVariationsWithPrice.findIndex(
      ({ name }) => name === variations[0].name
    );

    if (variationIndex < 0) {
      updatedVariationsWithPrice.push({
        _id: uuidv4(),
        name: variations[0].name,
        options: [
          {
            name: variant,
            prices: [{ _id: option, srp: price, disable: false }],
          },
        ],
      });
    } else {
      const variantExist = updatedVariationsWithPrice[variationIndex];
      const optionIndex = variantExist.options.findIndex(
        ({ name }) => name === variant
      );

      if (optionIndex > -1) {
        // if the option is already exist
        const prices = variantExist.options[optionIndex].prices;
        const priceIndex = prices.findIndex(({ _id }) => _id === option);

        if (priceIndex > -1) {
          prices[priceIndex].srp = price;
        } else {
          prices.push({ _id: option, srp: price, disable: false });
        }

        variantExist.options[optionIndex].prices = prices;
      } else {
        //if the option is not exist
        variantExist.options.push({
          name: variant,
          prices: [{ _id: option, srp: price, disable: false }],
        });
      }

      updatedVariationsWithPrice[variationIndex] = variantExist;
    }
    if (updatedVariationsWithPrice.length <= 1) {
      updatedVariationsWithPrice.push({ ...variation2 });
    }
    setVariationsWithPrice(updatedVariationsWithPrice);
  };

  const handleChangeCurrentVariations = (index, price) => {
    const baseIndex = haveVariation2 ? 1 : 0;
    const baseVariations = [..._variations];
    const copyOfVrOptions = [...baseVariations[baseIndex].options];

    copyOfVrOptions[index].price = price;

    baseVariations[baseIndex].options = copyOfVrOptions;
    _setVariations(baseVariations);
  };

  return (
    <MDBRow className="mt-4">
      <MDBCol md="2" className="d-flex justify-content-end mt-3">
        <h5>Variation List</h5>
      </MDBCol>
      <MDBCol>
        <MDBTable>
          <thead>
            <tr className="border border-black">
              {_variations.map(({ name }, index) => (
                <th
                  key={`${index}-tableHeader`}
                  className="text-center border border-black bg-light"
                >
                  {name || "Name"}
                </th>
              ))}
              <th className="text-center border border-black bg-light">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {_variations[haveVariation2 ? 1 : 0]?.options?.map(
              (data, index) => {
                const {
                  name = "",
                  index: baseIndex = -1,
                  price,
                  _id,
                } = data || {};
                const vr1Options = _variations[0]?.options || [];

                const rowSpan = haveVariation2
                  ? _variations[1]?.options?.length / (vr1Options.length || 1)
                  : 0;

                const isShowPrice = !haveVariation2 || baseIndex === -1;

                return (
                  <tr key={`${index}-${name}`} className="border border-black">
                    {haveVariation2 && baseIndex > -1 && (
                      <td
                        className="text-center border border-black "
                        rowSpan={rowSpan}
                        style={{ verticalAlign: "middle" }}
                      >
                        {vr1Options[baseIndex].name || `Option`}
                      </td>
                    )}
                    {isShowPrice && (
                      <>
                        <td className="text-center border border-black">
                          {name || `Option `}
                        </td>
                        <td
                          className="text-center border border-black"
                          width={250}
                        >
                          <MDBInputGroup
                            prepend="₱"
                            required
                            type="number"
                            value={String(price)}
                            onChange={(e) =>
                              handleChangePrice(Number(e.target.value), {
                                index,
                                option: _id,
                              })
                            }
                          ></MDBInputGroup>
                        </td>
                      </>
                    )}
                  </tr>
                );
              }
            )}
          </tbody>
        </MDBTable>
      </MDBCol>
    </MDBRow>
  );
}

export default Table;
