const Stocks = require("../models/stockman/Stocks");

const handleFormatedData = (product, stock) => {
  if (product.isPerKilo) {
    return {
      hasExpired: true,
      expiredKilo: stock.kiloStock,
      kiloStock: stock.kiloStock < 0 ? stock.kiloStock : 0,
    };
  }
  return {
    hasExpired: true,
    expiredQuantity: stock.quantity,
    quantityStock: stock.quantityStock < 0 ? stock.quantityStock : 0,
  };
};

const RemoveExpiredProducts = async () => {
  try {
    const currentDate = new Date();
    const expiredProducts = await Stocks.find({
      expirationDate: { $lte: currentDate },
      hasExpiration: true,
      hasExpired: false,
    });

    if (expiredProducts.length > 0) {
      return true;
      // for (const expiredProduct of expiredProducts) {
      //   await Stocks.findByIdAndUpdate(
      //     expiredProduct._id,
      //     handleFormatedData(expiredProduct.product, expiredProduct)
      //   );
      // }
    }
  } catch (error) {
    console.log("Remove Expired Products Error:", error.message);
  }
};

module.exports = RemoveExpiredProducts;
