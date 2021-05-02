const Customer_transc = require("../models/customer_transc");
const Recieved = require("../models/transc_recieved");
const Given = require("../models/transc_given");
const validationHandler = require("../validations/validationHandler");
const bank_balance = require("../models/bank_balance");

exports.all = async (req, res, next) => {
  try {
    const pagination = req.query.pagination
      ? parseInt(req.query.pagination)
      : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const customer_transcs = await Customer_transc.find({})
      .skip((page - 1) * pagination)
      .limit(pagination)
      .populate("cashier")
      .sort({ createdAt: -1 });

      const stringData = JSON.stringify(customer_transcs,["_id","customer", "type", "rate", "amount","currency_recieved", "amount_recieved","r_status","currency_given", "amount_given","g_status"])

    res.send(stringData);
  } catch (err) {
    next(err);
  }
};
exports.pendingRecieve = async (req, res) => {
  try {
    const pagination = req.query.pagination
      ? parseInt(req.query.pagination)
      : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const customer_transcs = await Recieved.find({
      r_status: "pending",
    })
      .skip((page - 1) * pagination)
      .limit(pagination)
      .populate("user")
      .sort({ createdAt: -1 });

      const stringData = JSON.stringify(customer_transcs,["_id", "r_transfer", "r_status","createdAt"])

    res.send(stringData);
  } catch (err) {
    next(err);
  }
};

exports.receivable = async (req, res, next) => {
  try {
    
    const customer_transcs = await Given.aggregate(
      [
        {
          $match:{
            g_status: "pending"
          },
        },
        {
          $group:
            {
              _id: { type:"$g_method", status: "$g_status"},
              cash: { $sum: "$g_cash"}, 
              transfer: {$sum: "$g_transfer" },
              count: { $sum: 1 }
            }
        }
      ]
   )
      .sort({ createdAt: -1 });

      // const stringData = JSON.stringify(customer_transcs,["_id", "r_transfer", "r_status","createdAt"])

      // const customer_transcs = await bank_balance.aggregate(
      //   [
      //     {
      //       $group:{
      //         _id: {currency: "$currency", bank: "$bank"},
      //         total: {$sum: "$balance"}
      //       }
      //     }
      //   ]
      // )
      // const customer_transcs = await bank_balance.distinct("bank")
      res.status(200).json({
        message: "Receivable retrieved",
        data:customer_transcs
      } )
      } catch (err) {
    next(err);
  }
};

exports.payable = async (req, res) => {
  try {
    
    const customer_transcs = await Recieved.aggregate(
      [
        {
          $match:{
            r_status: "pending"
          },
        },
        {
          $group:
            {
              _id: { type:"$r_method", status: "$r_status"},
              cash: { $sum: "$r_cash"}, 
              transfer: {$sum: "$r_transfer" },
              count: { $sum: 1 }
            }
        }
      ]
   )
      .sort({ createdAt: -1 });

  res.status(200).json({
    message: "Payable retrieved",
    data:customer_transcs
  } )
}catch (err) {
    next(err);
  }
};

exports.customerSummary = async (req, res) => {
  try {
    
    const customer_transcs = await Recieved.aggregate(
      [
        // {
        //   $match:{
        //     r_status: "pending"
        //   },
        // },
        {
          $group:
            {
              _id: "$transaction_id",
              cash: { $sum: "$r_cash"}, 
              transfer: {$sum: "$r_transfer" },
              count: { $sum: 1 }
            }
        }
      ]
   )
      .sort({ createdAt: -1 });

  res.status(200).json({
    message: "Customer Summary retrieved",
    data:customer_transcs
  } )
}catch (err) {
    next(err);
  }
};

exports.todayBuy = async (req, res) => {
  
};

exports.todaySell = async (req, res) => {
  
};

exports.pendingGive = async (req, res) => {
  try {
    const pagination = req.query.pagination
      ? parseInt(req.query.pagination)
      : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const customer_transcs = await Given.find({
      g_status: "pending",
    })
      .skip((page - 1) * pagination)
      .limit(pagination)
      .populate("user")
      .sort({ createdAt: -1 });

      const stringData = JSON.stringify(customer_transcs,["_id", "g_transfer", "g_status","createdAt","g_acct_name","g_acct_no","g_bank"])

    res.send(stringData);
  } catch (err) {
    next(err);
  }
};
exports.pending = async (req, res, next) => {
  try {
    const customer_transcs = await Customer_transc.findOne({
      _id: req.body.transactionId,
    });
    const recieved = await Recieved.findOne({
      transaction_id: req.body.transactionId,
    });
    const given = await Given.findOne({
      transaction_id: req.body.transactionId,
    });

    let data = {
      due: recieved.r_amount * customer_transcs.rate - given.g_amount,
      currency: given.g_currency,
      acct_name: given.g_acct_name,
      acct_no: given.g_acct_no,
      bank: given.g_bank,
    };
    console.log(given);
    res.send(data);
  } catch (err) {
    next(err);
  }
};
exports.completed = async (req, res) => {
  try {
    const pagination = req.query.pagination
      ? parseInt(req.query.pagination)
      : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const customer_transcs = await Customer_transc.find({
      r_status: "completed",
      g_status: "completed",
    })
      .skip((page - 1) * pagination)
      .limit(pagination)
      .populate("user")
      .sort({ createdAt: -1 });
    res.send(customer_transcs);
  } catch (err) {
    next(err);
  }
};

exports.show = async (req, res, next) => {
  try {
    const customer_transc = await Customer_transc.findOne({
      _id: req.params.id,
    }).populate("user");

    res.send(customer_transc);
  } catch (err) {
    next(err);
  }
};

exports.store = async (req, res, next) => {
  try {
    validationHandler(req);

    let customer_transc = new Customer_transc();

    if (req.body.type == "buy") {
      customer_transc.amount_due = req.body.amount * req.body.rate;
      customer_transc.amount_to_given = req.body.amount * req.body.rate;
      customer_transc.amount_to_recieve = req.body.amount;
      customer_transc.amount = req.body.amount;
      customer_transc.currency_given = "NGN";
      customer_transc.currency_recieved = req.body.currency;
    }
    if (req.body.type == "sell") {
      customer_transc.amount_due = req.body.amount * req.body.rate;
      customer_transc.amount_to_given = req.body.amount;
      customer_transc.amount_to_recieve = req.body.amount * req.body.rate;
      customer_transc.amount = req.body.amount;
      customer_transc.currency_given = req.body.currency;
      customer_transc.currency_recieved = "NGN";
    }
    customer_transc.cashier = req.body.cashier;
    customer_transc.type = req.body.type;
    customer_transc.rate = req.body.rate;
    customer_transc.customer = req.body.customer_name;
    customer_transc.phone = req.body.customer_phone;
    customer_transc = await customer_transc.save();

    let data = {
      transaction_id: customer_transc._id,
      // type: customer_transc.type,
      r_currency: customer_transc.currency_recieved,
      g_currency: customer_transc.currency_given,
      amount_to_recieve: customer_transc.amount_to_recieve,
      amount_to_give: customer_transc.amount_to_give,
      // amount: customer_transc.amount,
      // rate: customer_transc.rate,
      amount_due: customer_transc.amount_due,
    };
    res.send(data);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    validationHandler(req);

    let customer_transc = await Customer_transc.findById(req.params.id);

    customer_transc = await customer_transc.save();

    res.send(customer_transc);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    let customer_transc = await Customer_transc.findById(req.params.id);

    await customer_transc.delete();

    res.send({ message: "success" });
  } catch (err) {
    next(err);
  }
};
