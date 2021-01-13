const Transc_given = require("../models/transc_given");
const Customer_transc = require("../models/customer_transc");
const { deductFromBank, deductFromCashier } = require("../utils");
const validationHandler = require("../validations/validationHandler");

exports.index = async (req, res) => {
  try {
    const pagination = req.query.pagination
      ? parseInt(req.query.pagination)
      : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const transc_givens = await Transc_given.find({
    })
      .skip((page - 1) * pagination)
      .limit(pagination)
      .populate("transc_given")
      .sort({ createdAt: -1 });
    res.send(transc_givens);
  } catch (err) {
    next(err);
  }
};

exports.show = async (req, res) => {
  try {
    const transc_given = await Transc_given.findOne({
      _id: req.params.id,
    }).populate("transc_given");

    res.send(transc_given);
  } catch (err) {
    next(err);
  }
};

exports.store = async (req, res, next) => {
  console.log("give");
  try {
    validationHandler(req);
    
    const {cashier, g_cash, g_transfer, g_method, g_currency, _id, g_from, g_bank,g_acct_name,g_acct_no, g_remarks } = req.body;
      // GIVE

      let given = new Transc_given();

 
      given.cashier = cashier;
      given.g_cash = g_cash;
      given.g_transfer = g_transfer;
      given.g_currency = g_currency;
      given.g_method = g_method;
      given.g_remarks = g_remarks;
      given.transaction_id = _id;

      given.g_from = g_from;

    
      given.g_bank = g_bank;
      given.g_acct_name = g_acct_name;
      given.g_acct_no = g_acct_no;


      if (g_method == "cash") {
        given.status = "completed"
      }
      
      given = await given.save();
      //.................................................................

      if (g_method == "cash" || "both") {
        await deductFromCashier(g_currency, g_cash);

      }
      
      let { amount_given, amount_to_given } = await Customer_transc.findById(_id);

      const given = amount_given + g_cash + g_transfer;
    const filter = { _id: _id };
    const update = {
      amount_given: given,
    };
    const opts = { new: true, upsert: true };
  
    const data = await Customer_transc.findOneAndUpdate(filter, update, opts);

    const amountGiven = data.amount_given
    //...............
    if (amountGiven == amount_to_given) {
      
      const filter = { _id: _id };
      const update = {
        g_status: "completed",
      };
      const opts = { new: true };
      
      doc = await Customer_transc.findOneAndUpdate(filter, update, opts);
      res.send(doc)
    }

    res.send(data);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    validationHandler(req);

    let transc_given = await Transc_given.findOne({
      transaction_id: req.body.transaction_id,
    });

    const g_transactionMethod = transc_given.g_method;

    // GIVE
    if (g_transactionMethod == "transfer") {
      deductFromBank(req.body.g_from, transc_given.g_currency, req.body.g_amount);
      transc_given.g_from = req.body.g_from;
      // transc_given.g_currency = req.body.g_currency;
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
    let transc_given = await Transc_given.findById(req.params.id);
    
    await transc_given.delete();

    res.send({ message: "success" });
  } catch (err) {
    next(err);
  }
};