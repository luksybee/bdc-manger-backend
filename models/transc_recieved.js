const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RecievedSchema = new Schema(
  {
    cashier: { type: Schema.Types.ObjectId, ref: "user" },
    r_cash: { type: Number, required: true, default: 0 },
    r_transfer: { type: Number, required: true, default: 0 },
    r_currency: { type: String },
    // r_currency: { type: Schema.Types.ObjectId, ref: "currency" },
    r_method: { type: String, enum: ["cash", "transfer", "both"] },
    r_status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    r_remarks: { type: String },
    r_to: { type: String },
    // r_to: { type: Schema.Types.ObjectId, ref: "bank_balance" },
    transaction_id: { type: Schema.Types.ObjectId, ref: "transaction" },
    confirmed_by: { type: String },
    // r_to: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("recieved", RecievedSchema);
