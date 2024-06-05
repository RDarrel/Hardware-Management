const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    purchase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchases",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },

    variant1: {
      type: String,
    },
    variant2: {
      type: String,
    },

    unitPrice: {
      type: Number,
    },

    quantity: {
      type: Number,
    },

    kilo: {
      type: Number,
    },

    kiloGrams: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Entity = mongoose.model("Stocks", modelSchema);

module.exports = Entity;
