const ExpiredProducts = require("../../../models/administrator/report/ExpiredProducts");

exports.browse = async (req, res) => {
  try {
    const products = await ExpiredProducts.find()
      .populate("removeBy")
      .populate("product");
    res.json({ payload: products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
