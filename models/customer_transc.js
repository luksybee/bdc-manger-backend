const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    cashier: { type: Schema.Types.ObjectId, ref: "user" },
    rate: { type: Number, required: true, default: 0 },
    amount: { type: Number, default: 0 },
    amount_recieved: { type: Number, default: 0 },
    amount_given: { type: Number, default: 0 },
    amount_to_given: { type: Number, default: 0 },
    amount_to_recieve: { type: Number, default: 0 },
    amount_due: { type: Number, default: 0 },
    currency_recieved: { type: String },
    currency_given: { type: String },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    r_status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    g_status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    type: { type: String, enum: ["buy", "sell"] },
    customer: { type: String },
    phone: { type: String },
    confirmed_by: { type: String },
    // customer: { type: Schema.Types.ObjectId, ref: "customer" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("transaction", TransactionSchema);
