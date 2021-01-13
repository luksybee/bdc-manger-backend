const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExpenseSchema = new Schema(
  {
    cashier: { type: Schema.Types.ObjectId, ref: "user" },
    amount: { type: Number, required: true },
    method: { type: String },
    paid_to: { type: String },
    paid_from: { type: String },
    authorized_by: { type: String },
    remarks: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("expense", ExpenseSchema);
