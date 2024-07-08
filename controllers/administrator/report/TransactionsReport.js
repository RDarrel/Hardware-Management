const Entity = require("../../../models/administrator/report/Transactions"),
  Transactions = require("../../../models/administrator/report/Transactions"),
  Return_Refund = require("../../../models/administrator/ReturnRefund"),
  handleDuplicate = require("../../../config/duplicate");

exports.browse = (_, res) =>
  Entity.find()
    .populate("purchases.product")
    .populate("cashier")
    .select("-__v")
    .sort({ createdAt: -1 })
    .lean()
    .then((items) =>
      res.json({
        success: "Transactions Fetched Successfully",
        payload: items,
      })
    )
    .catch((error) => res.status(400).json({ error: error.message }));

exports.return_refund = (req, res) => {
  const { cashier, status } = req.query || {};
  const populate =
    status === "transactions" ? "purchases.product" : "products.product";
  const baseEntity = status === "transactions" ? Transactions : Return_Refund;
  baseEntity
    .find({ status, cashier })
    .populate(populate)

    .populate("cashier")
    .select("-__v")
    .sort({ createdAt: -1 })
    .lean()
    .then((items) =>
      res.json({
        success: "Return/Refund Fetched Successfully",
        payload: items.map((item) => ({
          ...item,
          ...(status === "transactions" ? { products: item.purchases } : {}),
        })),
      })
    )
    .catch((error) => res.status(400).json({ error: error.message }));
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
