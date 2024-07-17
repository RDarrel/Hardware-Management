const Users = require("../../models/Users");

exports.browse = (_, res) => {
  Users.find({ role: { $in: ["CASHIER", "STOCKMAN"] } })
    .then((employees) =>
      res.json({ success: "Successfully Employees Fetch", payload: employees })
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

exports.update = (req, res) =>
  Users.findByIdAndUpdate(req.body._id, req.body, { new: true })
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
