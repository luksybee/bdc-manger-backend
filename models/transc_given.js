const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GivenSchema = new Schema(
  {
    cashier: { type: Schema.Types.ObjectId, ref: "user" },
    g_cash: { type: Number, required: true },
    g_transfer: { type: Number, required: true },
    g_currency: { type: String },
    // g_currency: { type: Schema.Types.ObjectId, ref: "currency" },
    g_method: { type: String, enum: ["cash", "transfer", "both"] },
    g_status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    g_remarks: { type: String },
    g_from: { type: String },
    // g_from: { type: Schema.Types.ObjectId, ref: "bank_balance" },
    transaction_id: { type: Schema.Types.ObjectId, ref: "transaction" },
    confirmed_by: { type: String },
    // g_from: { type: String },
    g_acct_name: { type: String },
    g_acct_no: { type: String },
    g_bank: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("given", GivenSchema);
