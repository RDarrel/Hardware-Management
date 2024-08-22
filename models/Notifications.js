const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    type: "",
  },
  {
    timestamps: true,
  }
);

const Entity = mongoose.model("Notifications", modelSchema);

module.exports = Entity;
