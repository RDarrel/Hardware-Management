const ArrangeStocks = require("../../config/arrangeStocks"),
  Sales = require("../../models/administrator/report/Sales");

const getSales = async () => {
  try {
    const sales = await Sales.find().populate("product");
    return sales;
  } catch (error) {
    console.log("Error in Get Sales", error.message);
  }
};

const getTopSellingProducts = async () => {
  try {
    const arrangeStocks = await ArrangeStocks();

    arrangeStocks.sort((a, b) => b.sold - a.sold);

    return (topSoldItems = arrangeStocks.slice(0, 10));
  } catch (error) {
    console.log("Error in Get top selling products", error.message);
  }
};

exports.browse = async (_, res) => {
  try {
    res.json({
      payload: {
        topSellingProducts: await getTopSellingProducts(),
        sales: await getSales(),
      },
      success: "Successfully Fetch Dashboard",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
