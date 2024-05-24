const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      trim: true,
    },
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
      required: true,
    },
    importance: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    intensity: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Entity = mongoose.model("Tasks", modelSchema);

module.exports = Entity;
