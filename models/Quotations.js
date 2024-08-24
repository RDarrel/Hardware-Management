const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    total: {
      type: Number,
    },
    invoice_no: {
      type: "String",
    },
    isWalkIn: {
      type: Boolean,
      default: false,
    },
    customer: {
      type: String,
    },
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    assistBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    orders: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
        },

        quantity: {
          type: Number,
        },

        variant1: {
          type: String,
        },

        variant2: {
          type: String,
        },

        kilo: {
          type: Number,
        },

        kiloGrams: {
          type: Number,
        },
        max: {
          type: Number,
        },
        srp: {
          type: Number,
        },
        subtotal: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Entity = mongoose.model("Quotations", modelSchema);

module.exports = Entity;
