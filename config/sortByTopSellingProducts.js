const arrangeStocks = require("./arrangeStocks");

const sortByTopSellingProducts = async (products) => {
  try {
    const stocks = await arrangeStocks();
    const uniqueProductStocks = stocks.reduce((acc, curr) => {
      const { product = {}, sold = 0 } = curr;
      const key = product?._id;
      const index = acc.findIndex(({ key: _key }) => _key === key);
      if (index > -1) {
        acc[index] = { ...acc[index], sold: acc[index].sold + sold };
      } else {
        acc.push({ ...curr, sold, key });
      }
      return acc;
    }, []);

    const containerWithSold = products.map((item) => {
      const matchingStock = uniqueProductStocks.find(
        (stock) => String(stock?.product?._id) === String(item?._id)
      );
      return {
        ...item,
        sold: matchingStock ? matchingStock.sold : 0,
      };
    });

    return containerWithSold.sort((a, b) => b.sold - a.sold) || [];
  } catch (error) {
    console.log("Error in sortby Top Selling Products", error.message);
  }
};

module.exports = sortByTopSellingProducts;
