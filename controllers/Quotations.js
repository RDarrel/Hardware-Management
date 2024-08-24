const Quotations = require("../models/Quotations");

exports.browse = async (req, res) => {
  try {
    const quotations = await Quotations.find()
      .populate("orders.product")
      .populate("orderBy")
      .populate("assistBy")
      .sort({ createdAt: -1 });
    res.json({ payload: quotations });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.save = async (req, res) => {
  try {
    const newSuspendTransac = await Quotations.create({
      ...req.body,
      isWalkIn: true,
    });

    const populateProduct = await Quotations.findOne({
      _id: newSuspendTransac._id,
    }).populate("orders.product");

    res.json({
      payload: populateProduct,
      success: "Successfully Sent",
    });
  } catch (error) {
    res.status(400).json({ error: handleDuplicate(error) });
  }
};

exports.destroy = (req, res) => {
  Quotations.findByIdAndDelete(req.body._id)
    .then((item) => {
      res.json({ success: "Successfuly Deleted quoatation", payload: item });
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};

exports.update = async (req, res) => {
  try {
    const notSeenQuotations = req.body; // Assuming this is an array of quotation IDs

    if (!Array.isArray(notSeenQuotations)) {
      return res.status(400).json({ error: "Input should be an array of IDs" });
    }

    const bulkOps = notSeenQuotations.map((id) => {
      return {
        updateOne: {
          filter: { _id: id },
          update: { $set: { isSeen: true } },
        },
      };
    });

    await Quotations.bulkWrite(bulkOps);

    // Kunin ang mga naupdate na dokumento
    const updatedQuotations = await Quotations.find({
      _id: { $in: notSeenQuotations },
      seen: true,
    })
      .populate("orders.product")
      .populate("orderBy")
      .populate("assistBy");

    res.status(200).json({
      message: "Quotations updated successfully",
      payload: updatedQuotations,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
