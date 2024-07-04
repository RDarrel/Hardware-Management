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
        values: ["defective", "return", "received", "refund", "dispose"],
        message: "{VALUE} is not supported",
      },
    },
    received: { type: String },
    remarks: { type: String },
    expectedDelivered: { type: String },
    total: {
      type: Number,
    },

    totalReceived: {
      type: Number,
    },

    reason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Entity = mongoose.model("DefectivePurchases", modelSchema);

module.exports = Entity;
