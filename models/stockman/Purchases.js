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
        values: ["pending", "approved", "cancel", "reject", "received"],
        message: "{VALUE} is not supported",
      },
    },

    type: {
      type: String,
      enum: {
        values: ["request", "defective", "discrepancy", "reject", "received"],
        message: "{VALUE} is not supported",
      },
    },
    expected: { type: String },
    approved: { type: String },
    received: { type: String },
    remarks: { type: String },
    expectedDelivered: { type: String },

    total: {
      type: Number,
    },

    totalReceived: {
      type: Number,
    },

    rejectedDate: {
      type: String,
    },

    reason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Entity = mongoose.model("Purchases", modelSchema);

module.exports = Entity;
