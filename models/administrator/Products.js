const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
    },
    category: {
      type: String,
      required: true,
    },
    sizes: {
      type: Array,
    },
    isPerSize: {
      type: Boolean,
      default: false,
    },

    isPerKilo: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Entity = mongoose.model("Products", modelSchema);

module.exports = Entity;
