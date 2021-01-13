const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CurrencySchema = new Schema({
    name: { type: String, required: true, unique: true},
    selling: { type: Boolean, default: true},
    buying: { type: Boolean, default: true},
},{
    timestamps: true
});


module.exports = mongoose.model("currency", CurrencySchema);