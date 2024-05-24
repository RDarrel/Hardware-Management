const Users = require("../../models/Users");

exports.browse = (_, res) => {
  Users.find({ role: { $in: ["CASHIER", "STOCKMAN"] } })
    .then((employees) =>
      res.json({ success: "Successfully Employees Fetch", payload: employees })
    )
    .catch((error) => res.status(400).json({ error: error.message }));
};
