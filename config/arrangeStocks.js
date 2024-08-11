const Stocks = require("../models/stockman/Stocks"),
  RemoveExpiredProducts = require("./removeExpiredProducts");

const arrangeStocks = async () => {
  try {
    await RemoveExpiredProducts();
    const stocks = await Stocks.find().populate("product");
    const computedStocks = stocks.reduce((accumulator, currentValue) => {
      const {
        kiloStock = 0,
        kiloGrams = 0,
        kilo = 0,
        quantityStock = 0,
        quantity = 0,
        product,
        expiredQuantity = 0,
        expiredKilo = 0,
      } = currentValue;
      const key = `${currentValue.product?._id}-${
        currentValue.variant1 || ""
      }-${currentValue.variant2 || ""}`;

      const index = accumulator.findIndex((accu) => accu.key === key);

      if (index > -1) {
        if (currentValue?.product?.isPerKilo) {
          accumulator[index].available += kiloStock > 0 ? kiloStock : 0;
          accumulator[index].beginning += kilo + kiloGrams;
          accumulator[index].sold +=
            kilo + kiloGrams - Math.abs(kiloStock - expiredKilo) || 0;
        } else {
          accumulator[index].available += quantityStock > 0 ? quantityStock : 0;
          accumulator[index].beginning += quantity;
          accumulator[index].sold +=
            quantity - Math.abs(quantityStock - expiredQuantity) || 0;
        }
      } else {
        const { isPerKilo } = product;
        const sold = isPerKilo
          ? kilo + kiloGrams - Math.abs(kiloStock - expiredKilo) || 0
          : quantity - Math.abs(quantityStock - expiredQuantity) || 0;
        accumulator.push({
          ...currentValue._doc,
          key,
          available: isPerKilo
            ? kiloStock > 0
              ? kiloStock
              : 0
            : quantityStock > 0
            ? quantityStock
            : 0,
          beginning: isPerKilo ? kilo + kiloGrams : quantity,
          sold,
        });
      }

      return accumulator;
    }, []);

    return computedStocks;
  } catch (error) {
    console.log("Arrange Stocks Error:", error.message);
  }
};

module.exports = arrangeStocks;
