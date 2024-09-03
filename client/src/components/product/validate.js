const validate = {
  barcode: (products, { newBarcode: barcode, currentID }) => {
    const hasDuplicate = [...products]
      .map((product) => {
        const {
          hasVariant = false,
          has2Variant = false,
          variations = [],
          _id = "",
        } = product;

        if (!hasVariant) {
          return barcode === product.barcode && _id !== currentID;
        }

        if (hasVariant && !has2Variant) {
          const vr1 = variations[0];
          return vr1.options.some(
            ({ barcode: b, _id = "" }) => barcode === b && _id !== currentID
          );
        }

        if (has2Variant && hasVariant) {
          const vr1 = variations[0];

          return vr1.options.some(({ prices = [] }) =>
            prices.some(
              ({ barcode: b, _id = "" }) => b === barcode && _id !== currentID
            )
          );
        }
        return false;
      })
      .filter(Boolean);

    return hasDuplicate.length > 0;
  },

  hasDuplicateBarcode: (product) => {
    const {
      isDuplicateBarcode = false,
      variations,
      has2Variant,
      hasVariant,
    } = product;
    const vr1 = variations[0] || {};
    if (!hasVariant) {
      return isDuplicateBarcode;
    } else if (hasVariant && !has2Variant) {
      return vr1.options.some(
        ({ isDuplicateBarcode: hasDuplicate = false }) => hasDuplicate
      );
    } else if (has2Variant && hasVariant) {
      return vr1.options.some(({ prices = [] }) =>
        prices.some(({ isDuplicateBarcode: hasDuplicate }) => hasDuplicate)
      );
    }
    return false;
  },
};

export default validate;
