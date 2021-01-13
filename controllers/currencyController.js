const { data } = require("jquery");
const Currency = require("../models/currency");
const Exchange = require("../models/exchanges")
const validationHandler = require("../validations/validationHandler");

exports.index = async (req, res) => {
  try {
    const pagination = req.query.pagination
      ? parseInt(req.query.pagination)
      : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const currencies = await Currency.find({})
      .skip((page - 1) * pagination)
      .limit(pagination)
      .sort({ createdAt: -1 });
    res.send(currencies);
  } catch (err) {
    next(err);
  }
};

exports.show = async (req, res) => {
  try {
    const { name, active, rate, type } = req.body

    // const docs = await Exchange.find({name: { $regex: '.*' + name + '.*' }, active: true, type:type}).limit(5);
    // console.log(docs);

    const currency = await Currency.findOne({
      name: req.params.id,
    });

    res.send(currency);
  } catch (err) {
    next(err);
  }
};

exports.getExchange = async (req, res) => {
  try {
    const { name, type } = req.body

  //   const start = Date.now();
  //   const datas = await Exchange.find({createdAt:{
  //                                 $gte: new Date(new Date(start).setHours(00, 00, 00)),
  //                                 $lt: new Date(new Date(start).setHours(23, 59, 59))
  //                               }}).sort({createdAt: -1})
  //                               console.log(datas);

  // const start = Date.now();
  // const datas = await Exchange.find({createdAt:{
  //                               $gte: new Date(new Date(start).setHours(00, 00, 00)),
  //                               $lt: new Date(new Date(start).setHours(23, 59, 59))
  //                             },
  //                             name: { $regex: '.*' + name + '.*' }, active: true, type:type}).sort({createdAt: -1})
  //                             console.log(datas);

    const docs = await Exchange.find({name: { $regex: '.*' + name + '.*' }, active: true, type:type}).limit(5).select('name rate');

    res.send(docs);
  } catch (err) {
    next(err);
  }
};

exports.store = async (req, res, next) => {
  try {
    validationHandler(req);
    const { name, selling, buying } = req.body

    const docs = await Currency.find({name: { $regex: '.*' + name + '.*' } }).limit(5);
    console.log(docs);
    const existingCurrency = await Currency.findOne({ name });
    if (existingCurrency) {
      const error = new Error("Currency already exist, please update or delete existing record");
      error.statusCode = 403;
      throw error;
    }
    let cur = new Currency();

    cur.name = name;
    cur.selling = selling;
    cur.buying = buying;

    let data = await cur.save();

    res.send(data);
  } catch (err) {
    next(err);
  }
};

exports.exchanges = async (req, res, next) => {
  try {
    validationHandler(req);
    const { name, active, rate, type } = req.body

    const docs = await Exchange.find({name: { $regex: '.*' + name + '.*' }, active: true, type:type}).limit(5);
    console.log(docs);
    const existingCurrency = await Exchange.findOne({ name, type});
    if (existingCurrency) {
      const error = new Error("Currency already exist, please update or delete existing record");
      error.statusCode = 403;
      throw error;
    }
    let cur = new Exchange();

    cur.name = name;
    cur.active = active;
    cur.rate = rate;
    cur.type = type;

    let data = await cur.save();

    res.send(data);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    validationHandler(req);

    let currency = await Currency.findById(req.params.id);

    currency.name = req.body.name;

    currency = await currency.save();

    res.send(currency);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    let currency = await Currency.findById(req.params.id);

    await currency.delete();

    res.send({ message: "success" });
  } catch (err) {
    next(err);
  }
};
