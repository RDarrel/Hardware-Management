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

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    material: {
      type: String,
      required: true,
    },

    variations: {
      type: Array,
    },

    isPerKilo: {
      type: Boolean,
      default: false,
    },

    hasVariant: {
      type: Boolean,
      default: false,
    },

    has2Variant: {
      type: Boolean,
      default: false,
    },
    media: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Entity = mongoose.model("Products", modelSchema);

module.exports = Entity;
