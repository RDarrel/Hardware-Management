const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    capital: {
      type: Number,
    },

    srp: {
      type: Number,
    },
    price: {
      type: Number,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Materials",
    },

    barcode: {
      type: String,
    },

    variations: {
      type: Array,
    },

    isPerKilo: {
      type: Boolean,
      default: false,
    },

    hasExpiration: {
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
