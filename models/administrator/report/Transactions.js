const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    invoice_no: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    purchases: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true,
          },
          srp: {
            type: Number,
          },
          capital: {
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
          quantity: {
            type: Number,
          },
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Entity = mongoose.model("TransactionsReport", modelSchema);

module.exports = Entity;
