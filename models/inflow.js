const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InflowSchema = new Schema(
  {
    cashier: { type: Schema.Types.ObjectId, ref: "user" },
    amount: { type: Number, required: true },
    method: { type: String },
    currency: { type: String },
    recievedfrom: { type: String },
    bank: { type: String },
    sub_account: { type: String },
    remarks: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("inflow", InflowSchema);
