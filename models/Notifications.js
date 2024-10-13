const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    forStockman: {
      type: Boolean,
      default: false,
    },
    type: "",
    isSeen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Entity = mongoose.model("Notifications", modelSchema);

module.exports = Entity;
