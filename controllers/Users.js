const Entity = require("../models/Users"),
  handleDuplicate = require("../config/duplicate"),
  handleQuery = require("../config/query"),
  bulkWrite = require("../config/bulkWrite");

const baseUpdate = (req, res, message) =>
  Entity.findByIdAndUpdate(req.body._id, req.body, {
    new: true,
    populate: "role",
  })
    .select("-password -__v")
    .then((payload) => {
      if (payload) {
        res.json({
          success: message,
          payload,
        });
      } else {
        res.status(404).json({
          error: "ID Not Found",
          message: "The provided ID does not exist.",
        });
      }
    })
    .catch((error) => res.status(400).json({ error: handleDuplicate(error) }));

exports.browse = (req, res) =>
  Entity.find()
    .select("-password -__v")
    .populate({
      path: "role",
      select: "name power",
    })
    .sort({ createdAt: -1 })
    .lean()
    .then((payload) =>
      res.json({
        success: "Users Fetched Successfully",
        payload: payload.filter((e) => e.role.name !== "ADMINISTRATOR"),
      })
    )
    .catch((error) => res.status(400).json({ error: error.message }));

exports.find = (req, res) =>
  Entity.find(handleQuery(req.query))
    .select("-__v -password")
    .populate({
      path: "role",
      select: "name power",
    })
    .sort({ createdAt: -1 })
    .lean()
    .then((payload) =>
      res.json({
        success: "User(s) Found Successfully",
        payload,
      })
    )
    .catch((error) => res.status(400).json({ error: error.message }));

exports.update = (req, res) => {
  if (Array.isArray(req.body)) {
    bulkWrite(req, res, Entity, "Multiple Users Updated Successfully");
  } else {
    baseUpdate(req, res, "User Updated Successfully");
  }
};

exports.destroy = (req, res) => {
  if (Array.isArray(req.body)) {
    bulkWrite(req, res, Entity, "Multiple Users Banned Successfully");
  } else {
    baseUpdate(req, res, "User Banned Successfully");
  }
};

exports.save = (req, res) =>
  Entity.create(req.body)
    .then((_payload) => {
      const payload = { ..._payload._doc };
      delete payload.password;
      res.status(201).json({
        success: "User Created Successfully",
        payload,
      });
    })
    .catch((error) => res.status(400).json({ error: handleDuplicate(error) }));
