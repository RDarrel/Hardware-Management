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
};

export default productOrder;
