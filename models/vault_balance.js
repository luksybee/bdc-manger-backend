const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VaulbalanceSchema = new Schema(
  {
    currency: { type: String },
    balance: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("vault_balance", VaulbalanceSchema);
