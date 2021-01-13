const Inflow = require("../models/inflow");
const User = require("../models/user");
const validationHandler = require("../validations/validationHandler");

exports.add = async (req, res, next) => {
  try {
    let inflow = new Inflow();
    inflow.cashier = req.body.cashier;
    inflow.method = req.body.method;
    inflow.amount = req.body.amount;
    inflow.curency = req.body.curency;
    inflow.remarks = req.body.remarks;
    inflow.recievedfrom = req.body.recievedfrom;
    inflow.bank = req.body.bank;
    inflow.sub_account = req.body.sub_account;

    inflow = await inflow.save();

    res.send(inflow);
  } catch (error) {
    next(error);
  }
};
