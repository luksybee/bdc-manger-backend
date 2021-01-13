const Transc_given = require("../models/transc_given");
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
  try {
    validationHandler(req);

    let transc_given = new Transc_given();
   
    transc_given = await transc_given.save();

    res.send(transc_given);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    validationHandler(req);

    let transc_given = await Transc_given.findById(req.params.id);
    
    transc_given = await transc_given.save();

    res.send(transc_given);
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