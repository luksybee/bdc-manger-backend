const Vault = require("../models/vault_balance");
const { addToVault } = require("../utils");
const validationHandler = require("../validations/validationHandler");

exports.vaults = async (req, res) => {
  try {
    const pagination = req.query.pagination
      ? parseInt(req.query.pagination)
      : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const banks = await Vault.find({})
      .skip((page - 1) * pagination)
      .limit(pagination)
      .populate("bank")
      .sort({ createdAt: -1 });
    res.send(banks);
  } catch (err) {
    next(err);
  }
};

exports.load = async (req, res, next) => {

  const {currency, amount} = req.body;
  // try {
  //   const existingCurrency = await Vault.findOne({currency});
  //   console.log(existingCurrency);
  //   if (existingCurrency) {
  //     const filter = { _id: existingCurrency._id };
  //     const update = {
  //       balance: existingCurrency.balance + amount,
  //     };
  //     const opts = { new: true, upsert: true };
    
  //     const data = await Vault.findOneAndUpdate(filter, update, opts);

  //     res.send(data)
  //   }else{

  //     let vault_ = new Vault();
  //     vault_.currency = req.body.currency;
  //     vault_.balance = req.body.amount;
  //     v = await vault_.save();
  //     res.send(v);
  //   }
  // } catch (error) {
  //   next(err)
  // }

  const data = await addToVault(currency, amount)
  console.log(data);
  res.send(data)
}

exports.confirm = async (req, res) => {
  
}

exports.show = async (req, res) => {
  try {
    const bank = await Bank.findOne({ name: req.params.id });
    res.send(bank);
  } catch (err) {
    next(err);
  }
};

exports.store = async (req, res, next) => {
  try {
    validationHandler(req);

    let bank = new Bank();
    bank.name = req.body.name;
    bank = await bank.save();

    res.send(bank);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    validationHandler(req);

    let bank = await Bank.findById(req.params.id);
    // Check if bank

    bank = await bank.save();

    res.send(bank);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    let bank = await Post.findById(req.params.id);

    await bank.delete();

    res.send({ message: "success" });
  } catch (err) {
    next(err);
  }
};
