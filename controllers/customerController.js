const Customer = require("../models/customer");
const validationHandler = require("../validations/validationHandler");

exports.index = async (req, res) => {
  try {
    const pagination = req.query.pagination
      ? parseInt(req.query.pagination)
      : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const customers = await Customer.find({})
      .skip((page - 1) * pagination)
      .limit(pagination)
      .populate("customer")
      .sort({ createdAt: -1 });
    res.send(customers);
  } catch (err) {
    next(err);
  }
};

exports.show = async (req, res) => {
  console.log(req);
  try {
    const customer = await Customer.findOne({
      phone: req.params.phone,
    });

    res.send(customer);
  } catch (err) {
    next(err);
  }
};

exports.store = async (req, res, next) => {
  try {
    // validationHandler(req);

    const {name, phone} = req.body
    let customer = new Customer();

    customer.name = name;
    customer.phone = phone;

    customer = await customer.save();

    res.send(customer);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    validationHandler(req);

    let customer = await Customer.findById(req.params.id);

    customer.name = req.body.name;
    customer.phone = req.body.phone;
    customer = await customer.save();

    res.send(customer);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    let customer = await Customer.findById(req.params.id);

    await customer.delete();

    res.send({ message: "success" });
  } catch (err) {
    next(err);
  }
};
