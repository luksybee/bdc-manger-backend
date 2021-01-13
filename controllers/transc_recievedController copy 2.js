const Transc_recieved = require("../models/transc_recieved");
const Transc_given = require("../models/transc_given");
const Customer_transc = require("../models/customer_transc");

const Cashier_balance = require("../models/cashier_balance");
const {
  addToBank,
  addToCashier,
  deductFromBank,
  deductFromCashier,
} = require("../utils");
const validationHandler = require("../validations/validationHandler");

exports.index = async (req, res) => {
  try {
    const pagination = req.query.pagination
      ? parseInt(req.query.pagination)
      : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const transc_recieved = await Transc_recieved.find({})
      .skip((page - 1) * pagination)
      .limit(pagination)
      .populate("transc_recieved")
      .sort({ createdAt: -1 });
    res.send(transc_recieved);
  } catch (err) {
    next(err);
  }
};

exports.show = async (req, res) => {
  try {
    const transc_recieved = await Transc_recieved.findOne({
      _id: req.params.id,
    }).populate("transc_recieved");

    res.send(transc_recieved);
  } catch (err) {
    next(err);
  }
};

exports.store = async (req, res, next) => {
  try {
    validationHandler(req);

    const r_transactionMethod = req.body.r_method;
    const g_transactionMethod = req.body.g_method;

    recordTransaction(req);
    // RECIEVE
    if (r_transactionMethod == "cash" || r_transactionMethod == "both") {
      // add amount to cashier balance
      addToCashier(req.body.r_currency, req.body.r_cash);
      updateCashRecieveTransaction(req);
    }

    // GIVE
    if (g_transactionMethod == "cash" || g_transactionMethod == "both") {
      // deduct amount from cashier balance
      deductFromCashier(req.body.g_currency, req.body.g_cash);
      updateCashGiveTransaction(req);
    }

    res.send("successful");
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    validationHandler(req);

    let transc_recieved = await Transc_recieved.findOne({
      transaction_id: req.body.transaction_id,
    });

    let transc_given = await Transc_given.findOne({
      transaction_id: req.body.transaction_id,
    });

    const r_transactionMethod = transc_recieved.r_method;
    const g_transactionMethod = transc_given.g_method;

    // RECIEVE
    if (r_transactionMethod == "transfer") {
      addToBank(req.body.r_to, req.body.r_currency, req.body.r_amount);
      updateTransferRecieveTransaction(req);
      transc_recieved.r_to = req.body.r_to;
      transc_recieved.r_currency = req.body.r_currency;
      transc_recieved.r_amount = req.body.r_amount;
      transc_recieved.status = "completed";
      transc_recieved.save();
    }

    // GIVE
    if (g_transactionMethod == "transfer") {
      deductFromBank(req.body.g_from, req.body.g_currency, req.body.g_amount);
      updateTransferGiveTransaction(req);
      transc_given.g_from = req.body.g_from;
      transc_given.g_currency = req.body.g_currency;
      transc_given.g_amount = req.body.g_amount;
      transc_given.status = "completed";
      transc_given.save();
    }

    res.send("Success");
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    let transc_recieved = await Transc_recieved.findById(req.params.id);

    await transc_recieved.delete();

    res.send({ message: "success" });
  } catch (err) {
    next(err);
  }
};

async function updateTransferRecieveTransaction(req) {
  const filter = { transaction_id: req.body.transaction_id };
  const update = {
    amount_recieved: amount_recieved + req.body.r_transfer,
    amount_due: amount_due - req.body.r_amount,
  };
  const opts = { new: true, upsert: true };

  let doc = await Customer_transc.findOneAndUpdate(filter, update, opts);
}
async function updateTransferGiveTransaction(req) {
  const filter = { transaction_id: req.body.transaction_id };
  const update = {
    amount_given: amount_given + req.body.g_transfer,
    amount_due: amount_due - req.body.g_transfer,
  };
  const opts = { new: true, upsert: true };

  let doc = await Customer_transc.findOneAndUpdate(filter, update, opts);
}
async function updateCashRecieveTransaction(req) {
  // let transcaction = await Customer_transc.findOne({
  //   id: req.body.transaction_id,
  // });
  let transcaction = await Customer_transc.findById(req.body.transaction_id);

  let amount_recieved = 0;
  let status = transcaction.r_status;

  const amt = transcaction.amount_recieved;
  const amt1 = req.body.r_cash;
  const t = amt + amt1;
  // transcaction.amount_due = "";
  if (t == transcaction.amount) {
    amount_recieved = transcaction.amount_recieved + req.body.r_cash;

    status = "completed";

    // transcaction.save();
  } else {
    amount_recieved = transcaction.amount_recieved + req.body.r_cash;
  }
  
  cust_trans = await Customer_transc.findByIdAndUpdate(req.body.transaction_id);
  cust_trans.r_status = status;
  cust_trans.amount_recieved = amount_recieved;

  cust_trans.save();
  // transcaction.curency_recieved = req.body.r_currency;
  // transcaction.confirmed_by = req.body.cashier;
}

async function updateCashGiveTransaction(req) {
  let transcaction = await Customer_transc.findById(req.body.transaction_id);
  let amount_due = 0;
  let amount_given = 0;
  let status = transcaction.g_status;

  console.log(status);

  const amt = transcaction.amount_due;
  const amt1 = req.body.g_cash;
  const t = amt - amt1;

  if (t == 0) {
    amount_due = transcaction.amount_due -= req.body.g_cash;

    status = "completed";

    amount_given = transcaction.amount_given += req.body.g_cash;
  } else {
    amount_given = transcaction.amount_given += req.body.g_cash;
    amount_due = transcaction.amount_due -= req.body.g_cash;
  }
 
  cust_trans = await Customer_transc.findByIdAndUpdate(req.body.transaction_id);
  cust_trans.g_status = status;
  cust_trans.amount_given = amount_given;
  cust_trans.amount_due = amount_due;

  cust_trans.save();
  // transcaction.status = "";
  // transcaction.confirmed_by = req.body.cashier;
}

async function recordTransaction(req) {
  let transcaction = await Customer_transc.findOneAndUpdate({
    transaction_id: req.body.transaction_id,
  });
  let recieved = new Transc_recieved();
  let given = new Transc_given();

  if (
    req.body.r_method == "cash" &&
    transcaction.amount_to_recieve == req.body.r_cash
  ) {
    recieved.r_status = "completed";
  }
  if (
    req.body.g_method == "cash" &&
    transcaction.amount_to_give == req.body.g_cash
  ) {
    given.g_status = "completed";
  }

  recieved.cashier = req.body.cashier;
  recieved.r_cash = req.body.r_cash;
  recieved.r_transfer = req.body.r_transfer;
  recieved.r_currency = transcaction.currency_recieved;
  recieved.r_method = req.body.r_method;
  recieved.r_remarks = req.body.r_remarks;
  recieved.transaction_id = req.body.transaction_id;

  given.cashier = req.body.cashier;
  given.g_cash = req.body.g_cash;
  given.g_transfer = req.body.g_transfer;
  given.g_currency = transcaction.currency_given;
  given.g_method = req.body.g_method;
  given.g_remarks = req.body.g_remarks;
  given.transaction_id = req.body.transaction_id;

  recieved.r_to = req.body.r_to;
  given.g_from = req.body.g_from;

  // recieved.r_to = req.body.r_to;
  // recieved.r_acct_name = req.body.r_acct_name;
  // recieved.r_bank = req.body.r_bank;
  // given.g_from = req.body.g_from;
  given.g_bank = req.body.g_bank;
  given.g_acct_name = req.body.g_acct_name;
  given.g_acct_no = req.body.g_acct_no;

  // transcaction.rate = req.body.rate;

  // transc = await transcaction.save();
  recieved = await recieved.save();
  given = await given.save();
}
