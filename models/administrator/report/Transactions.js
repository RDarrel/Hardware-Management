const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    invoice_no: {
      type: String,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    totalDue: {
      type: Number,
      required: true,
    },

    totalDiscount: {
      type: Number,
    },

    cash: {
      type: Number,
      required: true,
    },

    totalWithoutDeduc: {
      type: Number,
    },

    customer: {
      type: String,
    },

    returnItemCount: {
      type: Number,
      default: 0,
    },

    refundItemCount: {
      type: Number,
      default: 0,
    },

    totalRefundSales: {
      type: Number,
      default: 0,
    },

    totalReturnSales: {
      type: Number,
      default: 0,
    },

    isExist: {
      type: Boolean,
      default: true,
    },

    purchases: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true,
          },

          isRefundAll: {
            type: Boolean,
            default: false,
          },

          kiloRefund: {
            type: Number,
            default: 0,
          },

          kiloGramsRefund: {
            type: Number,
            default: 0,
          },

          quantityRefund: {
            type: Number,
            default: 0,
          },
          quantityReturn: {
            type: Number,
            default: 0,
          },
          kiloReturn: {
            type: Number,
            default: 0,
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
