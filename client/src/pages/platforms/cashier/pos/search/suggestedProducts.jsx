import React, { useEffect, useState, useRef } from "react";
import { MDBCard, MDBCardBody } from "mdbreact";
import { variation } from "../../../../../services/utilities";

function SuggestedProducts({
  products: collections = [],
  search,
  handleAddOrder,
  setSearch,
  setDidSearch,
}) {
  const [suggested, setSuggested] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const selectedItemRef = useRef(null);

  useEffect(() => {
    if (search && collections.length > 0) {
      const productsWithVariant = mergeVariantInProduct(collections);
      const filteredProducts = productsWithVariant.filter((collection) => {
        const { name } = collection;
        return name
          .toLocaleLowerCase()
          .replace(/\s/g, "")
          .includes(search.toLocaleLowerCase().replace(/\s/g, ""));
      });
      // Sort filteredProducts by how close the match is to the beginning
      filteredProducts.sort((a, b) => {
        const nameA = a.name.toLowerCase().replace(/\s/g, "");
        const nameB = b.name.toLowerCase().replace(/\s/g, "");
        const indexA = nameA.indexOf(search.toLowerCase().replace(/\s/g, ""));
        const indexB = nameB.indexOf(search.toLowerCase().replace(/\s/g, ""));
        return indexA - indexB; // Sort by index position (asce
      });

      if (filteredProducts.length > 1) {
        setSuggested(filteredProducts);
      }
    }
  }, [search, collections]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        setSelectedIndex((prevIndex) =>
          prevIndex < suggested.length - 1 ? prevIndex + 1 : prevIndex
        );
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        setDidSearch(true);
        handleAddOrder(suggested[selectedIndex]);
        setSearch("");
        return () => setSelectedIndex(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, suggested, handleAddOrder, setSearch, setDidSearch]);

  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [selectedIndex]);

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
                className={`suggested-container result ${
                  index === selectedIndex ? "selected-active" : ""
                }`}
                ref={index === selectedIndex ? selectedItemRef : null}
                onClick={() => {
                  handleAddOrder(product);
                  setSearch("");
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div className="m-0 p-0">
                    <p className="product-name">{name}</p>
                    {hasVariant && (
                      <p className="variant-name">
                        Variatiant:{" "}
                        {variation.getTheVariant(
                          variant1,
                          variant2,
                          variations
                        )}
                      </p>
                    )}
                  </div>
                  <div className="text-end">
                    <p
                      className={`m-0 p-0 ${
                        index === selectedIndex ? "text-white" : "text-danger"
                      }`}
                    >
                      ₱
                      {variation
                        .getTheCapitalOrSrp("srp", product, product)
                        .toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}

export default SuggestedProducts;
