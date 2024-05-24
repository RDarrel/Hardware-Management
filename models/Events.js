const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Entity = mongoose.model("Events", modelSchema);

module.exports = Entity;
