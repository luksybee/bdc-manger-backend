const Cashier = require("../models/cashier_balance");
const validationHandler = require("../validations/validationHandler");

// add bank
// edit bank
// get by id
// get all banks

exports.cashier = async (req, res) => {
  try {
    const pagination = req.query.pagination
      ? parseInt(req.query.pagination)
      : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const banks = await Cashier.find({})
      .skip((page - 1) * pagination)
      .limit(pagination)
      .populate("bank")
      .sort({ createdAt: -1 });

      const stringData = JSON.stringify(banks,["currency", "balance"])

    res.send(stringData);
  } catch (err) {
    next(err);
  }
};

exports.load = async (req, res) => {

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
