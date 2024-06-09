const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },

    invoice_no: {
      type: Number,
      required: true,
    },

    capital: {
      type: Number,
      required: true,
    },

    srp: {
      type: Number,
      required: true,
    },

    kilo: {
      type: Number,
    },

    kiloGrams: {
      type: Number,
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
  },
  {
    timestamps: true,
  }
);

const Entity = mongoose.model("SalesReport", modelSchema);

module.exports = Entity;
