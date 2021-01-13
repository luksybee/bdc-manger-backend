const Bank_balance = require("../models/bank_balance");
const Vault_balance = require("../models/vault_balance");
const Cashier_balance = require("../models/cashier_balance");
const validationHandler = require("../validations/validationHandler");
const _ = require("lodash");

exports.create = async (req, res) => {

  const {currency,amount,acct_no,acct_name,bank_name} = req.body

  try {
    let bank_ = new Bank_balance();
    bank_.currency = currency;
    bank_.balance = amount;
    bank_.acct_name = acct_name;
    bank_.acct_no = acct_no;
    bank_.bank = bank_name;

    b = await bank_.save();
    res.send(b);
  } catch (error) {
    
  }
}

exports.accounts = async (req, res, next) => {
  try {
    const banks = await Bank_balance.find({});
    res.send(banks);
  } catch (err) {
    next(err);
  }
};

exports.grouped = async (req, res, next) => {
  try {
    const bank = req.query.bank;
    const currency = req.query.currency;
    // let banks_;

    // const array = banks_;

    // const key = "acct_name";

    // const arrayUniqueByKey = [
    //   ...new Map(array.map((item) => [item[key], item])).values(),
    // ];

    // console.log(arrayUniqueByKey);

    // if (currency == "NGN") {
    //   banks_ = await Bank_balance.find({
    //     bank: bank,
    //     currency: currency,
    //   }).select("acct_name");
    // } else {
    //   banks_ = await Bank_balance.find({
    //     bank: bank,
    //     currency: currency,
    //   });
    // }

    console.log(bank, currency);
    const banks_ = await Bank_balance.find({
      bank: bank,
      currency: currency,
    });
    const value = _.uniqBy(banks_, "acct_name");
    console.log(banks_);

    // res.send(banks_);
    // res.send(arrayUniqueByKey);
    res.send(value);
  } catch (err) {
    next(err);
  }
};
exports.bankSub = async (req, res, next) => {
  try {
    const bank = req.query.bank;
    const acct_name = req.query.acct_name;
    const currency = req.query.currency;

    let banks_ = await Bank_balance.find({
      bank: bank,
      acct_name: acct_name,
      currency: currency,
    });

    res.send(banks_);
  } catch (err) {
    next(err);
  }
};
// exports.vault = async (req, res) => {
//   try {
//     const vault = await Vault_balance.find({});
//     res.send(vault);
//   } catch (err) {
//     next(err);
//   }
// };
// exports.cashier = async (req, res, next) => {
//   try {
//     const cashier = await Cashier_balance.find({});
//     res.send(cashier);
//   } catch (err) {
//     next(err);
//   }
// };
