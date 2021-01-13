const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BankbalanceSchema = new Schema(
  {
    currency: { type: String, required: true },
    balance: { type: Number, default: 0 },
    acct_name: { type: String, required: true },
    acct_no: { type: String, required: true },
    bank: { type: String },
    // bank_id: { type: Schema.Types.ObjectId, ref: "bank" },
    // curency_id: { type: Schema.Types.ObjectId, ref: "currency" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("bank_balance", BankbalanceSchema);
