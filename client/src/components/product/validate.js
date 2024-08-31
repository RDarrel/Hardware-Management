const validate = {
  barcode: (products, barcode) => {
    const hasDuplicate = [...products]
      .map((product) => {
        const { hasVariant, has2Variant, variations = [] } = product;
        if (!hasVariant) {
          return barcode === product.barcode;
        }

        if (hasVariant && !has2Variant) {
          const vr1 = variations[0];
          return vr1.options.some(({ barcode: b }) => barcode === b);
        }

        if (has2Variant && hasVariant) {
          const vr1 = variations[0];
          return vr1.options.some(({ prices = [] }) =>
            prices.some(({ barcode: b }) => b === barcode)
          );
        }
        return false;
      })
      .filter(Boolean);

    console.log(hasDuplicate);

    return hasDuplicate.length > 0;
  },
};

export default validate;
