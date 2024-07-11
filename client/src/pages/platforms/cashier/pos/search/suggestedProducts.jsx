import React, { useEffect, useState } from "react";
import { MDBCard, MDBCardBody } from "mdbreact";
import { variation } from "../../../../../services/utilities";

function SuggestedProducts({
  products: collections = [],
  search,
  handleAddOrder,
  setSearch,
}) {
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    if (search && collections.length > 0) {
      const productsWithVariant = mergeVariantInProduct(collections);
      const filteredProducts = productsWithVariant.filter((collection) => {
        const {
          name,
          variant1 = "",
          variant2 = "",
          variations = [],
        } = collection;
        const productWithVariant = `${name}-${
          variation.getTheVariant(variant1, variant2, variations) || "--"
        }`;
        console.log(productWithVariant);

        return name
          .toLocaleLowerCase()
          .replace(/\s/g, "")
          .includes(search.toLocaleLowerCase().replace(/\s/g, ""));
      });
      if (filteredProducts.length > 1) {
        setSuggested(filteredProducts);
      }
    }
  }, [search, collections]);

  const mergeVariantInProduct = (_products) => {
    const container = [];
    for (let product of _products) {
      const {
        hasVariant = false,
        has2Variant = false,
        variations = [],
      } = product || {};

      if (hasVariant) {
        const { options = [] } = variations[0];
        for (const option of options) {
          if (option.max > 0) {
            container.push({ ...product, variant1: option._id });
          }
          if (has2Variant) {
            const { prices } = option;

            for (const variant2 of prices) {
              if (variant2.max > 0) {
                container.push({
                  ...product,
                  variant1: option._id,
                  variant2: variant2._id,
                });
              }
            }
          }
        }
      } else {
        container.push(product);
      }
    }

    return container; // Update state with the processed data
  };

  return (
    <div className="search-result-container">
      <MDBCard className="search-result">
        <MDBCardBody className="m-0 p-0">
          {suggested.map((product, index) => {
            const {
              name,
              hasVariant,
              variant1 = "",
              variant2 = "",
              variations = [],
            } = product;
            return (
              <div
                key={index}
                className="result"
                onClick={() => {
                  handleAddOrder(product);
                  setSearch("");
                }}
              >
                <p className="product text-">{name}</p>
                {hasVariant && (
                  <p className="variant-name">
                    Variatiant:{" "}
                    {variation.getTheVariant(variant1, variant2, variations)}
                  </p>
                )}
              </div>
            );
          })}
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}

export default SuggestedProducts;
