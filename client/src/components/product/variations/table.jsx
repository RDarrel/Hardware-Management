import { MDBCol, MDBInputGroup, MDBRow, MDBTable } from "mdbreact";
import React, { useEffect, useState } from "react";

function Table({ variations }) {
  const [_variations, _setVariations] = useState([]);
  const [vr2IsMoreThanVr1, setVr2IsMoreThanVr1] = useState(false);
  const [variantionsWithPrice, setVariantionsWithPrice] = useState([]);

  useEffect(() => {
    const copyOfVariations = variations.map((variation) => ({
      ...variation,
      options: [...variation.options],
    }));
    if (variations.length === 2) {
      const vr2IsMoreThanVr1 =
        variations[1]?.options?.length > variations[0]?.options?.length;

      if (vr2IsMoreThanVr1) {
        const newOptions = [];
        let baseIndex = -1;
        copyOfVariations[0].options.forEach(() => {
          copyOfVariations[1].options.forEach((option, index) => {
            if (index === 0) {
              baseIndex++;
              newOptions.push({ index: baseIndex });
            }
            newOptions.push({ name: option, price: 0 });
          });
        });

        const updatedVariations = [...copyOfVariations];
        updatedVariations[1].options = newOptions;

        _setVariations(updatedVariations);
        setVr2IsMoreThanVr1(vr2IsMoreThanVr1);
      }
    } else {
      const _vr1OptionsCopy = [];
      copyOfVariations[0].options.forEach((option, index) => {
        _vr1OptionsCopy.push({ name: option, price: 0, index });
      });

      copyOfVariations[0].options = _vr1OptionsCopy;
      setVr2IsMoreThanVr1(false);

      _setVariations(copyOfVariations);
    }
  }, [variations]);

  const handleChangePrice = (price, { option, index }) => {
    const optionsCopy = !vr2IsMoreThanVr1
      ? _variations[0].options
      : _variations[1].options;

    const reversedArray = optionsCopy.slice(0, index).reverse();
    const variantIndex = reversedArray.find((obj) =>
      Object.keys(obj).includes("index")
    )?.index;

    const variantStorage =
      _variations[0].options[vr2IsMoreThanVr1 ? variantIndex : index];

    var variant = "";
    if (typeof variantStorage === "object") {
      variant = variantStorage.name;
    } else {
      variant = variantStorage;
    }

    const _variantionsWithPrice = [...variantionsWithPrice];
    const variationIndex = _variantionsWithPrice.findIndex(
      ({ name }) => name === name
    );
    const variantHasExist = _variantionsWithPrice.find(
      ({ name }) => name === name
    );

    if (!variantHasExist) {
      _variantionsWithPrice.push({
        name: variant,
        options: [{ name: option, price }],
      });
    } else {
      const optionHasExist = variantHasExist.options.findIndex(
        ({ name }) => name === option
      );

      if (optionHasExist > -1) {
        const newPrices = {
          ...variantHasExist.options[optionHasExist].prices,
          [option]: price,
        };
      } else {
        const newOption = {
          name: option,
          prices: {
            [option]: price,
          },
        };
      }
    }
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
            {_variations[vr2IsMoreThanVr1 ? 1 : 0]?.options?.map(
              (data, index) => {
                const { name = "", index: baseIndex = -1, price } = data;
                const vr1Options = _variations[0]?.options;

                const rowSpan = vr2IsMoreThanVr1
                  ? _variations[1]?.options?.length / vr1Options.length
                  : 0;

                const isShowPrice =
                  !vr2IsMoreThanVr1 || baseIndex === -1 ? true : false;

                return (
                  <tr key={`${index}-${name}`} className="border border-black">
                    {vr2IsMoreThanVr1 && baseIndex > -1 && (
                      <td
                        className="text-center border border-black "
                        rowSpan={rowSpan}
                        style={{ verticalAlign: "middle" }}
                      >
                        {vr1Options[baseIndex]}
                      </td>
                    )}
                    {isShowPrice && (
                      <>
                        <td className="text-center border border-black">
                          {name}
                        </td>
                        <td
                          className="text-center border border-black"
                          width={250}
                        >
                          <MDBInputGroup
                            prepend="₱"
                            type="number"
                            value={String(price)}
                            onChange={(e) =>
                              handleChangePrice(Number(e.target.value), {
                                index,
                                option: name,
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
