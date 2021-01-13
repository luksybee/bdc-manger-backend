const Outflow = require("../models/outflow");
const User = require("../models/user");
const validationHandler = require("../validations/validationHandler");

exports.add = async (req, res, next) => {
  try {
    const {cashier, amount, method, curency, paid_from, acct_name, acct_no, bank, remarks} = req.body
    let outflow = new Outflow();
    
    outflow.cashier = cashier;
    outflow.amount = amount;
    outflow.method = method;
    outflow.curency = curency;
    outflow.paid_from = paid_from;
    outflow.acct_name = acct_name;
    outflow.acct_no = acct_no;
    outflow.bank = bank;
    outflow.remarks = remarks;

    outflow = await outflow.save();

    res.send(outflow);
  } catch (error) {
    next(error);
  }
};

exports.recieve = async (req, res) => {
  try {
    let cashier = await User.findById(req.body.id);

    let bals = Number(cashier.balance) + Number(req.body.amount);

    let query = req.body.id;
    let update = { balance: bals };
    let options = { upsert: true, new: true, setDefaultsOnInsert: true };
    let balance = await User.findOneAndUpdate(query, update, options);

    let bal = new Balance();

    bal.amount = req.body.amount;
    bal.curency = req.body.curency;
    bal.transfer_from = req.body.transfer_from;
    bal.transfer_to = req.body.tranfer_to;
    bal.status = req.body.status;
    bal.remarks = req.body.remarks;

    balc = await bal.save();

    res.send(balance.balance);
  } catch (error) {
    next(error);
  }
};
