const Entity = require("../../models/administrator/Supplier"),
  handleDuplicate = require("../../config/duplicate");

exports.browse = (req, res) => {
  const status = req.query.status;
  const query = status ? { status: status === "true" ? true : false } : {};
  Entity.find(query)
    .select("-__v")
    .sort({ createdAt: -1 })
    .lean()
    .then((items) =>
      res.json({
        success: "Suppliers Fetched Successfully",
        payload: items.filter((item) => item.name !== "ADMINISTRATOR"),
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
