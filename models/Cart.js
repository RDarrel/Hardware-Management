const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    cartBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
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

const Entity = mongoose.model("Cart", modelSchema);

module.exports = Entity;
