const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    company: {
      type: String,
    },

    location: {
      type: Object,
    },

    contact: {
      type: String,
    },

    status: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Entity = mongoose.model("Suppliers", modelSchema);

module.exports = Entity;
