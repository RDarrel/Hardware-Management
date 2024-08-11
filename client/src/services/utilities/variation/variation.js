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

const computeSubtotal = ({ srp, isPerKilo, kilo, kiloGrams, quantity }) => {
  if (isPerKilo) {
    const totalKilo = Number(kilo) + Number(kiloGrams);
    return Number(srp) * totalKilo;
  } else {
    return Number(srp) * Number(quantity);
  }
};

const variation = {
  name: (obj, variations) => {
    const _variations = variations.filter(Boolean);
    const foundVariant1 = _variations[0].options?.find(
      ({ _id }) => _id === obj.variant1
    )?.name;

    if (_variations.length > 1) {
      const foundVariant2 = _variations[1].options.find(
        ({ _id }) => _id === obj.variant2
      )?.name;

      return `${foundVariant1} / ${foundVariant2}`;
    } else {
      return `${foundVariant1}`;
    }
  },

  qtyOrKilo: (obj, isPerKilo) => {
    if (isPerKilo) {
      return `${
        obj.kiloGrams === 0 || !obj.kiloGrams
          ? `${obj.kilo} kilo${obj.kilo > 1 ? "s" : ""}`
          : `${obj.kilo} kilo${obj.kilo > 1 ? "s" : ""} and ${getTheGrams(
              obj.kiloGrams
            )}`
      }`;
    } else {
      return ` ${obj.quantity} qty`;
    }
  },

  getTheSubTotal: (name, cart, product) => {
    // name= 'capital' || 'srp'
    const { hasVariant, has2Variant, variations, isPerKilo } = product;
    const {
      variant1 = "",
      variant2 = "",
      kiloGrams = 0,
      kilo,
      quantity,
    } = cart;

    if (hasVariant) {
      if (has2Variant) {
        const srp = variations[0].options
          .find(({ _id }) => _id === variant1)
          ?.prices.find(({ _id }) => _id === variant2)[name];

        return computeSubtotal({ srp, isPerKilo, kilo, kiloGrams, quantity });
      } else {
        const srp = variations[0].options.find(({ _id }) => _id === variant1)[
          name
        ];
        return computeSubtotal({ srp, isPerKilo, kilo, kiloGrams, quantity });
      }
    } else {
      return computeSubtotal({
        srp: product[name],
        isPerKilo,
        kilo,
        kiloGrams,
        quantity,
      });
    }
  },

  getTheCapitalOrSrp: (name, cart, product) => {
    //name= srp or capital
    const { hasVariant, has2Variant, variations } = product;
    const { variant1 = "", variant2 = "" } = cart;

    if (hasVariant) {
      if (has2Variant) {
        return variations[0].options
          .find(({ _id }) => _id === variant1)
          .prices.find(({ _id }) => _id === variant2)[name];
      } else {
        return variations[0].options.find(({ _id }) => _id === variant1)[name];
      }
    } else {
      return product[name];
    }
  },
  getTheVariant: (_variant1, _variant2, variations) => {
    variations = variations.filter(Boolean);
    const foundVariant1 = variations[0]?.options.find(
      ({ _id }) => _id === _variant1
    )?.name;

    if (variations.length > 1) {
      const foundVariant2 = variations[1].options.find(
        ({ _id }) => _id === _variant2
      )?.name;

      return `${foundVariant1} / ${foundVariant2}`;
    } else {
      return `${foundVariant1}`;
    }
  },
};

export default variation;
