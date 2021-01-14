const Lodgement = require("../models/lodgement");

const {
  addToBank,
  addToCashier,
  addToVault,
  deductFromBank,
  deductFromCashier,
  deductFromVault,
} = require("../utils");
const validationHandler = require("../validations/validationHandler");

exports.lodgement = async (req, res, next) => {
  try {
    const {cashier,amount,currency,type, bank} = req.body
    let lodgement = new Lodgement();
    lodgement.cashier = cashier;
    lodgement.amount = amount;
    lodgement.currency = currency;
    lodgement.type = type;
    lodgement.bank = bank;

    lodge = await lodgement.save();

    //.......................
    if (type == "cashier_vault") {
      const result = await deductFromCashier(currency, amount);
      // res.send(result);
      console.log(result);
    }
    if (type == "bank_vault") {
      deductFromBank(bank, currency, amount);
      // res.send("data");
    }
    if (type == "vault_bank") {
      deductFromVault(currency, amount);
      // res.send("data");
    }
    if (type == "vault_cashier") {
      deductFromVault(currency, amount);
      // res.send("data");
    }
    //.............................
    res.send(lodge);
  } catch (error) {
    next(error);
  }
};
exports.pending = async (req, res, next) => {
  try {
    const pagination = req.query.pagination
      ? parseInt(req.query.pagination)
      : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const pending = await Lodgement.find({
      status: "pending",
    })
      .skip((page - 1) * pagination)
      .limit(pagination)
      .sort({ createdAt: -1 });
    res.send(pending);
  } catch (err) {
    next(err);
  }
};

exports.lodgementUpdate = async (req, res, next) => {
  try {
    const lodgement = await Lodgement.findOne({ _id: req.params.id });

    const {type,currency,bank,amount} = lodgement

    if (type == "cashier_vault") {
      addToVault(currency, Number(amount));
      lodgement.status = "completed";
      // lodgement.confirmed_by = req.user
      lodgement.save();
      res.send("Success");
    }
    if (type == "bank_vault") {
      addToVault(currency, Number(amount));
      lodgement.status = "completed";

      lodgement.save();
      res.send("data");
    }
    if (type == "vault_bank") {
      addToBank(bank, currency, Number(amount));
      lodgement.status = "completed";

      lodgement.save();
      res.send("data");
    }
    if (type == "vault_cashier") {
       addToCashier(currency, Number(amount));
      lodgement.status = "completed";

      lodgement.save();
      res.send("data");
    }
  } catch (error) {
    next(error);
  }
};

exports.show = async (req, res) => {
  try {
    const pagination = req.query.pagination
      ? parseInt(req.query.pagination)
      : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const banks = await Lodgement.find({})
      .skip((page - 1) * pagination)
      .limit(pagination)
      .populate("user")
      .sort({ createdAt: -1 });

    const stringData = JSON.stringify(banks,["_id", "currency", "amount", "type", "status"])
    res.send(stringData);
  } catch (err) {
    next(err);
  }
};

exports.fetchById = async (req, res, next) => {
  try {
    const customer_transc = await Lodgement.findOne({
      _id: req.params.id,
    }).populate("user");

    res.send(customer_transc);
  } catch (err) {
    next(err);
  }
}