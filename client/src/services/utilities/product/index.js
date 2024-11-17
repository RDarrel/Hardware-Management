import variation from "../variation/variation";

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

const gramsConverter = (grams) => {
  switch (grams) {
    case 5:
      return 0.5;
    case 75:
      return 0.75;
    case 25:
      return 0.25;
    default:
      return grams;
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
    const kilo = Number(stringToArray[0]);
    const grams = Number(stringToArray[1] || 0);
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

  refund: (order) => {
    const {
      product,
      quantityRefund = 0,
      kiloGramsRefund = 0,
      kiloRefund = 0,
    } = order;

    const { isPerKilo } = product;

    if (quantityRefund > 0 || kiloGramsRefund > 0 || kiloRefund > 0) {
      return variation.qtyOrKilo(
        {
          quantity: quantityRefund,
          kilo: kiloRefund,
          kiloGrams: kiloGramsRefund,
        },
        isPerKilo
      );
    } else {
      return "--";
    }
  },

  originalQtyKilo: (order) => {
    const {
      product,
      quantity = 0,
      quantityRefund = 0,
      kilo = 0,
      kiloRefund = 0,
      kiloGrams = 0,
      kiloGramsRefund = 0,
    } = order;
    if (product.isPerKilo) {
      const totalNet = kilo + gramsConverter(kiloGrams);
      const totalRefund = kiloRefund + gramsConverter(kiloGramsRefund);
      const total = totalNet + totalRefund;
      const totalInArray = String(total).split(".");
      var totalKilo = Number(totalInArray[0] || 0);
      var totalGrams = Number(totalInArray[1] || 0);
      return variation.qtyOrKilo(
        { ...order, kilo: totalKilo, kiloGrams: gramsConverter(totalGrams) },
        product.isPerKilo
      );
    } else {
      const total = quantity + quantityRefund;
      return variation.qtyOrKilo(
        { ...order, quantity: total },
        product.isPerKilo
      );
    }
  },
  subtotal: (order) => {
    if (!order) return console.log("order is undefined!");
    const {
      product,
      capital = 0,
      kilo = 0,
      kiloGrams = 0,
      quantity = 0,
    } = order;
    const { isPerKilo } = product;

    if (isPerKilo) {
      const totalPurchaseKg = kilo + kiloGrams;
      return totalPurchaseKg * capital;
    } else {
      return quantity * capital;
    }
  },
};

export default productOrder;
