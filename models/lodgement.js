const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LodgementSchema = new Schema(
  {
    cashier: { type: Schema.Types.ObjectId, ref: "user" },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    type: { type: String, enum: ["cashier_vault", "bank_vault", "vault_bank", "vault_cashier"] },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    confirmed_by: { type: String },
    bank: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("lodgement", LodgementSchema);
