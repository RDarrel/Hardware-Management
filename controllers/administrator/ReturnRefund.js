const ReturnRefund = require("../../models/administrator/ReturnRefund");

exports.browse = (_, res) => {
  ReturnRefund.find()
    .populate("returnBy")
    .populate("refundBy")
    .populate("products.product")
    .sort({ createAt: -1 })
    .then((returnRefund) =>
      res.json({
        success: "Successfully Return/Refund Fetch",
        payload: returnRefund,
      })
    )
    .catch((error) => res.status(400).json({ error: error.message }));
};
exports.save = (req, res) =>
  Users.create(req.body)
    .then((_payload) => {
      const payload = { ..._payload._doc };
      delete payload.password;
      res.status(201).json({
        success: "Employee Created Successfully",
        payload,
      });
    })
    .catch((error) => res.status(400).json({ error: handleDuplicate(error) }));
