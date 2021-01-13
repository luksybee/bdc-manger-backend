const Customer_account = require("../models/customer_account");
const Customer = require("../models/customer");
const validationHandler = require("../validations/validationHandler");

exports.index = async (req, res) => {
  try {
    const pagination = req.query.pagination
      ? parseInt(req.query.pagination)
      : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const customer_accounts = await Customer_account.find({})
      .skip((page - 1) * pagination)
      .limit(pagination)
      .populate("customer_account")
      .sort({ createdAt: -1 });
    res.send(customer_accounts);
  } catch (err) {
    next(err);
  }
};

exports.show = async (req, res) => {
  try {
    const customer_account = await Customer_account.findOne({
      _id: req.params.id,
    })
      .populate("curency", "name")
      .populate("customer", "name phone");

    res.send(customer_account);
  } catch (err) {
    next(err);
  }
};

exports.store = async (req, res, next) => {
  try {
    validationHandler(req);

    let customer_accounts = new Customer_account();

    customer_accounts.acct_name = req.body.acct_name;
    customer_accounts.acct_no = req.body.acct_no;
    customer_accounts.bank = req.body.bank;
    customer_accounts.curency = req.body.curency;
    customer_accounts.customer = req.body.customer;

    customer_accounts = await customer_accounts.save();

    res.send(customer_accounts);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    validationHandler(req);

    let customer_accounts = await Customer_account.findById(req.params.id);

    customer_accounts = await customer_accounts.save();

    res.send(customer_accounts);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    let customer_accounts = await Customer_account.findById(req.params.id);

    await customer_accounts.delete();

    res.send({ message: "success" });
  } catch (err) {
    next(err);
  }
};
