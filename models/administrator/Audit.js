const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    invoice_no: {
      type: String,
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    action: {
      type: String,
    },

    amount: {
      type: Number,
    },

    description: {
      type: String,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Entity = mongoose.model("Audit", modelSchema);

module.exports = Entity;
