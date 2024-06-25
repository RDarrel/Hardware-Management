const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    expiration: { type: String },

    variant1: {
      type: String,
    },
    variant2: {
      type: String,
    },

    kiloStock: {
      type: Number,
    },

    quantityStock: {
      type: Number,
    },

    capital: {
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
