const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Suppliers",
    },

    requestBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "cancel", "denied", "received"],
        message: "{VALUE} is not supported",
      },
    },
    expected: { type: String },
    approved: { type: String },
    received: { type: String },
    remarks: { type: String },
    total: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Entity = mongoose.model("Purchases", modelSchema);

module.exports = Entity;
