import React from "react";
import { MDBCol, MDBInput, MDBInputGroup, MDBRow, MDBTable } from "mdbreact";

function Table({ variations, setVariations }) {
  const handleChangePriceHaveVr2 = (
    value,
    name,
    optionIndex,
    priceIndex = -1
  ) => {
    const updatedVariations = [...variations];
    const vr1 = { ...variations[0] };
    const vr1Options = [...vr1.options];
    if (priceIndex > -1) {
      const prices = [...vr1Options[optionIndex].prices];
      const price = { ...prices[priceIndex], [name]: value };
      const option = { ...vr1Options[optionIndex] };
      prices[priceIndex] = price;
      vr1Options[optionIndex] = { ...option, prices };
    } else {
      const option = { ...vr1Options[optionIndex], [name]: value };
      vr1Options[optionIndex] = option;
    }
    vr1.options = vr1Options;
    updatedVariations[0] = vr1;
    setVariations(updatedVariations);
  };

  return (
    <>
      <h5 className="text-center mb-0 mt-4" style={{ marginBottom: "-20rem" }}>
        Variation List
      </h5>

      <MDBRow className="mt-4">
        {/* <MDBCol md="2" className="d-flex justify-content-end mt-3">
        <h5>Variation List</h5>
      </MDBCol> */}
        <MDBCol>
          <MDBTable style={{ border: "collapse" }}>
            <thead>
              <tr className="border border-black">
                {variations.map(({ name }, index) => (
                  <th
                    key={`${index}-tableHeader`}
                    className="text-center border border-black bg-light"
                  >
                    {name || "Name"}
                  </th>
                ))}
                <th className="text-center border border-black bg-light">
                  Capital
                </th>
                <th className="text-center border border-black bg-light">
                  SRP
                </th>
                <th className="text-center border border-black bg-light">
                  Barcode
                </th>
              </tr>
            </thead>
            <tbody>
              {variations[0].options?.map((option, optionIndex) =>
                option?.prices?.length > 0 ? (
                  option.prices.map((price, priceIndex) => {
                    const isFirstRow = priceIndex === 0;
                    return (
                      <tr
                        key={`dualVariant-${option?._id}-${price?._id}-${optionIndex}`}
                      >
                        {isFirstRow && (
                          <td
                            rowSpan={option.prices.length}
                            style={{ verticalAlign: "middle" }}
                            className="text-center border border-black"
                          >
                            {option.name || "Option"}
                          </td>
                        )}
                        <td className="text-center border border-black">
                          {price?.name || "Option"}
                        </td>
                        <td
                          className="text-center border border-black"
                          width={250}
                        >
                          <MDBInputGroup
                            prepend="₱"
                            onChange={({ target }) =>
                              handleChangePriceHaveVr2(
                                Number(target.value),
                                "capital",
                                optionIndex,
                                priceIndex
                              )
                            }
                            value={String(price?.capital)}
                            required
                            type="number"
                          ></MDBInputGroup>
                        </td>
                        <td
                          className="text-center border border-black"
                          width={250}
                        >
                          <MDBInputGroup
                            prepend="₱"
                            onChange={({ target }) =>
                              handleChangePriceHaveVr2(
                                Number(target.value),
                                "srp",
                                optionIndex,
                                priceIndex
                              )
                            }
                            value={String(price?.srp)}
                            required
                            type="number"
                          ></MDBInputGroup>
                        </td>

                        <td
                          className="text-center border border-black"
                          width={250}
                        >
                          <input
                            className="form-control"
                            placeholder="Barcode"
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr key={`singleVariant-${option?._id}-${optionIndex}`}>
                    <td className="text-center border border-black">
                      {option?.name || "Option"}
                    </td>
                    <td className="text-center border border-black" width={250}>
                      <MDBInputGroup
                        prepend="₱"
                        onChange={({ target }) =>
                          handleChangePriceHaveVr2(
                            Number(target.value),
                            "capital",
                            optionIndex
                          )
                        }
                        value={String(option?.capital)}
                        required
                        type="number"
                      ></MDBInputGroup>
                    </td>
                    <td className="text-center border border-black" width={250}>
                      <MDBInputGroup
                        prepend="₱"
                        onChange={({ target }) =>
                          handleChangePriceHaveVr2(
                            Number(target.value),
                            "srp",
                            optionIndex
                          )
                        }
                        value={String(option?.srp)}
                        required
                        type="number"
                      ></MDBInputGroup>
                    </td>

                    <td className="text-center border border-black" width={250}>
                      <input className="form-control" placeholder="Barcode" />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </MDBTable>
        </MDBCol>
      </MDBRow>
    </>
  );
}

export default Table;
