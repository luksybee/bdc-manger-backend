const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OutflowSchema = new Schema(
  {
    cashier: { type: Schema.Types.ObjectId, ref: "user" },
    amount: { type: Number, required: true },
    method: { type: String },
    currency: { type: String },
    paid_from: { type: String },
    acct_name: { type: String },
    acct_no: { type: String },
    bank: { type: String },
    remarks: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("outflow", OutflowSchema);
