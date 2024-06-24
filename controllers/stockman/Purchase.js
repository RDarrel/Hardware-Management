const bulkWrite = require("../../config/bulkWrite");
const Entity = require("../../models/stockman/Purchases"),
  Cart = require("../../models/Cart"),
  Stocks = require("../../models/stockman/Stocks"),
  Merchandises = require("../../models/stockman/Merchandises"),
  handleDuplicate = require("../../config/duplicate");

exports.browse = async (req, res) => {
  try {
    const status = req.query.status;
    const filter =
      req.query.isAdmin === "true"
        ? { status }
        : { requestBy: req.query.requestBy, status };

    const purchases = await Entity.find(filter)
      .populate("requestBy")
      .populate("supplier")
      .select("-__v")
      .sort({ createdAt: -1 });
    const container = [];

    for (const element of purchases) {
      const merchandises = await Merchandises.find({
        purchase: element._id,
      }).populate("product");
      container.push({ ...element._doc, merchandises });
    }

    res.json({ success: "Successfully fetched Purchase", payload: container });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.save = async (req, res) => {
  try {
    const { purchase, cart } = req.body;

    const createdPurchase = await Entity.create(purchase);
    const cartWithPurchaseID = cart.map((obj) => ({
      ...obj,
      product: obj?._id,
      purchase: createdPurchase._id,
      unitPrice: obj.price,
    }));

    const idsToDelete = cart.map(({ _id }) => _id).filter(Boolean);

    await Stocks.insertMany(cartWithPurchaseID);
    await Cart.deleteMany({ _id: { $in: idsToDelete } });

    res.status(201).json({
      success: "Purchase is successful",
      payload: createdPurchase,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { purchase, merchandises } = req.body;
    await Entity.findByIdAndUpdate(purchase._id, purchase);
    bulkWrite(req, res, Merchandises, merchandises, "Successfully Approved");
  } catch (error) {
    res.json({ error: error.message });
  }
};

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
