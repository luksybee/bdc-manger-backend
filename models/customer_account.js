const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  {
    acct_name: { type: String, required: true },
    acct_no: { type: String, required: true },
    bank: { type: Schema.Types.ObjectId, ref: "bank" },
    curency: { type: Schema.Types.ObjectId, ref: "currency" },
    customer: { type: Schema.Types.ObjectId, ref: "customer" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("acount", AccountSchema);
