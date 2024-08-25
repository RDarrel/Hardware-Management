const arrangeStocks = require("../../config/arrangeStocks");
const Entity = require("../../models/stockman/Stocks"),
  ExpiredProducts = require("../../models/administrator/report/ExpiredProducts"),
  RemoveExpiredProducts = require("../../config/removeExpiredProducts"),
  handleDuplicate = require("../../config/duplicate");

const getExpiredProducts = async () => {
  const currentDate = new Date();
  const expiredProducts = await Entity.find({
    expirationDate: { $lte: currentDate },
    hasExpiration: true,
    hasExpired: false,
  }).populate("product");
  return expiredProducts;
};

const handleFormatedExpired = (product, stock) => {
  if (product.isPerKilo) {
    return {
      hasExpired: true,
      expiredKilo: stock.quantity,
      kiloStock: stock.quantity < 0 ? stock.quantity : 0,
    };
  }
  return {
    hasExpired: true,
    expiredQuantity: stock.quantity,
    quantityStock: stock.quantity < 0 ? stock.quantity : 0,
  };
};

exports.browse = async (_, res) => {
  try {
    const stocks = await arrangeStocks();
    const expiredProducts = await getExpiredProducts();
    res.json({ payload: { stocks, expiredProducts } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.save = (req, res) =>
  Entity.create(req.body)
    .then((item) =>
      res.status(201).json({
        success: "Supplier Created Successfully",
        payload: item,
      })
    )
    .catch((error) => res.status(400).json({ error: handleDuplicate(error) }));

exports.update = (req, res) =>
  Entity.findByIdAndUpdate(req.body._id, req.body, { new: true })
    .then((item) => {
      if (item) {
        res.json({
          success: "Role Updated Successfully",
          payload: item,
        });
      } else {
        res.status(404).json({
          error: "ID Not Found",
          message: "The provided ID does not exist.",
        });
      }
    })
    .catch((error) => res.status(400).json({ error: handleDuplicate(error) }));

exports.status = (req, res) =>
  Entity.findByIdAndUpdate(req.body._id, req.body, { new: true })
    .then((item) => {
      if (item) {
        res.json({
          success: `Supplier has been ${
            req.body.status ? "Active" : "Inactive"
          } Successfully`,
          payload: item,
        });
      } else {
        res.status(404).json({
          error: "ID Not Found",
          message: "The provided ID does not exist.",
        });
      }
    })
    .catch((error) => res.status(400).json({ error: handleDuplicate(error) }));

exports.destroy = (req, res) => {
  Entity.findByIdAndDelete(req.body._id)
    .then((item) => {
      res.json({ success: "Successfuly Deleted Product", payload: item });
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};

exports.removeExpired = async (req, res) => {
  try {
    const expired = req.body;
    const { _id, ...rest } = expired;
    await ExpiredProducts.create({
      ...rest,
      product: expired?.product?._id,
    });

    const updatedStock = await Entity.findByIdAndUpdate(
      expired._id,
      handleFormatedExpired(expired.product, expired),
      { new: true }
    );

    res.json({ payload: updatedStock });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.expiredProducts = async (_, res) => {
  try {
    // await RemoveExpiredProducts();
    const expiredProducts = await Entity.find({ hasExpired: true }).populate(
      "product"
    );

    res.json({
      success: "Successfully Fetch expired products",
      payload: expiredProducts,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
