const Transc_recieved = require("../models/transc_recieved");
const Customer_transc = require("../models/customer_transc");
const {
  addToBank,
  addToCashier,
  addToVault,
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
    
    const {cashier, r_cash, r_transfer, r_method, r_currency, _id, r_to, r_remarks } = req.body;
      // RECIEVE

      let recieved = new Transc_recieved();

      recieved.cashier = cashier;
      recieved.r_cash = r_cash;
      recieved.r_transfer = r_transfer;
      recieved.r_currency = r_currency;
      recieved.r_method = r_method;
      recieved.r_remarks = r_remarks;
      recieved.transaction_id = _id;
      recieved.r_to = r_to;
  
      if (r_method == "cash") {
        recieved.r_status = "completed"
      }
      await recieved.save();
      if (r_method == "cash" || r_method == "both") {
        // add amount to cashier balance
        await addToCashier(r_currency, r_cash);
      }
      
      console.log(_id);
      const { amount_recieved, amount_to_recieve } = await Customer_transc.findById(_id);

      console.log(amount_recieved, amount_to_recieve);
    const filter = { _id: _id };
    const update = {
      amount_recieved: parseFloat(amount_recieved) + parseFloat(r_cash) + parseFloat(r_transfer),
    };
    const opts = { new: true, upsert: true };
  
    const data = await Customer_transc.findOneAndUpdate(filter, update, opts);

    const amount_recieved1 = data.amount_recieved
    //...............
    if (amount_recieved1 == amount_to_recieve) {
      
      const filter = { _id: _id };
      const update = {
        r_status: "completed",
      };
      const opts = { new: true };
      
      doc = await Customer_transc.findOneAndUpdate(filter, update, opts);
      res.send(doc);
    }

    res.send(data)
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

    const r_transactionMethod = transc_recieved.r_method;
    // RECIEVE
    if (r_transactionMethod == "transfer") {
      addToBank(req.body.r_to, transc_recieved.r_currency, req.body.r_amount);
      transc_recieved.r_to = req.body.r_to;
      // transc_recieved.r_currency = req.body.r_currency;
      transc_recieved.r_amount = req.body.r_amount;
      transc_recieved.status = "completed";
      transc_recieved.save();
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


