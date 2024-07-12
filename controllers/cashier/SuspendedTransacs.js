const Entity = require("../../models/cashier/SuspendedTransacs"),
  handleDuplicate = require("../../config/duplicate");

exports.browse = (req, res) => {
  const cashier = req.query.cashier;
  Entity.find({ cashier })
    .populate("orders.product")
    .select("-__v")
    .sort({ createdAt: -1 })
    .lean()
    .then((items) =>
      res.json({
        success: "Suspended Transactions Fetched Successfully",
        payload: items,
      })
    )
    .catch((error) => res.status(400).json({ error: error.message }));
};

exports.save = async (req, res) => {
  try {
    const { invoice_no = "", cashier = "", orders = [], total = 0 } = req.body;
    // const hasExist = Entity.findOne({ invoice_no, cashier });
    // if (hasExist.invoice) {
    //   await Entity.findOneAndUpdate({ invoice_no }, { orders });
    // } else {
    await Entity.create({ invoice_no, cashier, orders, total });
    // }
    res.json({
      payload: { invoice_no, cashier, orders, total },
      success: "Successfully Suspended",
    });
  } catch (error) {
    res.status(400).json({ error: handleDuplicate(error) });
  }
};

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
      res.json({ success: "Successfuly Deleted Suspended", payload: item });
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};
