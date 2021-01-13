const Expense = require("../models/expense");
const User = require("../models/user");
const validationHandler = require("../validations/validationHandler");

exports.add = async (req, res, next) => {
  try {
    let expense = new Expense();
    expense.cashier = req.body.cashier;
    expense.amount = req.body.amount;
    expense.method = req.body.method;
    expense.paid_to = req.body.paid_to;
    expense.paid_from = req.body.paid_from;
    expense.authorized_by = req.body.authorized_by;
    expense.remarks = req.body.remarks;

    expense = await expense.save();

    res.send(expense);
  } catch (error) {
    next(error);
  }
};
