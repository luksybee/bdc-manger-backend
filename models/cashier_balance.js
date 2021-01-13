const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CashierbalanceSchema = new Schema(
  {
    currency: { type: String },
    balance: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("cashier_balance", CashierbalanceSchema);
