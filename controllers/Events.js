const Entity = require("../models/Events"),
  handleQuery = require("../config/query"),
  bulkWrite = require("../config/bulkWrite");

exports.browse = (req, res) =>
  Entity.find()
    .select("-__v")
    .populate({
      path: "by",
      select: "fullName email",
    })
    .sort({ createdAt: -1 })
    .lean()
    .then(payload =>
      res.json({
        success: "Events Fetched Successfully",
        payload,
      })
    )
    .catch(error => res.status(400).json({ error: error.message }));

exports.find = (req, res) =>
  Entity.find(handleQuery(req.query))
    .select("-__v")
    .populate({
      path: "by",
      select: "fullName email",
    })
    .sort({ createdAt: -1 })
    .lean()
    .then(payload =>
      res.json({
        success: "Event(s) Found Successfully",
        payload,
      })
    )
    .catch(error => res.status(400).json({ error: error.message }));

exports.update = (req, res) =>
  Entity.findByIdAndUpdate(req.body._id, req.body, {
    new: true,
    populate: [
      {
        path: "by",
        select: "fullName email",
      },
    ],
  })
    .select("-__v")
    .then(payload => {
      if (payload) {
        res.json({
          success: "Event Updated Successfully",
          payload,
        });
      } else {
        res.status(404).json({
          error: "ID Not Found",
          message: "The provided ID does not exist.",
        });
      }
    })
    .catch(error => res.status(400).json({ error: error.message }));

exports.save = (req, res) =>
  Entity.create(req.body)
    .then(item =>
      Entity.findById(item._id)
        .select("-__v")
        .populate({
          path: "by",
          select: "fullName email",
        })
        .then(payload =>
          res.status(201).json({
            success: "Event Created Successfully",
            payload,
          })
        )
    )
    .catch(error => res.status(400).json({ error: error.message }));

exports.destroy = (req, res) => {
  if (Array.isArray(req.body)) {
    bulkWrite(
      req,
      res,
      Entity,
      "Multiple Events Deleted Successfully",
      "deleteOne"
    );
  } else {
    Entity.findByIdAndDelete(req.body._id)
      .select("-__v")
      .then(payload => {
        if (payload) {
          res.json({
            success: "Event Deleted Successfully",
            payload,
          });
        } else {
          res.status(404).json({
            error: "ID Not Found",
            message: "The provided ID does not exist.",
          });
        }
      })
      .catch(error => res.status(400).json({ error: error.message }));
  }
};
