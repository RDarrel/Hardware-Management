import { MDBCol, MDBInputGroup, MDBRow, MDBTable } from "mdbreact";
import React, { useEffect, useState } from "react";

function Table({
  variations,
  priceApplyInAllVarations,
  variationsWithPrice,
  setVariationsWithPrice,
}) {
  const [_variations, _setVariations] = useState([]);
  const [haveVariation2, setHaveVariation2] = useState(false);

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

      //to set a price in variation 1
      const vr1 = { ...variations[0] };
      const vr2 = { ...variations[1] };
      const vr1OptionsWithPrice = vr1.options.map((option) => ({
        ...option,
        prices: vr2.options.map((option2) => ({
          ...option2,
          srp: priceApplyInAllVarations,
          disable: false,
        })),
      }));

      setVariationsWithPrice([
        { ...vr1, options: vr1OptionsWithPrice },
        { ...vr2 },
      ]);

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
      //this code is to put a price in each option in a variant
      const vr1 = { ...variations[0] };
      const optionsWithPrice = vr1.options.map((option) => ({
        ...option,
        srp: priceApplyInAllVarations,
        disable: false,
      }));

      setVariationsWithPrice([{ ...vr1, options: optionsWithPrice }]);
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

    var variantID = variantStorage._id;

    if (haveVariation2) {
      handleChangeHaveVariation2(variantID, option, price);
    } else {
      handleChangeVaration1(variantID, price);
    }
    handleChangeCurrentVariations(baseIndex, price);
  };

  const handleChangeVaration1 = (variantID, price) => {
    const vr1 = { ...variationsWithPrice[0] };
    const options = [...vr1.options];
    const optionIndex = options.findIndex(({ _id }) => variantID === _id);
    options[optionIndex].srp = price;

    setVariationsWithPrice([vr1]);
  };

  const handleChangeHaveVariation2 = (variantID, option, price) => {
    //the option parameter is _id, _id of variation 2
    const _variationsWithPrice = [...variationsWithPrice];
    const vr1 = { ..._variationsWithPrice[0] };
    const options = [...vr1.options];

    const optionIndex = options.findIndex(({ _id }) => _id === variantID);
    const priceIndex = options[optionIndex].prices.findIndex(
      ({ _id }) => _id === option
    );

    options[optionIndex].prices[priceIndex].srp = price;

    vr1.options = options;
    _variationsWithPrice[0] = vr1;

    setVariationsWithPrice(_variationsWithPrice);
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
