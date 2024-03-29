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
      // recieved.r_method = r_method;
      recieved.r_remarks = r_remarks;
      recieved.transaction_id = _id;
      recieved.r_to = r_to;
  
      let method = ""
      if (r_transfer > 0) {
        method = "both"
        recieved.r_method = method;

      }else{
        method = "cash" 
        recieved.r_method = method;
        recieved.r_status = "completed"
      }
 
      await recieved.save();

      const { amount_to_recieve, currency_recieved } = await Customer_transc.findById(_id);
      if (method == "cash" || method == "both") {
        // add amount to cashier balance
        await addToCashier(currency_recieved, r_cash);
      }
      
    const val = parseFloat(r_cash) + parseFloat(r_transfer);    
   
    if (val == amount_to_recieve) {  
      await Customer_transc.update({_id: _id },{$inc: {amount_recieved : val},r_status:"completed"})
    }else{
      await Customer_transc.update({_id: _id },{$inc: {amount_recieved : val}})
    }

    res.send("ok")
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    validationHandler(req);

    const { _id,r_to } = req.body

    let transc_recieved = await Transc_recieved.findById(_id)

    const {transaction_id, r_transfer, r_method} = transc_recieved;

    const {currency_recieved } = await Customer_transc.findById(transaction_id)

    // RECIEVE
    if (r_method == "transfer" || "both") {
      addToBank(r_to, currency_recieved, r_transfer);
      // transc_recieved.r_to = r_to;
      // transc_recieved.r_currency = req.body.r_currency;
      // transc_recieved.r_amount = r_amount;
      transc_recieved.r_status = "completed";
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


