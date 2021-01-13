const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BankSchema = new Schema({
    name: { type: String,
        required: true,
        index: {
          unique: true,
          collation: { locale: 'en', strength: 2 }
        }
    }
},{
    timestamps: true
});


module.exports = mongoose.model("bank", BankSchema);