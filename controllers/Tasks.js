const Entity = require("../models/Tasks"),
  handleDuplicate = require("../config/duplicate"),
  handleQuery = require("../config/query"),
  bulkWrite = require("../config/bulkWrite");

const importanceOrder = {
  High: 3,
  Medium: 2,
  Low: 1,
};

exports.browse = (req, res) =>
  Entity.find()
    .select("-__v")
    .populate({
      path: "developer",
      select: "fullName email",
    })
    .populate({
      path: "project",
      select: "-price -client -developers",
    })
    .lean()
    .then(payload =>
      res.json({
        success: "Tasks Fetched Successfully",
        payload: payload.sort(
          (a, b) =>
            importanceOrder[b.importance] - importanceOrder[a.importance]
        ),
      })
    )
    .catch(error => res.status(400).json({ error: error.message }));

exports.find = (req, res) =>
  Entity.find(handleQuery(req.query))
    .select("-__v")
    .populate({
      path: "developer",
      select: "fullName email",
    })
    .populate({
      path: "project",
      select: "-price -developers -client",
    })
    .lean()
    .then(payload =>
      res.json({
        success: "Task(s) Found Successfully",
        payload: payload.sort(
          (a, b) =>
            importanceOrder[b.importance] - importanceOrder[a.importance]
        ),
      })
    )
    .catch(error => res.status(400).json({ error: error.message }));

exports.update = (req, res) => {
  if (Array.isArray(req.body)) {
    bulkWrite(req, res, Entity, "Multiple Projects Updated Successfully");
  } else {
    Entity.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
      populate: [
        {
          path: "developer",
          select: "fullName email",
        },
        {
          path: "project",
          select: "-price -client -developers",
        },
      ],
    })
      .select("-__v")
      .then(payload => {
        if (payload) {
          res.json({
            success: "Task Updated Successfully",
            payload,
          });
        } else {
          res.status(404).json({
            error: "ID Not Found",
            message: "The provided ID does not exist.",
          });
        }
      })
      .catch(error => res.status(400).json({ error: handleDuplicate(error) }));
  }
};

exports.save = (req, res) =>
  Entity.create(req.body)
    .then(item =>
      Entity.findById(item._id)
        .select("-__v")
        .populate({
          path: "developer",
          select: "fullName email",
        })
        .populate({
          path: "project",
          select: "-price -client -developers",
        })
        .then(payload =>
          res.status(201).json({
            success: "Task Created Successfully",
            payload,
          })
        )
    )
    .catch(error => res.status(400).json({ error: handleDuplicate(error) }));
