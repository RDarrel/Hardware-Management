const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    company: {
      type: String,
    },

    address: {
      type: Object,
    },

    contact: {
      type: Array,
    },

    status: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Entity = mongoose.model("Products", modelSchema);

module.exports = Entity;
