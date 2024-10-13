const Stocks = require("../../models/stockman/Stocks");

const statusOfProducts = async () => {
  try {
    const currentDate = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    const nearlyExpired = await Stocks.find({
      hasExpiration: true,
      hasExpired: false,
      expirationDate: {
        $gte: currentDate,
        $lte: oneMonthFromNow,
      },
    }).populate("product");

    const outOfStocks = await Stocks.find().populate("product");

    const arrangeStocks =
      outOfStocks.length > 0
        ? outOfStocks.reduce((acc, curr) => {
            const {
              variant1 = "",
              variant2 = "",
              product,
              quantityStock = 0,
              kiloStock = 0,
            } = curr;

            const key = `${product._id}-${variant1}-${variant2}`;
            const index = acc.findIndex(({ key: _key }) => _key == key);
            if (index > -1) {
              acc[index].stock += product.isPerKilo ? kiloStock : quantityStock;
            } else {
              acc.push({
                ...curr._doc,
                key,
                stock: product.isPerKilo ? kiloStock : quantityStock,
              });
            }

            return acc;
          }, [])
        : [];

    const productOutOfStocks =
      arrangeStocks.length > 0
        ? arrangeStocks
            .filter(({ stock }) => stock <= 20)
            .sort((a, b) => a.stock - b.stock)
        : [];

    return { nearlyExpired, outOfStocks: productOutOfStocks };
  } catch (error) {
    console.log("Error in status of products:", error.message);
  }
};

module.exports = statusOfProducts;
