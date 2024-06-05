const getTheGrams = (grams) => {
  switch (grams) {
    case 0.25:
      return "1/4";
    case 0.5:
      return "1/2";

    default:
      return "3/4";
  }
};

const variation = {
  name: (obj, variations) => {
    const foundVariant1 = variations[0].options.find(
      ({ _id }) => _id === obj.variant1
    )?.name;

    if (variations.length > 1) {
      const foundVariant2 = variations[1].options.find(
        ({ _id }) => _id === obj.variant2
      )?.name;

      return `${foundVariant1}/${foundVariant2}`;
    } else {
      return `${foundVariant1}`;
    }
  },

  qtyOrKilo: (obj, isPerKilo) => {
    if (isPerKilo) {
      return `${
        obj.kiloGrams === 0
          ? `${obj.kilo} kilo${obj.kilo > 1 ? "s" : ""}`
          : `${obj.kilo} kilo${obj.kilo > 1 ? "s" : ""} and ${getTheGrams(
              obj.kiloGrams
            )}`
      }`;
    } else {
      return ` ${obj.quantity} qty`;
    }
  },
};

export default variation;
