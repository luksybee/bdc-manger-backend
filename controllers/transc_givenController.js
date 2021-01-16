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
      // given.g_method = g_method;
      given.g_remarks = g_remarks;
      given.transaction_id = _id;

      given.g_from = g_from;

    
      given.g_bank = g_bank;
      given.g_acct_name = g_acct_name;
      given.g_acct_no = g_acct_no;


      let method = ""
      if (g_transfer > 0) {
        method = "both"
        given.g_method = method;

      }else{
        method = "cash" 
        given.g_method = method;
        given.g_status = "completed"
      }

      // if (g_method == "cash") {
      //   given.status = "completed"
      // }
      
      given = await given.save();
      //.................................................................

      let { amount_given, amount_to_given,currency_given } = await Customer_transc.findById(_id);
      if (method == "cash" || "both") {
        await deductFromCashier(currency_given, g_cash);

      }
      console.log("Given amount",amount_given);

      const given_ = parseFloat(amount_given) + parseFloat(g_cash) + parseFloat(g_transfer);

      console.log("Given Total",given_);
    const filter = { _id: _id };
    const update = {
      amount_given: given_,
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

    const {g_from, _id} = req.body;
    
    let transc_given = await Transc_given.findById(_id);

    const {transaction_id, g_transfer, g_method} = transc_given;

    const {currency_given, } = await Customer_transc.findById(transaction_id)

    // GIVE
    if (g_method == "transfer" || "both") {
      deductFromBank(g_from, currency_given, g_transfer);
    }

    // transc_given.g_from = req.body.g_from;
    // transc_given.g_currency = req.body.g_currency;
    // transc_given.g_amount = req.body.g_amount;
    transc_given.g_status = "completed";
    transc_given.save();
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