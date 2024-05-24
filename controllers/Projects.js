const Entity = require("../models/Projects"),
  handleDuplicate = require("../config/duplicate"),
  handleQuery = require("../config/query");

exports.browse = (req, res) =>
  Entity.find()
    .select("-__v")
    .populate({
      path: "client",
      select: "fullName email",
    })
    .populate({
      path: "developers",
      select: "fullName email",
    })
    .sort({ createdAt: -1 })
    .lean()
    .then(payload =>
      res.json({
        success: "Projects Fetched Successfully",
        payload,
      })
    )
    .catch(error => res.status(400).json({ error: error.message }));

exports.find = (req, res) =>
  Entity.find(handleQuery(req.query))
    .select("-__v")
    .populate({
      path: "client",
      select: "fullName email",
    })
    .populate({
      path: "developers",
      select: "fullName email",
    })
    .sort({ createdAt: -1 })
    .lean()
    .then(payload =>
      res.json({
        success: "Project(s) Found Successfully",
        payload,
      })
    )
    .catch(error => res.status(400).json({ error: error.message }));

exports.update = (req, res) =>
  Entity.findByIdAndUpdate(req.body._id, req.body, {
    new: true,
    populate: [
      {
        path: "client",
        select: "fullName email",
      },
      {
        path: "developers",
        select: "fullName email",
      },
    ],
  })
    .select("-__v")
    .then(payload => {
      if (payload) {
        res.json({
          success: "Project Updated Successfully",
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

exports.save = (req, res) =>
  Entity.create(req.body)
    .then(item =>
      Entity.findById(item._id)
        .select("-__v")
        .populate({
          path: "client",
          select: "fullName email",
        })
        .populate({
          path: "developers",
          select: "fullName email",
        })
        .then(payload =>
          res.status(201).json({
            success: "Project Created Successfully",
            payload,
          })
        )
    )
    .catch(error => res.status(400).json({ error: handleDuplicate(error) }));
