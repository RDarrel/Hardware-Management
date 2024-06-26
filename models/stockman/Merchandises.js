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
    expiration: { type: String },
    variant1: {
      type: String,
    },
    variant2: {
      type: String,
    },

    capital: {
      type: Number,
    },

    quantity: {
      type: Object,
    },

    kilo: {
      type: Object,
    },

    kiloGrams: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const Entity = mongoose.model("Merchandises", modelSchema);

module.exports = Entity;
