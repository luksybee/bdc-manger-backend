const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: false },
    accounts: [{ type: Schema.Types.ObjectId, ref: "account" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("customer", CustomerSchema);
