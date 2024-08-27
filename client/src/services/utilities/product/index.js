const getGramsTxt = (_grams) => {
  const grams = Number(_grams);
  if (grams === 0.75 || grams === 75) {
    return "3/4";
  } else if (grams === 0.5 || grams === 5) {
    return "1/2";
  } else if (grams === 0.25 || grams === 25) {
    return "1/4";
  } else {
    return "";
  }
};

const productOrder = {
  getMax: (selected) => {
    const { product, variant1, variant2 } = selected;
    const { hasVariant, has2Variant } = product;
    let max = 0;

    if (hasVariant) {
      const options = product.variations[0].options;
      const option = options.find(({ _id }) => _id === variant1);

      if (option) {
        max = option.max;

        if (has2Variant) {
          const priceOption = option.prices.find(({ _id }) => _id === variant2);
          if (priceOption) {
            max = priceOption.max;
          }
        }
      }
    } else {
      max = product.max;
    }

    return max;
  },
  kiloText: (_kilo) => {
    const stringToArray = String(_kilo).split(".");
    console.log(stringToArray);
    const kilo = Number(stringToArray[0]);
    const grams = Number(stringToArray[1] || 0);
    console.log(grams);
    if (kilo && grams) {
      return `${kilo} kilo${kilo > 1 ? "s" : ""} 
      and ${getGramsTxt(grams)}
      `;
    } else if (kilo && !grams) {
      return `${kilo} kilo${kilo > 1 ? "s" : ""}`;
    } else {
      return getGramsTxt(grams);
    }
  },
};

export default productOrder;
