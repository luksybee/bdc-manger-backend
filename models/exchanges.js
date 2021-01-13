const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExchangeSchema = new Schema({
    name: { type: String, required: true},
    rate: { type: Number, required: true, default: 0 },
    active: { type: Boolean, default: true},
    type: { type: String, enum: ["buy", "sell"] },
},{
    timestamps: true
});


module.exports = mongoose.model("exchange", ExchangeSchema);