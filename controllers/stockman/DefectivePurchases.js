const DefectiveMerchandises = require("../../models/stockman/DefectiveMerchandises"),
  DefectivePurchases = require("../../models/stockman/DefectivePurchases");

exports.browse = async (req, res) => {
  try {
    const status = req.query.status;
    const filter =
      req.query.isAdmin === "true"
        ? { status }
        : { requestBy: req.query.requestBy, status };

    const purchases = await DefectivePurchases.find(filter)
      .populate("requestBy")
      .populate("supplier")
      .select("-__v")
      .sort({
        ...(status === "pending" ? { expected: 1 } : { expectedDelivered: 1 }),
      });
    const container = [];

    for (const element of purchases) {
      const merchandises = await DefectiveMerchandises.find({
        purchase: element._id,
      }).populate("product");

      container.push({ ...element._doc, merchandises });
    }
    res.json({ success: "Successfully fetched Purchase", payload: container });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
