const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    total: {
      type: Number,
    },
    invoice_no: {
      type: "String",
    },
    type: {
      type: String,
    },
    customer: {
      type: String,
    },
    assistBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    orders: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
        },

        quantity: {
          type: Number,
        },

        variant1: {
          type: String,
        },

        variant2: {
          type: String,
        },

        kilo: {
          type: Number,
        },

        kiloGrams: {
          type: Number,
        },
        max: {
          type: Number,
        },
        srp: {
          type: Number,
        },
        subtotal: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Entity = mongoose.model("SuspendedTransacs", modelSchema);

module.exports = Entity;
