const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },

    removeBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    expirationDate: { type: Date },
    removeDate: { type: Date },

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
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Entity = mongoose.model("ExpiredProducts", modelSchema);

module.exports = Entity;
